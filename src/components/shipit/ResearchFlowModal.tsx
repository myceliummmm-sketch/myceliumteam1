import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollectibleCard } from './CollectibleCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Users, X } from 'lucide-react';
import { ParticleEffect } from './ParticleEffect';

interface ResearchFlowModalProps {
  open: boolean;
  onClose: () => void;
  phase: 'raw' | 'scoring' | 'perspectives' | 'complete';
  rawCards?: any[];
  insightCards?: any[];
  perspectiveCards?: any[];
  onStartScoring?: () => void;
  isProcessing?: boolean;
}

export function ResearchFlowModal({
  open,
  onClose,
  phase,
  rawCards = [],
  insightCards = [],
  perspectiveCards = [],
  onStartScoring,
  isProcessing = false
}: ResearchFlowModalProps) {
  const [revealedCards, setRevealedCards] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (phase === 'raw' && rawCards.length > 0) {
      // Reveal cards one by one
      const timer = setInterval(() => {
        setRevealedCards(prev => {
          if (prev < rawCards.length) return prev + 1;
          clearInterval(timer);
          return prev;
        });
      }, 400);
      return () => clearInterval(timer);
    } else if (phase === 'perspectives' && perspectiveCards.length > 0) {
      // Show confetti when perspectives are ready
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [phase, rawCards.length, perspectiveCards.length]);

  const renderPhaseContent = () => {
    switch (phase) {
      case 'raw':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🔬</div>
              <h3 className="text-xl font-bold font-mono">Deep Research Complete</h3>
              <p className="text-sm text-muted-foreground">
                Generated {rawCards.length} raw research findings
              </p>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <AnimatePresence>
                  {rawCards.slice(0, revealedCards).map((card, idx) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CollectibleCard card={card} isNew />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {revealedCards === rawCards.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3"
              >
                <Button
                  onClick={onStartScoring}
                  disabled={isProcessing}
                  className="gap-2"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? 'Evaluating...' : 'Evaluate Research'}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Skip Evaluation
                </Button>
              </motion.div>
            )}
          </div>
        );

      case 'scoring':
        return (
          <div className="space-y-6 text-center p-8">
            <div className="text-5xl animate-pulse mb-4">💡</div>
            <h3 className="text-2xl font-bold font-mono">Evaluating Research...</h3>
            <p className="text-muted-foreground">
              Scoring insights on relevance, credibility, actionability, impact, and uniqueness
            </p>
            <Progress value={66} className="w-full" />
            <div className="text-sm font-mono text-primary animate-pulse">
              PROCESSING_{Math.floor(Math.random() * 100)}...
            </div>
          </div>
        );

      case 'perspectives':
        return (
          <div className="space-y-6">
            {showConfetti && <ParticleEffect type="confetti" count={100} />}
            
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="text-xl font-bold font-mono">Research Complete!</h3>
              <p className="text-sm text-muted-foreground">
                {insightCards.length} scored insights + {perspectiveCards.length} team perspectives
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-card/50 rounded-lg border border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{insightCards.length}</div>
                <div className="text-xs text-muted-foreground">Scored Insights</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{perspectiveCards.length}</div>
                <div className="text-xs text-muted-foreground">Team Perspectives</div>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-6 p-4">
                {/* Scored Insights */}
                <div>
                  <h4 className="text-sm font-mono font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Scored Research Insights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insightCards.map(card => (
                      <CollectibleCard key={card.id} card={card} isNew />
                    ))}
                  </div>
                </div>

                {/* Team Perspectives */}
                <div>
                  <h4 className="text-sm font-mono font-bold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team Perspectives
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {perspectiveCards.map(card => (
                      <CollectibleCard key={card.id} card={card} isNew />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="flex items-center justify-center">
              <Button onClick={onClose} size="lg" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Continue
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="font-mono">Research Stage</span>
            <Badge variant="outline" className="font-mono">
              {phase === 'raw' ? 'RAW RESEARCH' : phase === 'scoring' ? 'EVALUATING' : 'COMPLETE'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {renderPhaseContent()}
      </DialogContent>
    </Dialog>
  );
}
