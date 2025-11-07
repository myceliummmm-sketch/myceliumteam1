import { Artifact } from '@/types/game';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { useEffect } from 'react';

interface ArtifactUnlockModalProps {
  artifact: Artifact;
  onClose: () => void;
}

export function ArtifactUnlockModal({ artifact, onClose }: ArtifactUnlockModalProps) {
  const { playSound } = useSound();

  useEffect(() => {
    playSound('levelUp');
  }, [playSound]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-2 border-primary">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center py-6"
        >
          {/* Confetti Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-2 text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8" />
              LEGENDARY ARTIFACT UNLOCKED!
            </h2>
          </motion.div>

          {/* Artifact Name */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="my-8"
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: [
                    '0 0 20px hsl(var(--primary)/0.5)',
                    '0 0 40px hsl(var(--primary)/0.8)',
                    '0 0 20px hsl(var(--primary)/0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative bg-gradient-to-br from-primary/20 to-background p-8 rounded-lg border-2 border-primary">
                <Badge variant="secondary" className="mb-2">
                  {artifact.phase} PHASE
                </Badge>
                <h3 className="text-2xl font-bold mb-2">{artifact.name}</h3>
                <p className="text-sm text-muted-foreground italic">
                  "{artifact.lore}"
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bonuses Granted */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <h4 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Bonuses Granted
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {artifact.passiveBonuses.xpMultiplier && (
                <Badge variant="default" className="text-sm">
                  +{((artifact.passiveBonuses.xpMultiplier - 1) * 100).toFixed(0)}% XP Gain
                </Badge>
              )}
              {artifact.passiveBonuses.energyRegenBonus && (
                <Badge variant="default" className="text-sm">
                  +{artifact.passiveBonuses.energyRegenBonus} Max Energy
                </Badge>
              )}
              {artifact.passiveBonuses.sporeMultiplier && (
                <Badge variant="default" className="text-sm">
                  +{((artifact.passiveBonuses.sporeMultiplier - 1) * 100).toFixed(0)}% Spore Gain
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Unlocks */}
          {(artifact.unlocks.newAdvisor || artifact.unlocks.featureUnlock) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-6"
            >
              <h4 className="text-sm font-semibold mb-2">New Features Unlocked</h4>
              <div className="text-sm text-muted-foreground">
                {artifact.unlocks.newAdvisor && (
                  <p>✨ New team member: {artifact.unlocks.newAdvisor}</p>
                )}
                {artifact.unlocks.featureUnlock && (
                  <p>🎯 {artifact.unlocks.featureUnlock}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button onClick={onClose} size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              View in Inventory
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
