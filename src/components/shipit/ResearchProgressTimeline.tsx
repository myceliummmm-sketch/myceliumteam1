import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, BarChart3, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ResearchProgressTimelineProps {
  currentStage: number;
  onStageChange?: (stage: number) => void;
  isComplete?: boolean;
}

const STAGES = [
  {
    id: 1,
    name: "Gathering Data",
    icon: Search,
    description: "Collecting research from multiple sources",
    duration: 15,
    color: "text-blue-500"
  },
  {
    id: 2,
    name: "Analyzing Patterns",
    icon: BarChart3,
    description: "Finding insights and trends",
    duration: 20,
    color: "text-purple-500"
  },
  {
    id: 3,
    name: "Finding Insights",
    icon: Sparkles,
    description: "Extracting key findings",
    duration: 15,
    color: "text-amber-500"
  },
  {
    id: 4,
    name: "Generating Cards",
    icon: Zap,
    description: "Creating your research cards",
    duration: 10,
    color: "text-green-500"
  }
];

export const ResearchProgressTimeline = ({ currentStage, onStageChange, isComplete = false }: ResearchProgressTimelineProps) => {
  const [localStage, setLocalStage] = useState(currentStage);
  const [stageProgress, setStageProgress] = useState(0);

  useEffect(() => {
    // If complete, jump to end
    if (isComplete) {
      setLocalStage(STAGES.length);
      setStageProgress(100);
      return;
    }

    // Simulate stage progression with estimated times
    const currentStageData = STAGES[localStage - 1];
    if (!currentStageData) return;

    const duration = currentStageData.duration * 1000; // Convert to ms
    const interval = 100; // Update every 100ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setStageProgress(prev => {
        if (prev >= 100) {
          // Move to next stage
          if (localStage < STAGES.length) {
            setLocalStage(localStage + 1);
            onStageChange?.(localStage + 1);
            return 0;
          }
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [localStage, onStageChange, isComplete]);

  const overallProgress = ((localStage - 1) / STAGES.length) * 100 + (stageProgress / STAGES.length);

  return (
    <div className="space-y-4 p-4 bg-card/50 rounded-lg border">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Research Progress</span>
          <span className="text-muted-foreground">{Math.round(overallProgress)}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Stages */}
      <div className="grid grid-cols-4 gap-3">
        {STAGES.map((stage) => {
          const isActive = stage.id === localStage;
          const isCompleted = stage.id < localStage;
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.id}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-primary bg-primary/10 shadow-lg"
                  : isCompleted
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card"
              }`}
              animate={isActive ? {
                scale: [1, 1.05, 1],
                transition: { duration: 2, repeat: Infinity }
              } : {}}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {/* Icon */}
                <div className="relative">
                  {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  ) : (
                    <Icon className={`w-8 h-8 ${isActive ? stage.color : "text-muted-foreground"}`} />
                  )}
                  
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <div className={`font-bold text-xs ${isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground"}`}>
                    {stage.name}
                  </div>
                  
                  {/* Stage Progress Bar (only for active stage) */}
                  {isActive && (
                    <div className="w-full">
                      <Progress value={stageProgress} className="h-1" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {isCompleted && (
                    <Badge variant="secondary" className="text-xs py-0">
                      Done
                    </Badge>
                  )}
                  {isActive && (
                    <Badge className="text-xs py-0 animate-pulse">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Current Stage Description */}
      <div className="text-center pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          {STAGES[localStage - 1]?.description || "Processing..."}
        </p>
      </div>
    </div>
  );
};
