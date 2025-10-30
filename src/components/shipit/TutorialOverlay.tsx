import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { tutorialSteps } from '@/lib/tutorialSteps';

export function TutorialOverlay() {
  const { showTutorial, tutorialStep, nextTutorialStep, skipTutorial } = useGameStore();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

  const currentStep = tutorialSteps[tutorialStep || 0];

  useEffect(() => {
    if (!showTutorial || tutorialStep === null) return;

    const element = document.querySelector(`[data-tutorial-target="${currentStep.target}"]`) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      // Calculate card position
      const rect = element.getBoundingClientRect();
      const cardWidth = 320;
      const cardHeight = 200;
      
      let top = rect.top + window.scrollY;
      let left = rect.right + 20;

      // Adjust if card would go off screen
      if (left + cardWidth > window.innerWidth) {
        left = rect.left - cardWidth - 20;
      }
      
      if (top + cardHeight > window.innerHeight + window.scrollY) {
        top = window.innerHeight + window.scrollY - cardHeight - 20;
      }

      setCardPosition({ top, left });

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showTutorial, tutorialStep, currentStep]);

  if (!showTutorial || tutorialStep === null) return null;

  const progress = ((tutorialStep + 1) / tutorialSteps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Dark overlay with cutout effect */}
        <div className="absolute inset-0 bg-black/80" />
        
        {/* Highlight target element */}
        {targetElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              top: targetElement.offsetTop - 8,
              left: targetElement.offsetLeft - 8,
              width: targetElement.offsetWidth + 16,
              height: targetElement.offsetHeight + 16,
              border: '3px solid hsl(var(--primary))',
              borderRadius: '12px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 30px hsl(var(--primary))',
              pointerEvents: 'none',
              zIndex: 51
            }}
            className="animate-pulse"
          />
        )}

        {/* Tutorial card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            position: 'absolute',
            top: cardPosition.top,
            left: cardPosition.left,
            zIndex: 52
          }}
        >
          <Card className="w-80 p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">
                    Step {tutorialStep + 1} of {tutorialSteps.length}
                  </span>
                </div>
                <h3 className="font-bold text-lg">{currentStep.title}</h3>
                <p className="text-xs text-muted-foreground">{currentStep.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={skipTutorial}
                className="h-8 w-8 -mt-2 -mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <p className="text-sm text-foreground mb-6">
              {currentStep.content}
            </p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={nextTutorialStep}
              className="w-full"
              size="lg"
            >
              {currentStep.action}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {tutorialSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === tutorialStep
                      ? 'w-6 bg-primary'
                      : idx < tutorialStep
                      ? 'w-1.5 bg-primary/50'
                      : 'w-1.5 bg-muted'
                  }`}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
