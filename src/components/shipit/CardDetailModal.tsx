import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Star, Archive, MessageSquare, Copy, Share, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SimilarCardsPanel } from './SimilarCardsPanel';
import everAvatar from '@/assets/advisor-ever-green.png';
import prismaAvatar from '@/assets/advisor-prisma.png';
import toxicAvatar from '@/assets/advisor-toxic.png';
import phoenixAvatar from '@/assets/advisor-phoenix.png';
import techPriestAvatar from '@/assets/advisor-tech-priest.png';
import virgilAvatar from '@/assets/advisor-virgil.png';
import zenAvatar from '@/assets/advisor-zen.png';

interface CardDetailModalProps {
  card: any;
  open: boolean;
  onClose: () => void;
  onCardClick?: (card: any) => void;
}

const characterAvatars: Record<string, string> = {
  ever: everAvatar,
  prisma: prismaAvatar,
  toxic: toxicAvatar,
  phoenix: phoenixAvatar,
  techpriest: techPriestAvatar,
  virgil: virgilAvatar,
  zen: zenAvatar
};

const rarityStyles: Record<string, string> = {
  common: 'bg-slate-600 text-slate-100',
  uncommon: 'bg-green-600 text-green-100',
  rare: 'bg-cyan-600 text-cyan-100',
  epic: 'bg-purple-600 text-purple-100',
  legendary: 'bg-yellow-600 text-yellow-100'
};

