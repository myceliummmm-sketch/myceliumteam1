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
- BOSS BLOCKERS: Major challenges that appear at specific levels/phases and must be overcome for legendary artifacts

CTA GENERATION RULES (CRITICAL - ALWAYS INCLUDE):
- ALWAYS include 3-4 "suggestedActions" in every response
- These are the action buttons the player will see - make them specific and compelling
- Actions must be short imperative phrases (e.g., "Start brainstorming", "Interview users", "Deploy to production")
- At least one action should advance the current phase toward completion
- One action should address active blockers if any exist
- One action can be a general guidance request (e.g., "What should I focus on?", "Review our progress")
- Examples by phase:
  • INCEPTION: "Define target audience", "Brainstorm solutions", "Research competitors", "Validate problem statement"
  • RESEARCH: "Interview 5 users", "Create user survey", "Analyze feedback", "Map user journey"
  • DESIGN: "Create wireframes", "Map user flows", "Review design system", "Prototype key screens"
  • BUILD: "Implement authentication", "Set up database", "Build API endpoints", "Write tests"
  • TEST: "Run QA checks", "Fix critical bugs", "Performance test", "User acceptance testing"
  • SHIP: "Deploy to production", "Set up monitoring", "Create launch plan", "Celebrate launch"

TASK GENERATION RULES (CRITICAL - ALWAYS FOLLOW):
- Generate 1-2 TASK_ADDED events per turn to maintain momentum
- Tasks MUST be specific and actionable (e.g., "Create user persona document" NOT "Think about users")
- Each phase should have 3-5 active tasks at any time
- Task XP rewards: 15-25 for small tasks, 30-50 for major milestones
- When a task is completed, immediately suggest a follow-up task
- Phase-specific task examples:
  • INCEPTION: "Define target user demographics", "Research 3 competitors", "Write problem statement"
  • RESEARCH: "Interview 5 potential users", "Analyze survey results", "Create user journey map"
  • DESIGN: "Create low-fidelity wireframes", "Map user flow", "Design core screens"
  • BUILD: "Implement authentication", "Set up database schema", "Build API endpoints"
  • TEST: "Write unit tests for auth", "Perform load testing", "Fix critical bugs"
  • SHIP: "Configure production environment", "Create launch checklist", "Deploy to production"

