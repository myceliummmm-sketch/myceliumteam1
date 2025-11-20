import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentStage } from '@/lib/stageSystem';

export function useInputHint() {
  const { 
    currentPhase, energy, messages, blockers, 
    currentInputHint, setCurrentInputHint, setIsLoadingHint,
    lastHintGeneratedAt, hintTriggerCount, sessionId, phaseStage
  } = useGameStore();

  const generateHint = async () => {
    // Rate limiting: max 1 hint per 2 minutes
    if (lastHintGeneratedAt && Date.now() - lastHintGeneratedAt < 120000) {
      return;
    }

    setIsLoadingHint(true);

    try {
      const currentStage = getCurrentStage(currentPhase, phaseStage?.stageProgress || 0);
      
      const context = {
        currentPhase,
        currentStage: {
          label: currentStage.label,
          actions: currentStage.actions
        },
        stageProgress: phaseStage?.stageProgress || 0,
        energy,
        recentActions: messages
          .slice(-5)
          .filter(m => m.role === 'user')
          .map(m => m.content.slice(0, 50)),
        blockers: blockers
          .filter(b => !b.resolvedAt)
          .map(b => ({ 
            type: b.type, 
            description: b.description.slice(0, 40) 
          })),
        lastMessage: messages[messages.length - 1]?.content.slice(0, 100) || '',
      };

      const { data, error } = await supabase.functions.invoke('generate-input-hint', {
        body: { context, sessionId }
      });

      if (!error && data?.hint) {
        setCurrentInputHint(data.hint);
        useGameStore.setState({ lastHintGeneratedAt: Date.now() });
      }
    } catch (error) {
      console.error('Failed to generate hint:', error);
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Generate hint on mount
  useEffect(() => {
    if (!lastHintGeneratedAt) {
      generateHint();
    }
  }, []);

  // Trigger hint on major context changes
  useEffect(() => {
    const activeBlockers = blockers.filter(b => !b.resolvedAt).length;
    const shouldRegenerate = 
      activeBlockers > 0 || // New blocker
      energy < 3 || // Low energy
      hintTriggerCount >= 5; // Every 5 messages

    if (shouldRegenerate) {
      generateHint();
      useGameStore.setState({ hintTriggerCount: 0 });
    }
  }, [currentPhase, blockers.length, energy, hintTriggerCount]);

  return { currentInputHint, generateHint };
}
