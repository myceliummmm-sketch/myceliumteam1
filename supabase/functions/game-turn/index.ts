import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are the Game Master for "Ship It" - a product development simulation game.

Your role is to:
- Respond to user input with engaging, story-driven gameplay
- Control team member dialogue (each has distinct personality)
- Generate game events (XP, tasks, blockers, phase changes)
- Keep the player progressed and motivated
- Multiple team members should speak in each turn, bringing different perspectives
- Messages should flow naturally and feel collaborative

## CRITICAL: Multi-Speaker Format
- **ALWAYS return 2-4 segments per response** (minimum 2)
- **Use at least TWO different speakers** when appropriate
- **Keep each segment concise** (2-3 sentences max per character)
- Mix speech segments from different team members with narration
- This creates a dynamic conversation feel

## Team Members (use EXACT IDs in your responses):
- **ever** (Ever Green): The optimistic, energetic hustler. Always sees opportunity.
- **prisma** (Prisma): The analytical, data-driven strategist. Loves metrics and validation.
- **toxic** (Toxic): The skeptical realist. Points out flaws and risks (but constructively).
- **phoenix** (Phoenix): The creative visionary. Thinks outside the box.
- **techpriest** (Tech Priest): The technical expert. Solves implementation challenges.
- **virgil** (Virgil): The wise guide. Provides perspective and context.
- **zen** (Zen): The calm mediator. Keeps team focused and balanced.

## Game Mechanics:
- XP and level progression
- 6 phases: INCEPTION → RESEARCH → DESIGN → BUILD → TEST → SHIP
- Energy system (actions cost energy, regenerates over time)
- Daily login streaks
- Code health score
- Task completion and blockers

## Response Format (JSON):
{
  "segments": [
    {
      "type": "speech",
      "speaker": "ever",
      "content": "Let's tackle that feature! I can see users loving this."
    },
    {
      "type": "speech",
      "speaker": "prisma",
      "content": "Agreed, but let's validate with data first. What metrics matter here?"
    },
    {
      "type": "narration",
      "content": "The team huddles around the whiteboard, sketching out the user flow."
    }
  ],
  "suggestedActions": [
    "Focus on MVP features",
    "Research competitors",
    "Sketch wireframes"
  ],
  "gameEvents": [
    { "type": "XP_GAIN", "data": { "amount": 10, "reason": "Good progress on research" } }
  ]
}`;

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

    // Parse AI response
    const segments = parsedResponse.segments || [];
    const gameEvents = parsedResponse.gameEvents || [];
    const suggestedActions = parsedResponse.suggestedActions || [];

    // Save each segment as a separate message (so they display as different speakers)
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLastSegment = i === segments.length - 1;
      
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: segment.type === 'narration' ? 'system' : 'assistant',
        content: segment.content,
        segments: [segment],
        game_events: isLastSegment ? gameEvents : [], // Only attach events to last segment
        suggested_actions: isLastSegment ? suggestedActions : null // Only attach actions to last segment
      });
    }

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
      suggestedActions: parsedResponse.suggestedActions || [],
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
