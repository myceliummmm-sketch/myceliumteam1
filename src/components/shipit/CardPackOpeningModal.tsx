import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { CollectibleCard } from './CollectibleCard';
import { ParticleEffect } from './ParticleEffect';
import { useSound } from '@/hooks/useSound';

interface Card {
  id: string;
  card_type: 'IDEA' | 'INSIGHT' | 'DESIGN' | 'CODE' | 'GROWTH';
  level: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  title: string;
  content: string;
  description: string | null;
  created_by_character: string | null;
  tags: string[] | null;
  average_score: number | null;
  times_used: number;
  visual_theme: string;
}

interface CardPackOpeningModalProps {
  cards: Card[];
  open: boolean;
  onClose: () => void;
  onCardClick: (card: Card) => void;
}

const rarityParticles: Record<string, { count: number; color: string }> = {
  common: { count: 10, color: '#94a3b8' },
  uncommon: { count: 20, color: '#22c55e' },
  rare: { count: 30, color: '#06b6d4' },
  epic: { count: 50, color: '#a855f7' },
  legendary: { count: 80, color: '#f59e0b' }
};

export function CardPackOpeningModal({ cards, open, onClose, onCardClick }: CardPackOpeningModalProps) {
  const [stage, setStage] = useState<'boot' | 'reveal' | 'display'>('boot');
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const { playSound } = useSound();

  useEffect(() => {
    if (!open) {
      setStage('boot');
      setRevealedCards([]);
      setCurrentCardIndex(0);
      return;
    }

    // Boot sequence
    const bootTimer = setTimeout(() => {
      setStage('reveal');
      revealNextCard();
    }, 2000);

    return () => clearTimeout(bootTimer);
  }, [open]);

  const revealNextCard = () => {
    if (currentCardIndex >= cards.length) {
      setStage('display');
      return;
    }

    const card = cards[currentCardIndex];
    
    // Play sound based on rarity
    const rarityFrequencies: Record<string, number> = {
      common: 200,
      uncommon: 300,
      rare: 400,
      epic: 550,
      legendary: 700
    };
    
    // Simple sound effect simulation
    if (card.rarity === 'legendary' || card.rarity === 'epic') {
      playSound('levelUp');
    } else {
      playSound('taskComplete');
    }

    setShowParticles(true);
    
    setTimeout(() => {
      setRevealedCards(prev => [...prev, card]);
      setCurrentCardIndex(prev => prev + 1);
      setShowParticles(false);
      
      setTimeout(() => {
        if (currentCardIndex + 1 < cards.length) {
          revealNextCard();
        } else {
          setStage('display');
        }
      }, 1000);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl min-h-[600px] bg-slate-950 border-2 border-primary/50 overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 'boot' && (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[500px] font-mono text-primary"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  &gt; INITIALIZING CARD PACK...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  &gt; SCANNING CONTENTS...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="flex items-center gap-2"
                >
                  &gt; [████████░░] 80%
                </motion.div>
              </div>
            </motion.div>
          )}

          {stage === 'reveal' && (
            <motion.div
              key="reveal"
              className="flex items-center justify-center h-[500px] relative"
            >
              {showParticles && revealedCards.length > 0 && (
                <ParticleEffect type="confetti" count={50} />
              )}
              
              <AnimatePresence mode="wait">
                {currentCardIndex < cards.length && (
                  <motion.div
                    key={`card-${currentCardIndex}`}
                    initial={{ rotateY: 180, scale: 0.8 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <CollectibleCard card={cards[currentCardIndex]} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {stage === 'display' && (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8"
            >
              <h2 className="text-2xl font-mono text-primary text-center mb-6">
                // CARDS UNLOCKED
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto px-4">
                {revealedCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onCardClick(card)}
                  >
                    <div onClick={() => onCardClick(card)}>
                      <CollectibleCard card={card} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
