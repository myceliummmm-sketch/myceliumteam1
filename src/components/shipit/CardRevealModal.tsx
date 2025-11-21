import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CardRevealModalProps {
  open: boolean;
  card: any;
  stageNumber: number;
  onContinue: () => void;
  onViewCard?: () => void;
}

export function CardRevealModal({ open, card, stageNumber, onContinue, onViewCard }: CardRevealModalProps) {
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      }, 300);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center space-y-6 py-6"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold mb-2">💎 Новая карточка!</h2>
            <p className="text-muted-foreground">
              Этап {stageNumber}/4 завершён
            </p>
          </div>

          {card && (
            <div className="bg-card border-2 border-primary/30 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-primary">{card.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{card.content}</p>
            </div>
          )}

          <div className="flex gap-2">
            {onViewCard && (
              <Button variant="outline" onClick={onViewCard} className="flex-1">
                Посмотреть карточку
              </Button>
            )}
            <Button onClick={onContinue} className="flex-1 gap-2">
              {stageNumber < 4 ? (
                <>
                  Дальше
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Завершить VISION
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
