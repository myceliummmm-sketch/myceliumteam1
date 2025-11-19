import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Target } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { supabase } from '@/integrations/supabase/client';
import { generateDailyChallenges, DailyChallenge } from '@/lib/dailyChallenges';
import { motion } from 'framer-motion';

export function DailyChallenges() {
  const currentPhase = useGameStore((state) => state.currentPhase);
  const phaseStage = useGameStore((state) => state.phaseStage);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrCreateChallenges();
  }, [currentPhase, phaseStage?.stageNumber]);

  async function loadOrCreateChallenges() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Try to load existing challenges for today
    const { data: existing } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('player_id', user.id)
      .eq('challenge_date', today);

    if (existing && existing.length > 0) {
      setChallenges(existing as any);
      setLoading(false);
      return;
    }

    // Generate new challenges for current stage
    const newChallenges = generateDailyChallenges(currentPhase, phaseStage?.stageNumber || 1);
    
    const { data: created } = await supabase
      .from('daily_challenges')
      .insert(
        newChallenges.map(c => ({
          player_id: user.id,
          challenge_date: today,
          phase: currentPhase,
          stage_number: phaseStage?.stageNumber || 1,
          challenge_type: 'action',
          challenge_text: c.challengeText,
          target_count: c.targetCount,
          xp_reward: c.xpReward,
          spores_reward: c.sporesReward
        }))
      )
      .select();

    if (created) {
      setChallenges(created as any);
    }
    setLoading(false);
  }

  if (loading || challenges.length === 0) return null;

  const completedCount = challenges.filter(c => c.completed).length;

  return (
    <Card className="p-3 bg-gradient-to-br from-primary/5 to-background border-primary/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Today's Challenges</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {completedCount}/{challenges.length}
        </Badge>
      </div>

      <div className="space-y-2">
        {challenges.map((challenge, idx) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-start gap-2 p-2 rounded text-xs ${
              challenge.completed ? 'bg-green-500/10' : 'bg-background/50'
            }`}
          >
            {challenge.completed ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={challenge.completed ? 'line-through text-muted-foreground' : ''}>
                {challenge.challengeText}
              </p>
              {!challenge.completed && (
                <p className="text-primary text-[10px] mt-1">
                  +{challenge.xpReward} XP • +{challenge.sporesReward} 🍄
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
