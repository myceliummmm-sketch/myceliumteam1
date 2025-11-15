import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGameStore } from '@/stores/gameStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';
import { calculateEnergyRegeneration } from '@/lib/energySystem';
import { calculateStreak, getStreakMilestone } from '@/lib/streakSystem';
import { format } from 'date-fns';
import { useSound } from '@/hooks/useSound';
import { generateQuickReplies } from '@/lib/quickReplies';
import { LEGENDARY_ARTIFACTS } from '@/lib/artifacts';
import { createArtifactFromDefinition, applyArtifactBonuses } from '@/lib/artifactSystem';
import { ArtifactId, ConversationMode, Phase, TeamMember } from '@/types/game';
import { MODE_CONFIGS, isModeUnlocked } from '@/lib/modeConfig';
import { PROMPT_TEMPLATES } from '@/lib/promptTemplates';

export function useGameSession() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { setSessionId, updateStats, addMessage, setLoading: setGameLoading, setShowTutorial, setQuickReplies, setAiSuggestedActions } = useGameStore();
  const { playSound } = useSound();

  useEffect(() => {
    if (!user) return;
    
    // Make user available globally for analytics tracking
    (window as any).supabaseUser = user;

    const initSession = async () => {
      try {
        // Clear any existing messages from initial state
        useGameStore.getState().clearMessages();
        
        // Check for active session
        const { data: existingSession } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('player_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        let sessionId = existingSession?.id;

        if (!existingSession) {
          // Create new session
          const { data: newSession, error } = await supabase
            .from('game_sessions')
            .insert({
              player_id: user.id,
              current_phase: 'SPARK',
              is_active: true
            })
            .select()
            .single();

          if (error) throw error;
          sessionId = newSession.id;

          // Create initial game state
          await supabase.from('game_states').insert({
            session_id: sessionId,
            xp: 0,
            level: 1,
            spores: 0,
            energy: 10,
            streak: 0,
            code_health: 100,
            current_phase: 'SPARK',
            completed_tasks: [],
            current_tasks: [
              {
                id: crypto.randomUUID(),
                description: 'Define your product vision and target user',
                xpReward: 25,
                phase: 'SPARK',
                completed: false
              },
              {
                id: crypto.randomUUID(),
                description: 'Identify the core problem you\'re solving',
                xpReward: 25,
                phase: 'SPARK',
                completed: false
              },
              {
                id: crypto.randomUUID(),
                description: 'Brainstorm solution approaches with the team',
                xpReward: 30,
                phase: 'SPARK',
                completed: false
              }
            ],
            blockers: [],
            milestones: [],
            team_mood: {
              ever: 'happy',
              prisma: 'neutral',
              toxic: 'neutral',
              phoenix: 'excited',
              techpriest: 'neutral',
              virgil: 'neutral',
              zen: 'happy'
            }
          });

          // Seed prompt templates if not already seeded
          const { data: existingTemplates } = await supabase
            .from('prompt_library')
            .select('id')
            .eq('is_template', true)
            .limit(1);

          if (!existingTemplates || existingTemplates.length === 0) {
            const templatesWithMetadata = PROMPT_TEMPLATES.map(template => ({
              ...template,
              player_id: user.id,
              is_template: true,
              version: 1,
            }));
            
            await supabase
              .from('prompt_library')
              .insert(templatesWithMetadata);
            
            console.log('Seeded', PROMPT_TEMPLATES.length, 'prompt templates');
          }

          // Add welcome message
          await supabase.from('chat_messages').insert({
            session_id: sessionId,
            role: 'assistant',
            content: 'Welcome to Ship It!',
            segments: [
              {
                type: 'narration',
                content: '🚀 Welcome to Ship It - where you build products with your AI team!'
              },
              {
                type: 'speech',
                speaker: 'ever',
                content: "Hi! I'm Ever, and I believe in the power of your idea! This team is here to help you go from vision to launch."
              },
              {
                type: 'speech',
                speaker: 'prisma',
                content: "I'm Prisma. I'll keep us focused on data and validation. Let's start with the basics: what problem are you solving?"
              },
              {
                type: 'speech',
                speaker: 'zen',
                content: "And I'm Zen. I'll make sure we build sustainably and don't burn out. Take your time, this is your journey."
              },
              {
                type: 'narration',
                content: '💡 You\'re in the SPARK phase. Your first quest: define your product vision and identify the core problem you\'re solving.'
              }
            ],
            game_events: []
          });
        }

        setSessionId(sessionId!);

        // Load latest game state
        const { data: latestState } = await supabase
          .from('game_states')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestState) {
          // Check for energy regeneration
          let currentEnergy = latestState.energy;
          let energyGained = 0;
          
          if (latestState.last_energy_update) {
            const { newEnergy, energyGained: gained } = calculateEnergyRegeneration(
              new Date(latestState.last_energy_update),
              latestState.energy
            );
            currentEnergy = newEnergy;
            energyGained = gained;
          }

          // Load player artifacts
          const { data: playerArtifacts } = await supabase
            .from('player_artifacts')
            .select('artifact_id, unlocked_at')
            .eq('player_id', user.id);

          // Create full artifact objects
          const artifacts = Object.keys(LEGENDARY_ARTIFACTS).map((artifactId) => {
            const unlockedArtifact = playerArtifacts?.find(
              (pa) => pa.artifact_id === artifactId
            );
            return createArtifactFromDefinition(
              artifactId as ArtifactId,
              !!unlockedArtifact
            );
          });

          // Calculate artifact bonuses
          const artifactBonuses = applyArtifactBonuses(artifacts);

          updateStats({
            xp: latestState.xp,
            level: latestState.level,
            spores: latestState.spores,
            energy: currentEnergy,
            streak: latestState.streak,
            codeHealth: latestState.code_health,
            currentPhase: latestState.current_phase as any,
            completedTasks: latestState.completed_tasks as any,
            currentTasks: latestState.current_tasks as any,
            blockers: latestState.blockers as any,
            milestones: latestState.milestones as any,
            teamMood: latestState.team_mood as any,
            bossBlockersDefeated: (latestState.boss_blockers_defeated as any) || [],
            artifacts,
            artifactBonuses,
            lastEnergyUpdate: latestState.last_energy_update ? new Date(latestState.last_energy_update) : new Date()
          });

          // Show welcome back message if energy regenerated
          if (energyGained > 0) {
            toast.success(`Welcome back! +${energyGained} energy restored`, {
              description: 'Your team is recharged and ready!',
              duration: 4000
            });
          }

          // Update energy in database if it changed
          if (energyGained > 0) {
            await supabase
              .from('game_states')
              .insert({
                session_id: sessionId,
                ...latestState,
                energy: currentEnergy,
                last_energy_update: new Date().toISOString()
              });
          }
        }

        // Handle daily login for streaks
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data: todayLogin } = await supabase
          .from('daily_logins')
          .select('*')
          .eq('player_id', user.id)
          .eq('login_date', today)
          .maybeSingle();

        if (!todayLogin) {
          // Record today's login
          await supabase.from('daily_logins').insert({
            player_id: user.id,
            login_date: today
          });

          // Fetch recent logins to calculate streak
          const { data: recentLogins } = await supabase
            .from('daily_logins')
            .select('login_date')
            .eq('player_id', user.id)
            .order('login_date', { ascending: false })
            .limit(100);

          if (recentLogins) {
            const loginDates = recentLogins.map(l => l.login_date);
            const currentStreak = calculateStreak(loginDates);
            
            updateStats({ streak: currentStreak });

            // Check for milestone
            const milestone = getStreakMilestone(currentStreak);
            if (milestone) {
              toast.success(`${milestone.emoji} ${milestone.title}!`, {
                description: `+${milestone.reward} Spores earned!`,
                duration: 5000
              });
              
              // Update spores
              const currentSpores = useGameStore.getState().spores;
              updateStats({ spores: currentSpores + milestone.reward });
            }
          }
        }

        // Check tutorial status
        const { data: playerProgress } = await supabase
          .from('player_progress')
          .select('*')
          .eq('player_id', user.id)
          .maybeSingle();

        if (!playerProgress) {
          // First time player - create progress and show tutorial
          await supabase.from('player_progress').insert({
            player_id: user.id,
            has_completed_tutorial: false,
            tutorial_step: 0
          });

          updateStats({
            showTutorial: true,
            tutorialStep: 0,
            hasCompletedTutorial: false
          });
        } else if (!playerProgress.has_completed_tutorial) {
          // Resume tutorial
          updateStats({
            showTutorial: true,
            tutorialStep: playerProgress.tutorial_step,
            hasCompletedTutorial: false
          });
        } else {
          updateStats({
            hasCompletedTutorial: true
          });
        }

        // Load message history
        const { data: messages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (messages) {
          messages.forEach(msg => {
            // Ensure segments is always an array
            let segments = msg.segments;
            if (!Array.isArray(segments)) {
              segments = segments ? [segments] : [];
            }
            
            addMessage({
              id: msg.id,
              role: msg.role as any,
              content: msg.content,
              segments: segments as any,
              gameEvents: msg.game_events as any,
              createdAt: new Date(msg.created_at)
            });
          });
        }

        // Generate initial quick replies (no AI suggestions yet)
        const currentState = useGameStore.getState();
        const initialReplies = generateQuickReplies(currentState, []);
        setQuickReplies(initialReplies);

      } catch (error) {
        console.error('Failed to initialize session:', error);
        toast.error('Failed to load game session');
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [user]);

  const sendMessage = async (message: string, preferredSpeaker?: string | null) => {
    const conversationMode = useGameStore.getState().conversationMode;
    const store = useGameStore.getState();
    const sessionId = store.sessionId;
    if (!sessionId) return;

    // Add user message immediately
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      segments: [{ type: 'speech', content: message }],
      gameEvents: [],
      createdAt: new Date()
    });

    setGameLoading(true);

    // Track message sent event (fire and forget)
    if (user) {
      void supabase.from('user_events').insert({
        player_id: user.id,
        session_id: sessionId,
        event_type: 'message_sent',
        event_category: 'gameplay',
        event_data: {
          message_length: message.length,
          current_phase: store.currentPhase,
          energy_remaining: store.energy - 1,
          preferred_speaker: preferredSpeaker || 'auto'
        },
        page_url: window.location.pathname
      });
    }

    try {
      const { data, error } = await supabase.functions.invoke('game-turn', {
        body: { message, sessionId, preferredSpeaker, conversationMode }
      });

      if (error) throw error;

      // Add AI response to store
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: JSON.stringify(data.segments),
        segments: data.segments,
        gameEvents: data.gameEvents,
        createdAt: new Date()
      });

      // Store AI-suggested actions
      const aiActions = data.suggestedActions || [];
      setAiSuggestedActions(aiActions);

      // Update game state
      updateStats(data.updatedState);
      
      // Process game events for toasts and sounds
      const processGameEvents = useGameStore.getState().processGameEvents;
      processGameEvents(data.gameEvents);

      // Play sounds for key events and check for mode unlocks
      const levelUpEvent = data.gameEvents?.find((e: any) => e.type === 'LEVEL_UP');
      if (levelUpEvent) {
        playSound('levelUp');
        
        // Check for newly unlocked modes
        const newLevel = levelUpEvent.data.newLevel;
        const currentPhase = data.updatedState?.current_phase || store.currentPhase;
        const unlockedModes = store.unlockedModes;
        
        const newlyUnlockedModes = Object.keys(MODE_CONFIGS).filter((mode) => {
          const isNowUnlocked = isModeUnlocked(
            mode as ConversationMode,
            newLevel,
            currentPhase as Phase,
            []
          );
          const wasUnlocked = unlockedModes.includes(mode as ConversationMode);
          return isNowUnlocked && !wasUnlocked;
        });
        
        // Unlock and notify for each new mode
        newlyUnlockedModes.forEach((mode) => {
          const config = MODE_CONFIGS[mode as ConversationMode];
          store.unlockMode(mode as ConversationMode);
          
          toast.success(`🎉 New Mode Unlocked: ${config.name}`, {
            description: config.description,
            duration: 5000,
          });
        });
      }

      // Show XP gain (level up modal handles level up celebration)
      const xpGainEvent = data.gameEvents?.find((e: any) => e.type === 'XP_GAIN');
      if (xpGainEvent && xpGainEvent.data.amount > 0) {
        toast.success(`⭐ +${xpGainEvent.data.amount} XP`, {
          description: xpGainEvent.data.reason || 'Great progress!',
          duration: 3000
        });
      }
      
      // Show phase change and suggest prompts
      const phaseChangeEvent = data.gameEvents?.find((e: any) => e.type === 'PHASE_CHANGE');
      if (phaseChangeEvent) {
        playSound('phaseChange');
        toast.success(`🚀 Phase Change: ${phaseChangeEvent.data.newPhase}`, {
          description: 'New challenges await!',
          duration: 4000
        });
        
        // Auto-suggest relevant prompts for this phase
        const newPhase = phaseChangeEvent.data.newPhase as Phase;
        suggestPromptsForPhase(newPhase);
      }
      
      // Show task completion
      const taskCompleteEvent = data.gameEvents?.find((e: any) => e.type === 'TASK_COMPLETE');
      if (taskCompleteEvent) {
        playSound('taskComplete');
        toast.success(`✅ Task Complete!`, {
          description: 'Keep up the great work!',
          duration: 3000
        });
      }
      
      // Show energy warning
      if (data.updatedState?.energy !== undefined && data.updatedState.energy < 3) {
        toast.warning(`⚡ Low Energy: ${data.updatedState.energy}/10`, {
          description: 'Take a break soon!',
          duration: 4000
        });
      }

      // Generate quick replies based on updated game state and AI suggestions
      const currentState = useGameStore.getState();
      const replies = generateQuickReplies(currentState, aiActions);
      setQuickReplies(replies);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setGameLoading(false);
    }
  };

  const suggestPromptsForPhase = async (phase: Phase) => {
    if (!user) return;
    
    // Query for template prompts matching this phase
    const { data: phasePrompts } = await supabase
      .from('prompt_library')
      .select('*')
      .eq('phase', phase)
      .eq('is_template', true)
      .limit(3);
    
    if (phasePrompts && phasePrompts.length > 0) {
      const getPhaseDescription = (p: Phase): string => {
        const descriptions: Record<Phase, string> = {
          'SPARK': 'define your vision and problem',
          'EXPLORE': 'validate assumptions and understand users',
          'CRAFT': 'plan your solution and user experience',
          'FORGE': 'implement features with quality',
          'POLISH': 'ensure everything works perfectly',
          'LAUNCH': 'launch successfully and monitor',
        };
        return descriptions[p] || 'succeed';
      };

      const suggestionSegments = [
        {
          type: 'narration' as const,
          content: `🎯 Welcome to ${phase} phase!`
        },
        {
          type: 'speech' as const,
          speaker: 'prisma' as TeamMember,
          content: `I've prepared some helpful prompt templates for this phase. Check your Prompt Library for:\n${phasePrompts.map(p => `• ${p.title}`).join('\n')}\n\nThey'll help you ${getPhaseDescription(phase)}.`
        }
      ];
      
      // Add as system message
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Phase suggestions',
        segments: suggestionSegments,
        gameEvents: [],
        createdAt: new Date()
      });
      
      // Show notification
      toast.info(`📚 ${phasePrompts.length} prompts ready for ${phase}`, {
        description: 'Check your Prompt Library',
        duration: 5000
      });
    }
  };

  return { loading, sendMessage };
}