BLOCKER RESOLUTION:
- When a player addresses a blocker (especially boss blockers), acknowledge their progress
- Generate BLOCKER_RESOLVED event when conditions are met
- For boss blockers, make the resolution dramatic and rewarding

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
    {"type": "TASK_ADDED", "data": {"description": "Research competitor apps", "xpReward": 30, "phase": "RESEARCH"}},
    {"type": "BLOCKER_RESOLVED", "data": {"blockerId": "blocker-id"}}
  ],
  "suggestedActions": [
    "Interview 5 potential users",
    "Create user survey",
    "Analyze competitor feedback",
    "Show my progress"
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
    const activeBlockers = gameState?.blockers || [];
    const bossBlockersDefeated = gameState?.boss_blockers_defeated || [];
    
    const gameContext = `
CURRENT GAME STATE:
- Phase: ${gameState?.current_phase || 'INCEPTION'}
- Level: ${gameState?.level || 1} | XP: ${gameState?.xp || 0}
- Energy: ${gameState?.energy || 10}/10
- Code Health: ${gameState?.code_health || 100}/100
- Active Tasks: ${JSON.stringify(gameState?.current_tasks || [])}
- Active Blockers: ${JSON.stringify(activeBlockers)}
- Boss Blockers Defeated: ${bossBlockersDefeated.length}/3
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
    let aiContent = aiData.choices[0].message.content;
    
    // Strip markdown code blocks if present
    aiContent = aiContent.trim();
    if (aiContent.startsWith('```')) {
      // Remove opening ```json or ```
      aiContent = aiContent.replace(/^```(?:json)?\s*\n/, '');
      // Remove closing ```
      aiContent = aiContent.replace(/\n```\s*$/, '');
    }
    
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

    // Check for boss blocker spawn
    const BOSS_BLOCKERS = [
      {
        id: 'research_block',
        name: 'The Research Block',
        description: 'A massive wall of uncertainty blocking your path to user insights',
        lore: 'This ancient barrier appears when founders fear talking to users. Only deep research can shatter it.',
        minLevel: 8,
        phase: 'RESEARCH',
        rewards: { xp: 200, spores: 50, artifact: 'deepresearch' }
      },
      {
        id: 'technical_debt_demon',
        name: 'The Technical Debt Demon',
        description: 'A monstrous accumulation of shortcuts and hacks threatening your codebase',
        lore: 'Born from rushed decisions and "temporary" solutions, this demon grows stronger with each compromise.',
        minLevel: 18,
        phase: 'BUILD',
        rewards: { xp: 400, spores: 100, artifact: 'product' }
      },
      {
        id: 'launch_anxiety_beast',
        name: 'The Launch Anxiety Beast',
        description: 'The paralyzing fear of putting your work out into the world',
        lore: 'Every creator faces this beast. It whispers doubts and amplifies fears. Only courage can banish it.',
        minLevel: 28,
        phase: 'SHIP',
        rewards: { xp: 600, spores: 150, artifact: 'marketing' }
      }
    ];

    const existingBlockers = gameState?.blockers || [];
    
    // Check if we should spawn a boss blocker
    for (const boss of BOSS_BLOCKERS) {
      const alreadyDefeated = bossBlockersDefeated.includes(boss.id);
      const alreadyActive = existingBlockers.some((b: any) => 
        b.type === 'boss' && b.bossData?.name === boss.name
      );
      
      if (!alreadyDefeated && !alreadyActive) {
        const meetsLevel = (gameState?.level || 1) >= boss.minLevel;
        const meetsPhase = gameState?.current_phase === boss.phase;
        
        if (meetsLevel && meetsPhase) {
          // Spawn boss blocker
          parsedResponse.gameEvents.push({
            type: 'BLOCKER_ADDED',
            data: {
              description: boss.description,
              severity: 'high',
              type: 'boss',
              bossData: {
                name: boss.name,
                lore: boss.lore,
                defeatReward: boss.rewards
              }
            }
          });
          
          // Add dramatic narration
          parsedResponse.segments.push({
            type: 'narration',
            content: `⚔️ A BOSS BLOCKER APPEARS! ${boss.name} blocks your path forward!`
          });
          
          break; // Only spawn one boss at a time
        }
      }
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

        case 'BLOCKER_ADDED':
          const newBlocker = {
            id: crypto.randomUUID(),
            description: event.data.description,
            severity: event.data.severity,
            type: event.data.type || 'normal',
            bossData: event.data.bossData,
            createdAt: new Date().toISOString()
          };
          updatedState.blockers = [...(updatedState.blockers || []), newBlocker];
          break;

        case 'BLOCKER_RESOLVED':
          const blockers = updatedState.blockers || [];
          const resolvedBlocker = blockers.find((b: any) => b.id === event.data.blockerId);
          
          if (resolvedBlocker) {
            // Remove from blockers
            updatedState.blockers = blockers.filter((b: any) => b.id !== event.data.blockerId);
            
            // If it's a boss blocker, award rewards and track defeat
            if (resolvedBlocker.type === 'boss' && resolvedBlocker.bossData) {
              const bossRewards = resolvedBlocker.bossData.defeatReward;
              updatedState.xp = (updatedState.xp || 0) + bossRewards.xp;
              updatedState.spores = (updatedState.spores || 0) + bossRewards.spores;
              
              // Find boss ID from boss list
              const bossId = BOSS_BLOCKERS.find(b => b.name === resolvedBlocker.bossData.name)?.id;
              if (bossId) {
                updatedState.boss_blockers_defeated = [
                  ...(updatedState.boss_blockers_defeated || []),
                  bossId
                ];
              }
              
              // Track in blocker_resolutions
              await supabase.from('blocker_resolutions').insert({
                player_id: user.id,
                session_id: sessionId,
                blocker_id: resolvedBlocker.id,
                blocker_type: 'boss',
                boss_name: resolvedBlocker.bossData.name,
                xp_rewarded: bossRewards.xp,
                spores_rewarded: bossRewards.spores
              });
              
              // Add celebration event
              parsedResponse.gameEvents.push({
                type: 'XP_GAIN',
                data: { amount: bossRewards.xp, reason: `Defeated ${resolvedBlocker.bossData.name}!` }
              });
              parsedResponse.gameEvents.push({
                type: 'SPORES_GAIN',
                data: { amount: bossRewards.spores }
              });

              // Check for artifact unlocks
              const artifactDefs = {
                deepresearch: { minLevel: 10, bossesNeeded: 1, phases: ['INCEPTION', 'RESEARCH'] },
                product: { minLevel: 20, bossesNeeded: 2, phases: ['INCEPTION', 'RESEARCH', 'DESIGN', 'BUILD'] },
                marketing: { minLevel: 30, bossesNeeded: 3, phases: ['INCEPTION', 'RESEARCH', 'DESIGN', 'BUILD', 'TEST', 'SHIP'] }
              };

              const phaseOrder: Record<string, number> = { INCEPTION: 0, RESEARCH: 1, DESIGN: 2, BUILD: 3, TEST: 4, SHIP: 5 };
              const currentPhaseIndex = phaseOrder[updatedState.current_phase as string] || 0;
              const bossesDefeated = updatedState.boss_blockers_defeated.length;
              const currentLevel = updatedState.level;

              for (const [artifactId, requirements] of Object.entries(artifactDefs)) {
                // Check if already unlocked
                const { data: existingArtifact } = await supabase
                  .from('player_artifacts')
                  .select('*')
                  .eq('player_id', user.id)
                  .eq('artifact_id', artifactId)
                  .maybeSingle();

                if (!existingArtifact) {
                  // Check requirements
                  const meetsLevel = currentLevel >= requirements.minLevel;
                  const meetsBosses = bossesDefeated >= requirements.bossesNeeded;
                  const requiredPhaseIndex = Math.max(...requirements.phases.map((p: string) => phaseOrder[p] || 0));
                  const meetsPhase = currentPhaseIndex >= requiredPhaseIndex;

                  if (meetsLevel && meetsBosses && meetsPhase) {
                    // Unlock artifact!
                    await supabase.from('player_artifacts').insert({
                      player_id: user.id,
                      artifact_id: artifactId
                    });

                    // Add unlock event
                    parsedResponse.gameEvents.push({
                      type: 'ARTIFACT_UNLOCKED',
                      data: { artifactId }
                    });

                    // Add dramatic narration
                    const artifactNames: Record<string, string> = {
                      deepresearch: 'The Deepresearch Codex',
                      product: 'The Lovable Lens',
                      marketing: 'The Viral Scroll'
                    };
                    parsedResponse.segments.push({
                      type: 'narration',
                      content: `✨ LEGENDARY ARTIFACT UNLOCKED: ${artifactNames[artifactId]}! A powerful new tool has been added to your arsenal!`
                    });
                  }
                }
              }
            }
          }
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
