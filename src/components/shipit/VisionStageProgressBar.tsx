import { motion } from 'framer-motion';
import { Check, Lock, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { VisionSubStageProgress } from '@/lib/visionFlowEngine';
import confetti from 'canvas-confetti';

interface VisionStageProgressBarProps {
  subStages: VisionSubStageProgress[];
  currentSubStage: 1 | 2 | 3 | 4;
}

const STAGE_LABELS = ['Problem\nDiscovery', 'Solution\nConcept', 'Value\nDefinition', 'Vision\nStatement'];

export function VisionStageProgressBar({ subStages, currentSubStage }: VisionStageProgressBarProps) {
  const sparkleCanvasRefs = [useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null)];

  useEffect(() => {
    subStages.forEach((stage, idx) => {
      if (!stage.completed && stage.subStageNumber === currentSubStage && sparkleCanvasRefs[idx].current) {
        const canvas = sparkleCanvasRefs[idx].current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles: { x: number; y: number; vx: number; vy: number; alpha: number }[] = [];
        for (let i = 0; i < 8; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 1.5 - 0.5,
            alpha: 1
          });
        }

        let animationId: number;
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.01;

            if (p.alpha <= 0) {
              p.x = Math.random() * canvas.width;
              p.y = canvas.height;
              p.alpha = 1;
            }

            ctx.fillStyle = `rgba(250, 204, 21, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
          });

          animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationId);
      }
    });
  }, [currentSubStage, subStages]);

  const handleBurstAnimation = (idx: number) => {
    const rect = sparkleCanvasRefs[idx].current?.getBoundingClientRect();
    if (rect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
      });
    }
  };

  return (
    <div className="w-full bg-card rounded-lg p-6 border-2 border-primary/20">
      <h2 className="text-sm font-bold text-primary mb-4 text-center">🎯 VISION PHASE PROGRESS</h2>
      
      <div className="grid grid-cols-4 gap-2">
        {subStages.map((stage, idx) => {
          const isLocked = stage.subStageNumber > currentSubStage && !stage.completed;
          const isCurrent = stage.subStageNumber === currentSubStage && !stage.completed;
          const isComplete = stage.completed;

          return (
            <div key={stage.subStageNumber} className="flex flex-col items-center gap-2 relative">
              <div className="text-xs text-center text-muted-foreground whitespace-pre-line h-10 flex items-center justify-center">
                {STAGE_LABELS[idx]}
              </div>
              
              <motion.div
                className={`relative w-full h-3 rounded-full overflow-hidden border-2 ${
                  isLocked ? 'border-muted bg-muted/20' :
                  isCurrent ? 'border-primary bg-primary/10' :
                  isComplete ? 'border-green-500 bg-green-500' :
                  'border-muted bg-muted/20'
                }`}
                animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isCurrent && (
                  <canvas
                    ref={sparkleCanvasRefs[idx]}
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
                
                {isComplete && (
                  <motion.div
                    className="absolute inset-0 bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6 }}
                    onAnimationComplete={() => handleBurstAnimation(idx)}
                  />
                )}
              </motion.div>

              <div className="text-xs flex items-center gap-1">
                {isComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </motion.div>
                )}
                {isCurrent && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
                {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                <span className={isComplete ? 'text-green-500' : isCurrent ? 'text-primary' : 'text-muted-foreground'}>
                  {stage.subStageNumber}/4
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
