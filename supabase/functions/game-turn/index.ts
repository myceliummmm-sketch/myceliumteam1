import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are the Game Master for "Ship It" - a product development simulation game.

TEAM MEMBERS (respond in character):
- ever: The eternal optimist, always sees possibilities, uses encouraging language
- prisma: Data-driven analyst, asks for metrics, loves A/B tests
- toxic: Skeptical realist, points out edge cases and potential failures
- phoenix: Embraces change, suggests pivots enthusiastically
- techpriest: Deep technical expert, discusses architecture and patterns
- virgil: Wise guide through complexity, provides context and wisdom
- zen: Calm mediator, balances team dynamics

CURRENT PHASE RULES:
- INCEPTION: Define the product vision, identify user problems
- RESEARCH: Validate assumptions, gather user feedback
- DESIGN: Create mockups, plan user flows
- BUILD: Write code, implement features
- TEST: QA, bug fixes, performance optimization
- SHIP: Deploy, monitor, celebrate launch

GAME MECHANICS:
- Each turn costs 1 energy (user has 10 max, regenerates daily)
- Award 10-50 XP for good decisions and completed sub-tasks
- 100 XP per level
- Code health (0-100) degrades with rushed decisions
- Phase transitions happen when major milestones are reached
- Team mood affects dialogue tone

RESPONSE FORMAT (must be valid JSON):
{
  "segments": [
    {"type": "speech", "speaker": "ever", "content": "Great idea! Let's start with..."},
    {"type": "narration", "content": "The team huddles around the whiteboard..."},
    {"type": "speech", "speaker": "toxic", "content": "But what about..."}
  ],
  "gameEvents": [
    {"type": "XP_GAIN", "data": {"amount": 25, "reason": "Defined clear user persona"}},
    {"type": "TASK_COMPLETE", "data": {"taskId": "task-1"}},
    {"type": "TASK_ADDED", "data": {"description": "Research competitor apps", "xpReward": 30, "phase": "RESEARCH"}}
  ]
}

Make responses engaging, advance the story, and generate appropriate game events. Keep speeches concise (2-3 sentences max per character).`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, sessionId } = await req.json();

    // Fetch game context
    const { data: session } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const { data: gameState } = await supabase
      .from('game_states')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(10);

    const contextMessages = (recentMessages || []).reverse();

    // Build AI context
    const gameContext = `
CURRENT GAME STATE:
- Phase: ${gameState?.current_phase || 'INCEPTION'}
- Level: ${gameState?.level || 1} | XP: ${gameState?.xp || 0}
- Energy: ${gameState?.energy || 10}/10
- Code Health: ${gameState?.code_health || 100}/100
- Active Tasks: ${JSON.stringify(gameState?.current_tasks || [])}
- Team Mood: ${JSON.stringify(gameState?.team_mood || {})}

RECENT CONVERSATION:
${contextMessages.map(m => `${m.role}: ${m.content}`).join('\n')}
`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'system', content: gameContext },
          { role: 'user', content: message }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI error:', aiResponse.status, errorText);
      throw new Error(`AI request failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    const parsedResponse = JSON.parse(aiContent);

    // Save user message
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: message,
      segments: [{ type: 'speech', content: message }],
      game_events: []
    });

    // Save AI response
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'assistant',
      content: JSON.stringify(parsedResponse.segments),
      segments: parsedResponse.segments,
      game_events: parsedResponse.gameEvents || []
    });

    // Process game events and update state
    const updatedState = { ...gameState };
    let energyDelta = -1; // Cost 1 energy per turn
    
    for (const event of parsedResponse.gameEvents || []) {
      switch (event.type) {
        case 'XP_GAIN':
          updatedState.xp = (updatedState.xp || 0) + event.data.amount;
          const xpForLevel = updatedState.level * 100;
          if (updatedState.xp >= xpForLevel) {
            updatedState.level = (updatedState.level || 1) + 1;
            updatedState.xp -= xpForLevel;
            parsedResponse.gameEvents.push({
              type: 'LEVEL_UP',
              data: { newLevel: updatedState.level }
            });
          }
          break;
        
        case 'TASK_COMPLETE':
          const tasks = updatedState.current_tasks || [];
          const taskIndex = tasks.findIndex((t: any) => t.id === event.data.taskId);
          if (taskIndex >= 0) {
            const completedTask = tasks[taskIndex];
            updatedState.completed_tasks = [...(updatedState.completed_tasks || []), completedTask];
            updatedState.current_tasks = tasks.filter((_: any, i: number) => i !== taskIndex);
          }
          break;
        
        case 'TASK_ADDED':
          const newTask = {
            id: crypto.randomUUID(),
            description: event.data.description,
            xpReward: event.data.xpReward,
            phase: event.data.phase,
            completed: false
          };
          updatedState.current_tasks = [...(updatedState.current_tasks || []), newTask];
          break;

        case 'ENERGY_UPDATE':
          energyDelta += event.data.delta;
          break;

        case 'CODE_HEALTH_UPDATE':
          updatedState.code_health = Math.max(0, Math.min(100, 
            (updatedState.code_health || 100) + event.data.delta
          ));
          break;

        case 'PHASE_CHANGE':
          updatedState.current_phase = event.data.newPhase;
          await supabase.from('game_sessions').update({
            current_phase: event.data.newPhase
          }).eq('id', sessionId);
          break;
      }
    }

    updatedState.energy = Math.max(0, Math.min(10, (updatedState.energy || 10) + energyDelta));

    // Save updated game state
    await supabase.from('game_states').insert({
      session_id: sessionId,
      ...updatedState
    });

    return new Response(JSON.stringify({
      segments: parsedResponse.segments,
      gameEvents: parsedResponse.gameEvents,
      updatedState
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Game turn error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
