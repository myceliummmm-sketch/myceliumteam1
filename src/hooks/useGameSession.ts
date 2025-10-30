import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGameStore } from '@/stores/gameStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

export function useGameSession() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { setSessionId, updateStats, addMessage, setLoading: setGameLoading } = useGameStore();

  useEffect(() => {
    if (!user) return;

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
          .single();

        let sessionId = existingSession?.id;

        if (!existingSession) {
          // Create new session
          const { data: newSession, error } = await supabase
            .from('game_sessions')
            .insert({
              player_id: user.id,
              current_phase: 'INCEPTION',
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
            current_phase: 'INCEPTION',
            completed_tasks: [],
            current_tasks: [],
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

          // Add welcome message
          await supabase.from('chat_messages').insert({
            session_id: sessionId,
            role: 'assistant',
            content: 'Welcome to Ship It!',
            segments: [
              { type: 'speech', speaker: 'zen', content: 'Welcome, builder. I am Zen, and these are your teammates. Together, we will ship something amazing.' },
              { type: 'narration', content: 'The team gathers around. Ever Green grins optimistically, while Toxic crosses their arms skeptically. This is the beginning of your journey.' },
              { type: 'speech', speaker: 'ever', content: 'So exciting! What are we building today?' }
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
          .single();

        if (latestState) {
          updateStats({
            xp: latestState.xp,
            level: latestState.level,
            spores: latestState.spores,
            energy: latestState.energy,
            streak: latestState.streak,
            codeHealth: latestState.code_health,
            currentPhase: latestState.current_phase as any,
            completedTasks: latestState.completed_tasks as any,
            currentTasks: latestState.current_tasks as any,
            blockers: latestState.blockers as any,
            milestones: latestState.milestones as any,
            teamMood: latestState.team_mood as any
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
            addMessage({
              id: msg.id,
              role: msg.role as any,
              content: msg.content,
              segments: msg.segments as any,
              gameEvents: msg.game_events as any,
              createdAt: new Date(msg.created_at)
            });
          });
        }

      } catch (error) {
        console.error('Failed to initialize session:', error);
        toast.error('Failed to load game session');
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [user]);

  const sendMessage = async (message: string) => {
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

    try {
      const { data, error } = await supabase.functions.invoke('game-turn', {
        body: { message, sessionId }
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

      // Update game state
      updateStats(data.updatedState);
      
      // Process game events for toasts
      const processGameEvents = useGameStore.getState().processGameEvents;
      processGameEvents(data.gameEvents);

      // Show XP gain (level up modal handles level up celebration)
      const xpGainEvent = data.gameEvents?.find((e: any) => e.type === 'XP_GAIN');
      if (xpGainEvent && xpGainEvent.data.amount > 0) {
        toast.success(`⭐ +${xpGainEvent.data.amount} XP`, {
          description: xpGainEvent.data.reason || 'Great progress!',
          duration: 3000
        });
      }
      
      // Show phase change
      const phaseChangeEvent = data.gameEvents?.find((e: any) => e.type === 'PHASE_CHANGE');
      if (phaseChangeEvent) {
        toast.success(`🚀 Phase Change: ${phaseChangeEvent.data.newPhase}`, {
          description: 'New challenges await!',
          duration: 4000
        });
      }
      
      // Show task completion
      const taskCompleteEvent = data.gameEvents?.find((e: any) => e.type === 'TASK_COMPLETE');
      if (taskCompleteEvent) {
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

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setGameLoading(false);
    }
  };

  return { loading, sendMessage };
}
