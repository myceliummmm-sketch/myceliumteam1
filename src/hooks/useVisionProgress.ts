import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/stores/gameStore';
import { supabase } from '@/integrations/supabase/client';
import { VisionSubStageProgress, createInitialVisionState } from '@/lib/visionFlowEngine';

export function useVisionProgress() {
  const { user } = useAuth();
  const sessionId = useGameStore(state => state.sessionId);
  const [subStages, setSubStages] = useState<VisionSubStageProgress[]>(createInitialVisionState().subStages);
  const [currentSubStage, setCurrentSubStage] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [stageStartTime, setStageStartTime] = useState<number>(Date.now());

  // Load progress from database
  useEffect(() => {
    if (!user || !sessionId) return;

    const loadProgress = async () => {
      const { data, error } = await supabase
        .from('vision_progress')
        .select('*')
        .eq('player_id', user.id)
        .eq('session_id', sessionId)
        .order('sub_stage_number', { ascending: true });

      if (!error && data) {
        const loaded: VisionSubStageProgress[] = [1, 2, 3, 4].map(num => {
          const record = data.find(d => d.sub_stage_number === num);
          if (record) {
            return {
              subStageNumber: num as 1 | 2 | 3 | 4,
              templateId: record.template_id,
              filledValues: record.filled_values as Record<string, string>,
              cardId: record.card_id,
              completed: !!record.completed_at,
              completedAt: record.completed_at ? new Date(record.completed_at) : null
            };
          }
          return {
            subStageNumber: num as 1 | 2 | 3 | 4,
            templateId: null,
            filledValues: {},
            cardId: null,
            completed: false,
            completedAt: null
          };
        });

        setSubStages(loaded);
        
        // Find first uncompleted
        const firstUncompleted = loaded.find(s => !s.completed);
        if (firstUncompleted) {
          setCurrentSubStage(firstUncompleted.subStageNumber);
        } else {
          setCurrentSubStage(4); // All complete
        }
      }

      setIsLoading(false);
    };

    loadProgress();
  }, [user, sessionId]);

  // Reset timer when stage changes
  useEffect(() => {
    setStageStartTime(Date.now());
  }, [currentSubStage]);

  const saveSubStageProgress = async (
    subStageNumber: 1 | 2 | 3 | 4,
    templateId: string,
    filledValues: Record<string, string>,
    cardId?: string
  ) => {
    if (!user || !sessionId) return;

    const { error } = await supabase
      .from('vision_progress')
      .upsert({
        player_id: user.id,
        session_id: sessionId,
        sub_stage_number: subStageNumber,
        template_id: templateId,
        filled_values: filledValues,
        card_id: cardId || null,
        completed_at: cardId ? new Date().toISOString() : null
      }, {
        onConflict: 'player_id,session_id,sub_stage_number'
      });

    if (!error) {
      setSubStages(prev => prev.map(s => 
        s.subStageNumber === subStageNumber
          ? {
              ...s,
              templateId,
              filledValues,
              cardId: cardId || s.cardId,
              completed: !!cardId,
              completedAt: cardId ? new Date() : s.completedAt
            }
          : s
      ));

      // Move to next stage if completed
      if (cardId && subStageNumber < 4) {
        setCurrentSubStage((subStageNumber + 1) as 1 | 2 | 3 | 4);
      }
    }
  };

  return {
    subStages,
    currentSubStage,
    setCurrentSubStage,
    saveSubStageProgress,
    isLoading,
    stageStartTime
  };
}
