import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ParticleEffect } from './ParticleEffect';
import { levelUpAnimation, levelUpTransition } from '@/lib/animations';
import { Trophy, Sparkles } from 'lucide-react';

export function LevelUpModal() {
  const showLevelUpModal = useGameStore((state) => state.showLevelUpModal);
  const level = useGameStore((state) => state.level);
  const levelUpRewards = useGameStore((state) => state.levelUpRewards);
  const setShowLevelUpModal = useGameStore((state) => state.setShowLevelUpModal);

  return (
    <AnimatePresence>
      {showLevelUpModal && (
        <>
          <ParticleEffect type="confetti" count={100} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLevelUpModal(false)}
          >
            <motion.div
              variants={levelUpAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={levelUpTransition}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 text-center max-w-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
                
                <div className="relative z-10">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: 3,
                      ease: "easeInOut"
                    }}
                  >
                    <Trophy className="h-20 w-20 mx-auto text-primary mb-4" />
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold mb-2 text-primary">LEVEL UP!</h2>
                  
                  <div className="my-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground text-5xl font-bold shadow-lg"
                    >
                      {level}
                    </motion.div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {levelUpRewards.spores > 0 && (
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-2 text-lg"
                      >
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="font-mono">+{levelUpRewards.spores} Spores 🍄</span>
                      </motion.div>
                    )}
                    
                    {levelUpRewards.milestone && (
                      <motion.p
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-muted-foreground text-sm"
                      >
                        🎉 {levelUpRewards.milestone}
                      </motion.p>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => setShowLevelUpModal(false)}
                    size="lg"
                    className="w-full"
                  >
                    Continue Your Journey
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
