import { motion } from 'framer-motion';
import { Badge, BADGES, getRarityColor } from '@/lib/badgeSystem';
import { useBadges } from '@/hooks/useBadges';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export function BadgeCollection() {
  const { badges: unlockedBadges, loading } = useBadges();

  const allBadges = Object.values(BADGES);

  const isBadgeUnlocked = (badgeId: string) => {
    return unlockedBadges.some(b => b.badge_id === badgeId);
  };

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading badges...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {allBadges.map((badge, index) => {
        const unlocked = isBadgeUnlocked(badge.id);
        
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`p-6 relative overflow-hidden transition-all ${
                unlocked 
                  ? 'border-primary/50 bg-primary/5 hover:border-primary' 
                  : 'opacity-50 grayscale'
              }`}
            >
              {/* Background gradient */}
              {unlocked && (
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `radial-gradient(circle at top right, ${badge.color}, transparent)`
                  }}
                />
              )}

              {/* Content */}
              <div className="relative flex flex-col items-center text-center space-y-3">
                {/* Badge Icon */}
                <div className="text-5xl relative">
                  {unlocked ? (
                    <motion.span
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="inline-block"
                    >
                      {badge.icon}
                    </motion.span>
                  ) : (
                    <div className="relative">
                      <span className="blur-sm">{badge.icon}</span>
                      <Lock className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Badge Info */}
                <div>
                  <h3 className="font-bold text-lg">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {badge.description}
                  </p>
                </div>

                {/* Rarity & Milestone */}
                <div className="flex items-center gap-3 text-xs">
                  <span 
                    className="px-2 py-1 rounded-full font-medium uppercase"
                    style={{ 
                      backgroundColor: `${badge.color}20`,
                      color: badge.color
                    }}
                  >
                    {badge.rarity}
                  </span>
                  <span className="text-muted-foreground">
                    {badge.unlocksAt}/24 stages
                  </span>
                </div>

                {/* XP Reward */}
                {unlocked && (
                  <div className="text-sm font-semibold text-primary">
                    +{badge.xpReward} XP
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
