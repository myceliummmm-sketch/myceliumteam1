import { useGameStore } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getCurrentStage, calculateStageProgress, STAGE_DEFINITIONS } from '@/lib/stageSystem';
import { calculatePhaseProgress } from '@/lib/quickReplies';
import { stageTransitionAnimation, stageBadgePulse } from '@/lib/animations';

const phases = ['SPARK', 'EXPLORE', 'CRAFT', 'FORGE', 'POLISH', 'LAUNCH'];

const phaseEmojis: Record<string, string> = {
  'SPARK': '⚡',
  'EXPLORE': '🗺️',
  'CRAFT': '🎨',
  'FORGE': '⚙️',
  'POLISH': '✨',
  'LAUNCH': '🚀'
};

export function PhaseProgress() {
  const currentPhase = useGameStore((state) => state.currentPhase);
  const gameState = useGameStore((state) => state);
  const currentIndex = phases.indexOf(currentPhase);
  const progress = ((currentIndex + 1) / phases.length) * 100;
  
  // Calculate stage progress
  const phaseProgress = calculatePhaseProgress(gameState);
  const currentStage = getCurrentStage(currentPhase, phaseProgress);
  const stageProgress = calculateStageProgress(currentPhase, phaseProgress);
  const totalStages = STAGE_DEFINITIONS[currentPhase].length;
  const [prevPhase, setPrevPhase] = useState(currentPhase);
  const [prevStage, setPrevStage] = useState(currentStage.stageNumber);
  const [showPhaseChange, setShowPhaseChange] = useState(false);
  const [showStageTransition, setShowStageTransition] = useState(false);

  useEffect(() => {
    if (currentPhase !== prevPhase && prevPhase) {
      setShowPhaseChange(true);
      setTimeout(() => setShowPhaseChange(false), 2000);
    }
    setPrevPhase(currentPhase);
  }, [currentPhase, prevPhase]);

  useEffect(() => {
    if (currentStage.stageNumber !== prevStage) {
      setShowStageTransition(true);
      setTimeout(() => setShowStageTransition(false), 1500);
      setPrevStage(currentStage.stageNumber);
    }
  }, [currentStage.stageNumber, prevStage]);

  return (
    <Card className="p-4 relative overflow-hidden">
      {/* Phase transition effect */}
      <AnimatePresence>
        {showPhaseChange && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* Stage transition effect */}
      <AnimatePresence>
        {showStageTransition && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-mono text-muted-foreground">
          PHASE {currentIndex + 1} OF {phases.length}
        </h3>
        <motion.span 
          key={currentPhase}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-sm font-bold text-primary"
        >
          {currentPhase}
        </motion.span>
      </div>
      
      {/* Stage Progress with animations */}
      <div className="flex items-center gap-2 mb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPhase}-${currentStage.stageNumber}`}
            {...stageTransitionAnimation}
            className="flex items-center gap-2 flex-1"
          >
            <motion.div animate={showStageTransition ? stageBadgePulse : {}}>
              <Badge variant="outline" className="text-xs font-mono">
                Stage {currentStage.stageNumber}/{totalStages}
              </Badge>
            </motion.div>
            <span className="text-xs text-muted-foreground truncate">
              {currentStage.label}
            </span>
          </motion.div>
        </AnimatePresence>
        
        <div className="ml-auto flex items-center gap-1">
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${stageProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {Math.round(stageProgress)}%
          </span>
        </div>
      </div>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5 }}
      >
        <Progress value={progress} className="h-2" />
      </motion.div>
      
      <div className="flex justify-between mt-2">
        {phases.map((phase, index) => (
          <motion.span
            key={phase}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: index <= currentIndex ? 1 : 0.5,
              scale: index === currentIndex ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
            className={`text-base ${
              index <= currentIndex
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {phaseEmojis[phase]}
          </motion.span>
        ))}
      </div>
    </Card>
  );
}
