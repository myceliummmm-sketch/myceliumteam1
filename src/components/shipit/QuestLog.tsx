import { useGameStore } from '@/stores/gameStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { useRef, useEffect } from 'react';

export function QuestLog() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentTasks = useGameStore((state) => state.currentTasks);
  const blockers = useGameStore((state) => state.blockers);

  // Scroll to top when tasks or blockers update
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentTasks, blockers]);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-mono text-muted-foreground mb-4">QUEST LOG</h3>
      
      <ScrollArea ref={scrollAreaRef} className="h-[200px] sm:h-[300px] lg:h-[400px]">
        <div className="space-y-3">
          {/* Active Blockers */}
          {blockers.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold text-destructive mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                BLOCKERS
              </h4>
              {blockers.map((blocker) => (
                <div
                  key={blocker.id}
                  className="p-2 rounded bg-destructive/10 border border-destructive/20 mb-2"
                >
                  <p className="text-xs font-medium">{blocker.description}</p>
                  <Badge variant="destructive" className="text-xs mt-1">
                    {blocker.severity}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Current Tasks */}
          <h4 className="text-xs font-bold text-muted-foreground mb-2">TASKS</h4>
          {currentTasks.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No active tasks</p>
          ) : (
            currentTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-2 p-2 rounded hover:bg-muted/50 transition-colors ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-xs ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                  <span className="text-xs text-muted-foreground">+{task.xpReward} XP</span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
