import { useGameStore } from '@/stores/gameStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArtifactModal } from './ArtifactModal';
import { Artifact } from '@/types/game';

export function Inventory() {
  const artifacts = useGameStore((state) => state.artifacts);
  const level = useGameStore((state) => state.level);
  const bossBlockersDefeated = useGameStore((state) => state.bossBlockersDefeated);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Legendary Artifacts
          </h1>
          <p className="text-muted-foreground">
            Unlock powerful artifacts by defeating boss blockers and mastering each phase of product development.
          </p>
          <Badge variant="outline" className="mt-2">
            {artifacts.filter(a => a.unlocked).length} / {artifacts.length} Collected
          </Badge>
        </div>

        {/* Artifacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {artifacts.map((artifact, index) => (
            <motion.div
              key={artifact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={artifact.unlocked ? { scale: 1.02 } : {}}
            >
              <Card
                className={`relative p-6 cursor-pointer transition-all overflow-hidden ${
                  artifact.unlocked
                    ? 'bg-gradient-to-br from-primary/10 via-background to-background border-primary/50 hover:border-primary'
                    : 'bg-muted/20 border-muted'
                }`}
                onClick={() => artifact.unlocked && setSelectedArtifact(artifact)}
              >
                {/* Shimmer effect for newly unlocked artifacts (within last 5 minutes) */}
                {artifact.unlocked && artifact.unlockedAt && 
                  new Date().getTime() - new Date(artifact.unlockedAt).getTime() < 5 * 60 * 1000 && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent, hsl(var(--primary)/0.3), transparent)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{
                      backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                )}
                {/* Locked Overlay */}
                {!artifact.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-10">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground font-medium">LOCKED</p>
                    </div>
                  </div>
                )}

                {/* Glow Effect for Unlocked */}
                {artifact.unlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-50"
                    animate={{
                      boxShadow: [
                        '0 0 0px hsl(var(--primary)/0)',
                        '0 0 20px hsl(var(--primary)/0.4)',
                        '0 0 0px hsl(var(--primary)/0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Content */}
                <div className="relative z-0">
                  {/* Phase Badge */}
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {artifact.phase} PHASE
                  </Badge>

                  {/* Name */}
                  <h3 className={`text-xl font-bold mb-2 ${artifact.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                    {artifact.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {artifact.description}
                  </p>

                  {/* Requirements (if locked) */}
                  {!artifact.unlocked && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="font-medium">Requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li className={level >= artifact.requirements.minLevel ? 'text-primary' : ''}>
                          Level {artifact.requirements.minLevel}+
                        </li>
                        <li className={bossBlockersDefeated.length >= artifact.requirements.bossBlockersDefeated ? 'text-primary' : ''}>
                          Defeat {artifact.requirements.bossBlockersDefeated} Boss Blocker{artifact.requirements.bossBlockersDefeated !== 1 ? 's' : ''}
                        </li>
                        <li>Complete {artifact.requirements.phasesCompleted.join(', ')} phases</li>
                      </ul>
                    </div>
                  )}

                  {/* Bonuses (if unlocked) */}
                  {artifact.unlocked && (
                    <div className="space-y-1 text-xs">
                      <p className="font-medium text-primary">Active Bonuses:</p>
                      {artifact.passiveBonuses.xpMultiplier && (
                        <Badge variant="outline" className="mr-1">
                          +{((artifact.passiveBonuses.xpMultiplier - 1) * 100).toFixed(0)}% XP
                        </Badge>
                      )}
                      {artifact.passiveBonuses.energyRegenBonus && (
                        <Badge variant="outline" className="mr-1">
                          +{artifact.passiveBonuses.energyRegenBonus} Energy
                        </Badge>
                      )}
                      {artifact.passiveBonuses.sporeMultiplier && (
                        <Badge variant="outline" className="mr-1">
                          +{((artifact.passiveBonuses.sporeMultiplier - 1) * 100).toFixed(0)}% Spores
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress Summary */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-bold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Current Level</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Boss Blockers Defeated</p>
              <p className="text-2xl font-bold text-destructive">{bossBlockersDefeated.length} / 3</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Artifacts Unlocked</p>
              <p className="text-2xl font-bold text-primary">
                {artifacts.filter(a => a.unlocked).length} / {artifacts.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <ArtifactModal
          artifact={selectedArtifact}
          onClose={() => setSelectedArtifact(null)}
        />
      )}
    </div>
  );
}
