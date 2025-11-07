import { Blocker } from '@/types/game';
import { Badge } from '@/components/ui/badge';
import { Skull, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BossBlockerCardProps {
  blocker: Blocker;
}

export function BossBlockerCard({ blocker }: BossBlockerCardProps) {
  if (blocker.type !== 'boss' || !blocker.bossData) return null;

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg mb-3",
        "bg-gradient-to-br from-destructive/20 via-destructive/10 to-background",
        "border-2 border-destructive",
        "animate-in fade-in slide-in-from-top-2 duration-500",
        "before:absolute before:inset-0 before:rounded-lg",
        "before:bg-gradient-to-r before:from-destructive/0 before:via-destructive/20 before:to-destructive/0",
        "before:animate-pulse before:opacity-50"
      )}
    >
      {/* Boss Badge */}
      <div className="flex items-start justify-between mb-2">
        <Badge 
          variant="destructive" 
          className="font-bold text-xs flex items-center gap-1 border-destructive/50"
        >
          <Skull className="h-3 w-3" />
          ⚔️ BOSS BLOCKER
        </Badge>
      </div>

      {/* Boss Name */}
      <h4 className="text-lg font-bold text-destructive mb-1 tracking-tight">
        {blocker.bossData.name}
      </h4>

      {/* Lore Text */}
      <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed">
        "{blocker.bossData.lore}"
      </p>

      {/* Description */}
      <p className="text-sm font-medium mb-3">
        {blocker.description}
      </p>

      {/* Rewards */}
      <div className="flex items-center gap-3 pt-2 border-t border-destructive/20">
        <div className="flex items-center gap-1 text-xs">
          <Zap className="h-3 w-3 text-primary" />
          <span className="font-bold text-primary">+{blocker.bossData.defeatReward.xp} XP</span>
        </div>
        <div className="text-xs">
          <span className="font-bold text-amber-500">+{blocker.bossData.defeatReward.spores} Spores</span>
        </div>
        {blocker.bossData.defeatReward.artifact && (
          <Badge variant="outline" className="text-xs border-primary/50 text-primary">
            Artifact Progress
          </Badge>
        )}
      </div>
    </div>
  );
}
