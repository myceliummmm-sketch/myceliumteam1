import { useGameStore } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const phases = ['SPARK', 'EXPLORE', 'CRAFT', 'FORGE', 'POLISH', 'LAUNCH'];

export function PhaseProgress() {
  const currentPhase = useGameStore((state) => state.currentPhase);
  const currentIndex = phases.indexOf(currentPhase);
  const progress = ((currentIndex + 1) / phases.length) * 100;
  const [prevPhase, setPrevPhase] = useState(currentPhase);
  const [showPhaseChange, setShowPhaseChange] = useState(false);

  useEffect(() => {
    if (currentPhase !== prevPhase && prevPhase) {
      setShowPhaseChange(true);
      setTimeout(() => setShowPhaseChange(false), 2000);
    }
    setPrevPhase(currentPhase);
  }, [currentPhase, prevPhase]);

  return (
    <Card className="p-4 relative overflow-hidden">
      {showPhaseChange && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />
      )}
      
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
              scale: index === currentIndex ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
            className={`text-xs ${
              index <= currentIndex
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {phase.slice(0, 3)}
          </motion.span>
        ))}
      </div>
    </Card>
  );
}