function generateAsciiBar(score: number): string {
  const filled = Math.round((score / 10) * 20);
  const empty = 20 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function getScoreColor(score: number): string {
  if (score >= 9) return 'hsl(var(--success))';
  if (score >= 7) return 'hsl(var(--info))';
  if (score >= 5) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
}

export function CardDetailModal({ card, open, onClose, onCardClick }: CardDetailModalProps) {
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [timesUsed, setTimesUsed] = useState(card.times_used || 0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(card.artwork_url || null);

  // Load evaluation data
  useState(() => {
    if (open && card.id) {
      supabase
        .from('card_evaluations')
        .select('*')
        .eq('card_id', card.id)
        .single()
        .then(({ data }) => {
          if (data) setEvaluation(data);
        });
    }
  });

  const handleUseInChat = async () => {
    const event = new CustomEvent('insertPromptToChat', {
      detail: {
        text: card.content,
        meta: {
          cardId: card.id,
          cardTitle: card.title,
          cardType: card.card_type
        }
      }
    });
    window.dispatchEvent(event);

    await supabase
      .from('dynamic_cards')
      .update({
        times_used: timesUsed + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', card.id);

    setTimesUsed(timesUsed + 1);
    toast.success(`Using ${card.title} in chat`);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(card.content);
    toast.success('Card content copied');
  };

  const handleArchive = async () => {
    await supabase
      .from('dynamic_cards')
      .update({ is_archived: true })
      .eq('id', card.id);
    toast.success('Card archived');
    onClose();
  };

  const handleFavorite = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    toast.success(newFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleRegenerateArtwork = async () => {
    if (!card) return;
    
    setIsRegenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('regenerate-card-artwork', {
        body: { card_id: card.id }
      });

      if (error) throw error;

      if (data.artwork_url) {
        setArtworkUrl(data.artwork_url);
        toast.success('Artwork regenerated successfully!');
      }
    } catch (error) {
      console.error('Error regenerating artwork:', error);
      toast.error('Failed to regenerate artwork');
    } finally {
      setIsRegenerating(false);
    }
  };

  const cardTypeEmoji: Record<string, string> = {
    AUTHENTICITY: '🎭',
    IDEA: '💡',
    INSIGHT: '🔍',
    PROBLEM: '⚠️',
    SOLUTION: '✨',
    DECISION: '⚖️',
    MILESTONE: '🏆',
    BLOCKER: '🚧',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-background border-2 border-primary/50">
        <DialogHeader className="border-b border-primary/30 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-mono text-primary mb-2">
                {card.title}
              </DialogTitle>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={rarityStyles[card.rarity]}>
                  {card.rarity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {card.card_type}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  LVL {card.level}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleFavorite}>
                <Star className={isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleArchive}>
                <Archive />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-6">
            {/* Artwork Section */}
            <div className="relative">
              <h3 className="text-sm font-mono text-primary mb-3 uppercase tracking-wider">
                // ARTWORK
              </h3>
              <div className={`relative aspect-[3/4] max-w-[280px] mx-auto rounded-lg overflow-hidden border-2 ${rarityStyles[card.rarity]?.replace('bg-', 'border-')}`}>
                {artworkUrl ? (
                  <>
                    <img 
                      src={artworkUrl} 
                      alt={card.title}
                      className="w-full h-full object-cover animate-in fade-in duration-500"
                    />
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none opacity-30" 
                         style={{ 
                           backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.03) 2px, hsl(var(--primary) / 0.03) 4px)'
                         }} 
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <span className="text-6xl opacity-50">
                      {cardTypeEmoji[card.card_type] || '🎴'}
                    </span>
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRegenerateArtwork}
                disabled={isRegenerating}
                className="mt-3 w-full font-mono text-xs"
              >
                <Sparkles className="h-3 w-3 mr-2" />
                {isRegenerating ? 'Generating...' : artworkUrl ? 'Regenerate Artwork' : 'Generate Artwork'}
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-mono text-primary mb-2 uppercase tracking-wider">
                // Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-mono text-primary mb-2 uppercase tracking-wider">
                // Full Content
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg border border-primary/20 font-mono text-sm whitespace-pre-wrap">
                {card.content}
              </div>
            </div>
            
            {evaluation && (
              <div>
                <h3 className="text-sm font-mono text-primary mb-4 uppercase tracking-wider">
                  // Evaluation Matrix
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(num => (
                    <div key={num} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-foreground">
                          {evaluation[`factor_${num}_name`]}
                        </span>
                        <span className="font-mono text-lg font-bold text-primary">
                          {evaluation[`factor_${num}_score`]}/10
                        </span>
                      </div>
                      
                      <div className="relative h-6 bg-muted border border-primary/30 rounded overflow-hidden">
                        <div className="absolute inset-0 opacity-10"
                             style={{
                               backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, hsl(var(--primary)) 4px, hsl(var(--primary)) 5px)',
                               backgroundSize: '10px 100%'
                             }}
                        />
                        
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(evaluation[`factor_${num}_score`] / 10) * 100}%` }}
                          transition={{ duration: 0.8, delay: num * 0.1, ease: 'easeOut' }}
                          className="relative h-full"
                          style={{
                            backgroundColor: getScoreColor(evaluation[`factor_${num}_score`])
                          }}
                        >
                          <motion.div
                            className="absolute inset-y-0 w-1 bg-white/50"
                            animate={{ x: [0, '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          />
                        </motion.div>
                        
                        <div className="absolute inset-0 flex items-center px-2 font-mono text-xs text-white/80 mix-blend-difference">
                          {generateAsciiBar(evaluation[`factor_${num}_score`])}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground pl-2 border-l-2 border-primary/30">
                        {evaluation[`factor_${num}_explanation`]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
              <div>
                <div className="text-xs font-mono text-primary mb-1">CREATED BY</div>
                <div className="flex items-center gap-2">
                  {card.created_by_character && (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={characterAvatars[card.created_by_character]} />
                      </Avatar>
                      <span className="text-sm font-mono capitalize">{card.created_by_character}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-xs font-mono text-primary mb-1">TIMES USED</div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  {timesUsed}
                </div>
              </div>
              
              {card.contributing_characters && card.contributing_characters.length > 0 && (
                <div className="col-span-2">
                  <div className="text-xs font-mono text-primary mb-2">CONTRIBUTORS</div>
                  <div className="flex gap-2">
                    {card.contributing_characters.map((char: string) => (
                      <Avatar key={char} className="h-8 w-8 border-2 border-primary/30">
                        <AvatarImage src={characterAvatars[char]} />
                      </Avatar>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {card.tags && card.tags.length > 0 && (
              <div>
                <div className="text-xs font-mono text-primary mb-2 uppercase">// Tags</div>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="font-mono text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Similar Cards Section */}
            <div className="mt-6 pt-6 border-t border-primary/30">
              <SimilarCardsPanel 
                cardId={card.id} 
                onCardClick={(similarCard) => {
                  onClose();
                  onCardClick?.(similarCard);
                }}
              />
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex gap-3 pt-4 border-t border-primary/30">
          <Button
            onClick={handleUseInChat}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-mono"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            USE IN CHAT
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="font-mono border-primary/50 hover:bg-primary/10"
          >
            <Copy className="mr-2 h-4 w-4" />
            COPY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
