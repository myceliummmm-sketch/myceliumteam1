import { useGameStore } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function StatsPanel() {
  const { xp, level, spores, energy, streak, codeHealth } = useGameStore((state) => ({
    xp: state.xp,
    level: state.level,
    spores: state.spores,
    energy: state.energy,
    streak: state.streak,
    codeHealth: state.codeHealth,
  }));

  const xpToNextLevel = level * 100;
  const xpProgress = (xp / xpToNextLevel) * 100;
  const maxEnergy = 10;
  const energyProgress = (energy / maxEnergy) * 100;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-mono text-muted-foreground mb-4">STATS</h3>
      
      <div className="space-y-4">
        {/* Level */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">LEVEL</span>
          <Badge variant="default" className="text-lg font-bold">
            {level}
          </Badge>
        </div>

        {/* XP */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">XP</span>
            <span className="font-mono">{xp}/{xpToNextLevel}</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Spores */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">SPORES 🍄</span>
          <span className="font-mono font-bold text-primary">{spores}</span>
        </div>

        {/* Energy */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">ENERGY ⚡</span>
            <span className="font-mono">{energy}/{maxEnergy}</span>
          </div>
          <Progress value={energyProgress} className="h-2 bg-yellow-900/20" />
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">STREAK 🔥</span>
          <span className="font-mono font-bold">{streak}</span>
        </div>

        {/* Code Health */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">CODE HEALTH</span>
            <span className="font-mono">{codeHealth}%</span>
          </div>
          <Progress 
            value={codeHealth} 
            className={`h-2 ${
              codeHealth > 70 ? 'bg-green-900/20' : codeHealth > 30 ? 'bg-yellow-900/20' : 'bg-red-900/20'
            }`}
          />
        </div>
      </div>
    </Card>
  );
}
