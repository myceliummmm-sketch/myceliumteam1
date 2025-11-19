import { useGameStore } from '@/stores/gameStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

export function StageHistory() {
  const stageHistory = useGameStore((state) => state.stageHistory);
  
  const groupedByPhase = stageHistory.reduce((acc, completion) => {
    if (!acc[completion.phase]) acc[completion.phase] = [];
    acc[completion.phase].push(completion);
    return acc;
  }, {} as Record<string, any[]>);

  if (stageHistory.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-sm font-mono text-primary uppercase mb-3">
          Stage History
        </h3>
        <p className="text-sm text-muted-foreground">
          Complete stages to see your progress history here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-mono text-primary uppercase mb-3">
        Stage History
      </h3>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {Object.entries(groupedByPhase).map(([phase, completions]) => (
            <div key={phase}>
              <Badge variant="outline" className="mb-2">{phase}</Badge>
              <div className="space-y-2 ml-2">
                {completions.map((completion) => (
                  <div 
                    key={completion.id}
                    className="flex items-start gap-2 text-sm p-2 rounded bg-card/50"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        Stage {completion.stage_number}: {completion.stage_label}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(completion.completed_at), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>+{completion.xp_earned} XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
