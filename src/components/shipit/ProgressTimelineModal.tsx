import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/stores/gameStore';
import { STAGE_DEFINITIONS } from '@/lib/stageSystem';
import { Phase } from '@/types/game';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

const PHASES: Phase[] = ['VISION', 'RESEARCH', 'PROTOTYPE', 'BUILD', 'GROW'];

const PHASE_COLORS: Record<Phase, string> = {
  VISION: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
  RESEARCH: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
  PROTOTYPE: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
  BUILD: 'from-red-500/20 to-orange-500/20 border-red-500/50',
  GROW: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
};

interface ProgressTimelineModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProgressTimelineModal({ open, onClose }: ProgressTimelineModalProps) {
  const currentPhase = useGameStore((state) => state.currentPhase);
  const stageHistory = useGameStore((state) => state.stageHistory);
  const phaseStage = useGameStore((state) => state.phaseStage);
  
  // Helper: Check if stage is completed
  const isStageCompleted = (phase: Phase, stageNum: number) => {
    return stageHistory.some(
      h => h.phase === phase && h.stage_number === stageNum
    );
  };
  
  // Helper: Check if stage is current
  const isCurrentStage = (phase: Phase, stageNum: number) => {
    return currentPhase === phase && phaseStage?.stageNumber === stageNum;
  };
  
  // Helper: Check if stage is locked (future)
  const isLocked = (phase: Phase, stageNum: number) => {
    const phaseIndex = PHASES.indexOf(phase);
    const currentPhaseIndex = PHASES.indexOf(currentPhase);
    
    if (phaseIndex > currentPhaseIndex) return true;
    if (phaseIndex < currentPhaseIndex) return false;
    return stageNum > (phaseStage?.stageNumber || 1);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            🗺️ Your Journey
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Every stage completed brings you closer to launch
          </p>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {PHASES.map((phase, phaseIdx) => {
              const stages = STAGE_DEFINITIONS[phase];
              const completedStages = stages.filter(s => isStageCompleted(phase, s.stageNumber)).length;
              const isPhaseActive = phase === currentPhase;
              
              return (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: phaseIdx * 0.05 }}
                >
                  <Card className={`p-4 bg-gradient-to-br ${PHASE_COLORS[phase]} ${
                    isPhaseActive ? 'ring-2 ring-primary' : ''
                  }`}>
                    {/* Phase Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant={isPhaseActive ? 'default' : 'outline'} className="text-xs">
                          Phase {phaseIdx + 1}
                        </Badge>
                        <h3 className="font-bold text-lg">{phase}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {completedStages}/{stages.length} stages
                      </div>
                    </div>
                    
                    {/* Stage Timeline */}
                    <div className="space-y-2">
                      {stages.map((stage) => {
                        const completed = isStageCompleted(phase, stage.stageNumber);
                        const current = isCurrentStage(phase, stage.stageNumber);
                        const locked = isLocked(phase, stage.stageNumber);
                        
                        const completionData = stageHistory.find(
                          h => h.phase === phase && h.stage_number === stage.stageNumber
                        );
                        
                        return (
                          <div
                            key={stage.stageNumber}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                              current ? 'bg-primary/10 border border-primary/30' : 
                              completed ? 'bg-background/50' : 
                              'bg-background/30 opacity-60'
                            }`}
                          >
                            {/* Icon */}
                            <div className="mt-0.5">
                              {completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : current ? (
                                <Circle className="h-5 w-5 text-primary fill-primary/30" />
                              ) : locked ? (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-muted-foreground">
                                  {stage.stageNumber}/4
                                </span>
                                <span className="text-sm font-semibold truncate">
                                  {stage.label}
                                </span>
                                {current && (
                                  <Badge variant="outline" className="text-xs">Current</Badge>
                                )}
                              </div>
                              
                              {/* Completion info */}
                              {completed && completionData && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>✓ {format(new Date(completionData.completed_at), 'MMM d')}</span>
                                  <span>•</span>
                                  <span>+{completionData.xp_earned} XP</span>
                                </div>
                              )}
                              
                              {/* Actions for current stage */}
                              {current && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  Next: {stage.actions[0]}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
