import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/lib/badgeSystem';
import { ParticleEffect } from './ParticleEffect';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

interface BadgeUnlockModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeUnlockModal({ badge, isOpen, onClose }: BadgeUnlockModalProps) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isOpen && badge) {
      setShowParticles(true);
      
      // Confetti burst
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: [badge.color, 'hsl(var(--primary))', 'hsl(var(--chart-1))']
      });

      // Secondary burst after delay
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 80,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 80,
          origin: { x: 1 }
        });
      }, 200);

      const timer = setTimeout(() => setShowParticles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, badge]);

  if (!badge) return null;

  const rarityGradients = {
    common: 'from-chart-1/20 to-chart-1/5',
    rare: 'from-chart-2/20 to-chart-2/5',
    legendary: 'from-primary/20 to-primary/5'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence>
          {showParticles && <ParticleEffect type="confetti" count={60} />}
        </AnimatePresence>

        <div className="flex flex-col items-center text-center space-y-6 py-6">
          {/* Badge Icon with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
              duration: 0.6
            }}
            className="relative"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${rarityGradients[badge.rarity]} blur-2xl`}
            />
            
            <div className="relative text-8xl filter drop-shadow-2xl">
              {badge.icon}
            </div>

            {/* Shine effect */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent 0%, ${badge.color} 10%, transparent 20%)`
              }}
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Badge Unlocked!</span>
              <Sparkles className="h-4 w-4" />
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              {badge.name}
            </h2>

            <p className="text-muted-foreground max-w-xs">
              {badge.description}
            </p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold"
            >
              <span className="text-2xl">+{badge.xpReward}</span>
              <span className="text-sm">XP</span>
            </motion.div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full"
          >
            <Button
              onClick={onClose}
              size="lg"
              className="w-full gap-2"
            >
              Awesome! Continue
              <Sparkles className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
