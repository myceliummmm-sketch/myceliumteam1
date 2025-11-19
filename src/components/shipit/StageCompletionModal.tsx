import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { ParticleEffect } from './ParticleEffect';
import { useSound } from '@/hooks/useSound';
import { useEffect, useState } from 'react';

export function StageCompletionModal() {
  const showModal = useGameStore((state) => state.showStageCompletionModal);
  const completedStage = useGameStore((state) => state.completedStage);
  const stageRewards = useGameStore((state) => state.stageRewards);
  const setShowStageCompletionModal = useGameStore((state) => state.setShowStageCompletionModal);
  const { playSound } = useSound();
  const [showParticles, setShowParticles] = useState(true);

  useEffect(() => {
    if (showModal) {
      playSound('levelUp');
      const timer = setTimeout(() => setShowParticles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal, playSound]);

  if (!completedStage || !stageRewards) return null;

  const isPhaseComplete = completedStage.stageNumber === 4;

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {showParticles && <ParticleEffect type="sparkles" count={50} />}
          
          <Dialog open={showModal} onOpenChange={() => setShowStageCompletionModal(false)}>
            <DialogContent className="max-w-xl border-primary/50 bg-gradient-to-br from-primary/10 via-background to-background">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-center py-4"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-4"
                >
                  <CheckCircle2 className="h-16 w-16 mx-auto text-primary" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  {isPhaseComplete ? '🎊 Phase Complete!' : '✨ Stage Complete!'}
                </motion.h2>

                {/* Stage Info */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="mb-6"
                >
                  <Badge variant="outline" className="mb-2">
                    {completedStage.phase} • Stage {completedStage.stageNumber}/4
                  </Badge>
                  <h3 className="text-xl font-semibold">{completedStage.label}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stageRewards.message}
                  </p>
                </motion.div>

                {/* Rewards */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-3 mb-6"
                >
                  <Card className="p-4 bg-primary/5">
                    <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="font-mono text-sm text-muted-foreground">XP Gained</p>
                    <p className="text-2xl font-bold text-primary">+{stageRewards.xp}</p>
                  </Card>
                  <Card className="p-4 bg-primary/5">
                    <Sparkles className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="font-mono text-sm text-muted-foreground">Spores</p>
                    <p className="text-2xl font-bold text-primary">+{stageRewards.spores} 🍄</p>
                  </Card>
                </motion.div>

                {/* Unlocks */}
                {stageRewards.unlocks && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <Card className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <p className="font-semibold text-sm">New Unlock!</p>
                      </div>
                      {stageRewards.unlocks.mode && (
                        <p className="text-sm">
                          Conversation Mode: <span className="font-bold">{stageRewards.unlocks.mode}</span>
                        </p>
                      )}
                      {stageRewards.unlocks.feature && (
                        <p className="text-sm">{stageRewards.unlocks.feature}</p>
                      )}
                    </Card>
                  </motion.div>
                )}

                {/* Completion Criteria Checklist */}
                {completedStage.completionCriteria && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-left"
                  >
                    <p className="text-xs font-mono text-muted-foreground mb-2">Completed:</p>
                    <div className="space-y-1">
                      {completedStage.completionCriteria.map((criteria: string, idx: number) => (
                        <motion.div
                          key={criteria}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8 + idx * 0.1 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">{criteria.replace(/_/g, ' ')}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Continue Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6"
                >
                  <Button
                    onClick={() => setShowStageCompletionModal(false)}
                    size="lg"
                    className="w-full gap-2"
                  >
                    {isPhaseComplete ? (
                      <>Continue to Next Phase <ArrowRight className="h-4 w-4" /></>
                    ) : (
                      <>Continue Building</>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  );
}
