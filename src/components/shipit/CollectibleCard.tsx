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
  const Icon = cardTypeIcons[card.card_type];
  const style = rarityStyles[card.rarity];
  const emoji = cardTypeEmoji[card.card_type];
  const [showAnimation, setShowAnimation] = useState(isNew);

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
        relative overflow-hidden border-2 ${style.border} ${style.bg} ${style.glow}
        hover:scale-[1.02] transition-all duration-300 cursor-pointer
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity
      `}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan-line pointer-events-none" />
      
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{emoji}</div>
            <div>
              <Badge variant="outline" className={`text-xs font-mono ${style.text}`}>
                L{card.level}:{card.card_type}
              </Badge>
            </div>
          </div>
          <Badge variant="outline" className={`font-mono text-xs ${style.text}`}>
            {card.rarity.toUpperCase()}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-mono font-bold text-foreground leading-tight">
          {card.title}
        </h3>

        {/* Content Preview */}
        <p className="text-sm text-muted-foreground font-mono leading-relaxed line-clamp-3">
          {card.content}
        </p>

        {/* Stats Bar */}
        {card.average_score && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">SCORE</span>
              <span className={style.text}>{card.average_score.toFixed(1)}/10</span>
            </div>
            <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${style.bg} ${style.border} border-l-2 transition-all`}
                style={{ width: `${(card.average_score / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            {card.created_by_character && (
              <Badge variant="secondary" className="text-xs">
                {card.created_by_character}
              </Badge>
            )}
            <span>USED: {card.times_used}x</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className={`text-xs font-mono ${style.text} hover:${style.bg}`}
          >
            VIEW
          </Button>
        </div>
      </div>

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${style.bg} opacity-50 blur-2xl pointer-events-none`} />
    </CardComponent>
  );
}
