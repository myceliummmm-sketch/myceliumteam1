import { Card } from '@/components/ui/card';
import { useGameStore } from '@/stores/gameStore';
import { getCurrentStage, calculateStageProgress } from '@/lib/stageSystem';
import { calculatePhaseProgress } from '@/lib/quickReplies';

export function CurrentFocusPanel() {
  const { currentPhase, level, currentTasks, phaseStage } = useGameStore();
  
  const phaseProgress = calculatePhaseProgress({ 
    currentTasks, 
    currentPhase 
  } as any);
  
  const currentStage = getCurrentStage(currentPhase, phaseProgress);
  const stageProgressPercent = calculateStageProgress(currentPhase, phaseProgress);

  return (
    <Card className="p-4 border-2 border-primary/30 bg-primary/5" data-tutorial-target="current-focus-panel">
      <h3 className="text-xs font-bold text-primary mb-2">🎯 CURRENT FOCUS</h3>
      <div className="space-y-2">
        <div className="text-sm font-semibold">{currentStage.label}</div>
        <div className="text-xs text-muted-foreground">
          Phase: {currentPhase} | Level {level}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${stageProgressPercent}%` }}
          />
        </div>
        
        <div className="mt-3 space-y-1">
          <div className="text-xs font-medium">Your next steps:</div>
          {currentStage.actions.slice(0, 3).map((action, idx) => (
            <div key={idx} className="text-xs flex items-center gap-2">
              <span className="text-primary font-semibold">{idx + 1}.</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}