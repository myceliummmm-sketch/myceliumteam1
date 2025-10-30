import { useGameStore } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

const phases = ['INCEPTION', 'RESEARCH', 'DESIGN', 'BUILD', 'TEST', 'SHIP'];

export function PhaseProgress() {
  const currentPhase = useGameStore((state) => state.currentPhase);
  const currentIndex = phases.indexOf(currentPhase);
  const progress = ((currentIndex + 1) / phases.length) * 100;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-mono text-muted-foreground">
          PHASE {currentIndex + 1} OF {phases.length}
        </h3>
        <span className="text-sm font-bold text-primary">{currentPhase}</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-2">
        {phases.map((phase, index) => (
          <span
            key={phase}
            className={`text-xs ${
              index <= currentIndex
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {phase.slice(0, 3)}
          </span>
        ))}
      </div>
    </Card>
  );
}
