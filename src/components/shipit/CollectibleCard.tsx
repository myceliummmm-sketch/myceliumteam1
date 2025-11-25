import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Code, Lightbulb, Rocket, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cardRevealAnimation } from '@/lib/animations';
import { useState, useEffect } from 'react';

interface CollectibleCardProps {
  card: {
    id: string;
    card_type: 'IDEA' | 'INSIGHT' | 'DESIGN' | 'CODE' | 'GROWTH' | 'AUTHENTICITY';
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
    artwork_url?: string | null;
  };
  isNew?: boolean;
}

const cardTypeIcons = {
  IDEA: Lightbulb,
  INSIGHT: Sparkles,
  DESIGN: Code,
  CODE: Code,
  GROWTH: Rocket,
  AUTHENTICITY: Sparkles, // Will use emoji instead
};

const cardTypeEmoji = {
  IDEA: '💡',
  INSIGHT: '🔍',
  DESIGN: '🎨',
  CODE: '💻',
  GROWTH: '🚀',
  AUTHENTICITY: '🎭',
};

const rarityStyles = {
  common: {
    border: 'border-gray-500/30',
    glow: 'shadow-[0_0_10px_rgba(156,163,175,0.1)]',
    text: 'text-gray-400',
    bg: 'bg-gray-500/5',
  },
  uncommon: {
    border: 'border-green-500/30',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    text: 'text-green-400',
    bg: 'bg-green-500/5',
  },
  rare: {
    border: 'border-blue-500/40',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  epic: {
    border: 'border-purple-500/50',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  legendary: {
    border: 'border-amber-500/60',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-pulse',
    text: 'text-amber-400',
    bg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
  },
};

export function CollectibleCard({ card, onClick, isNew = false }: CollectibleCardProps & { onClick?: () => void }) {
  const style = rarityStyles[card.rarity];
  const emoji = cardTypeEmoji[card.card_type];
  const [showAnimation, setShowAnimation] = useState(isNew);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShowAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const CardComponent = showAnimation ? motion(Card) : Card;
  const animationProps = showAnimation ? {
    initial: cardRevealAnimation.initial,
    animate: cardRevealAnimation.animate,
    transition: cardRevealAnimation.transition
  } : {};

  return (
    <CardComponent
      {...animationProps}
      onClick={onClick}
      className={`
        relative overflow-hidden border-2 ${style.border} ${style.glow}
        hover:scale-[1.02] transition-all duration-300 cursor-pointer group
        aspect-[3/4] flex flex-col
      `}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan-line pointer-events-none" />
      
      {/* Top Bar - Type & Rarity */}
      <div className="relative z-10 bg-gradient-to-b from-background/90 to-background/60 backdrop-blur-sm px-3 py-2 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <Badge variant="outline" className={`text-xs font-mono ${style.text} border-current`}>
            L{card.level}:{card.card_type}
          </Badge>
        </div>
        <Badge variant="outline" className={`font-mono text-xs ${style.text} border-current`}>
          {card.rarity.toUpperCase()}
        </Badge>
      </div>

      {/* Central Artwork */}
      <div className="relative flex-1 bg-gradient-to-br from-background/20 to-background/40">
        {card.artwork_url ? (
          <>
            <img
              src={card.artwork_url}
              alt={card.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-6xl opacity-30 animate-pulse`}>{emoji}</div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/20">
            <div className="text-center space-y-2 px-4">
              <div className={`text-6xl opacity-30`}>{emoji}</div>
              <p className="text-xs font-mono text-muted-foreground/50">GENERATING ARTWORK...</p>
            </div>
          </div>
        )}
        
        {/* Corner glow accent */}
        <div className={`absolute top-0 right-0 w-24 h-24 ${style.bg} opacity-30 blur-3xl pointer-events-none`} />
      </div>

      {/* Bottom Bar - Stats */}
      <div className="relative z-10 bg-gradient-to-t from-background/90 to-background/60 backdrop-blur-sm px-3 py-2 border-t border-border/30">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {card.average_score && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">SCORE</span>
                <div className="flex-1 h-1 bg-background/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${style.bg} transition-all`}
                    style={{ width: `${(card.average_score / 10) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-mono font-bold ${style.text} whitespace-nowrap`}>
                  {card.average_score.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            {card.created_by_character && (
              <span className={`${style.text}`}>🔥</span>
            )}
            <span className="whitespace-nowrap">{card.times_used}x</span>
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div className={`absolute inset-0 ${style.bg} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />
    </CardComponent>
  );
}
