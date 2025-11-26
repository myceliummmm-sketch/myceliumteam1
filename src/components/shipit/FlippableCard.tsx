import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, MessageSquare, Archive, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FlippableCardProps {
  card: {
    id: string;
    card_type: string;
    level: number;
    rarity: string;
    title: string;
    content: string;
    description?: string;
    created_by_character?: string;
    tags?: string[];
    average_score?: number;
    times_used?: number;
    visual_theme?: string;
    artwork_url?: string;
  };
  isNew?: boolean;
  onClick?: () => void;
  onUseInChat?: () => void;
  onArchive?: () => void;
}

const rarityStyles = {
  common: {
    border: "border-gray-400",
    glow: "shadow-[0_0_15px_rgba(156,163,175,0.3)]",
    text: "text-gray-400",
    bg: "bg-gradient-to-br from-gray-400/10 to-gray-500/5",
    gems: "bg-gray-400"
  },
  rare: {
    border: "border-blue-400",
    glow: "shadow-[0_0_20px_rgba(96,165,250,0.4)]",
    text: "text-blue-400",
    bg: "bg-gradient-to-br from-blue-400/10 to-blue-500/5",
    gems: "bg-blue-400"
  },
  epic: {
    border: "border-purple-400",
    glow: "shadow-[0_0_25px_rgba(192,132,252,0.5)]",
    text: "text-purple-400",
    bg: "bg-gradient-to-br from-purple-400/10 to-purple-500/5",
    gems: "bg-purple-400"
  },
  legendary: {
    border: "border-amber-400",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.6)]",
    text: "text-amber-400",
    bg: "bg-gradient-to-br from-amber-400/10 to-amber-500/5",
    gems: "bg-amber-400"
  }
};

export const FlippableCard = ({ card, isNew, onClick, onUseInChat, onArchive }: FlippableCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const rarity = card.rarity?.toLowerCase() || "common";
  const styles = rarityStyles[rarity as keyof typeof rarityStyles] || rarityStyles.common;

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(card.content);
    toast.success("Copied to clipboard");
  };

  const handleUseInChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUseInChat) onUseInChat();
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onArchive) onArchive();
  };

  const renderStars = () => {
    const score = card.average_score || 0;
    const stars = Math.round(score / 20); // Convert 0-100 to 0-5 stars
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < stars ? `fill-current ${styles.text}` : 'fill-muted text-muted'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="relative w-full h-64 perspective-1000"
      onClick={onClick}
      animate={isNew ? {
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: 3 }
      } : {}}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {/* FRONT */}
        <Card
          className={`absolute inset-0 ${styles.border} ${styles.glow} ${styles.bg} border-2 backface-hidden overflow-hidden`}
        >
          {/* Rarity Gems */}
          <div className="absolute top-2 left-2 flex gap-1">
            {[...Array(rarity === 'legendary' ? 4 : rarity === 'epic' ? 3 : rarity === 'rare' ? 2 : 1)].map((_, i) => (
              <div key={i} className={`w-2 h-2 ${styles.gems} rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>

          {/* Flip Hint */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 text-xs opacity-70 hover:opacity-100"
            onClick={handleFlip}
          >
            Flip
          </Button>

          {/* Artwork */}
          <div className="w-full h-3/4 flex items-center justify-center overflow-hidden">
            {card.artwork_url ? (
              <img src={card.artwork_url} alt={card.title} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full ${styles.bg} flex items-center justify-center`}>
                <Sparkles className={`w-16 h-16 ${styles.text} opacity-30`} />
              </div>
            )}
          </div>

          {/* Bottom Bar - Rating */}
          <div className={`absolute bottom-0 left-0 right-0 h-1/4 bg-card/95 backdrop-blur border-t ${styles.border} flex items-center justify-between px-4`}>
            <div>
              {renderStars()}
              <p className={`text-xs mt-1 ${styles.text} font-semibold uppercase tracking-wide`}>
                {card.rarity}
              </p>
            </div>
            {card.average_score !== undefined && (
              <div className={`text-2xl font-bold ${styles.text}`}>
                {Math.round(card.average_score)}
              </div>
            )}
          </div>

          {/* New Card Indicator */}
          {isNew && (
            <div className="absolute top-4 right-4 animate-pulse">
              <Badge className="bg-primary text-primary-foreground">NEW</Badge>
            </div>
          )}
        </Card>

        {/* BACK */}
        <Card
          className={`absolute inset-0 ${styles.border} ${styles.glow} border-2 backface-hidden overflow-hidden`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="h-full flex flex-col p-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg line-clamp-1">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleFlip}
              >
                Flip
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 mb-3">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                {card.content}
              </p>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-xs text-muted-foreground border-t pt-2">
              {card.created_by_character && (
                <p>Created by: <span className="text-foreground">{card.created_by_character}</span></p>
              )}
              {card.times_used !== undefined && (
                <p>Used: <span className="text-foreground">{card.times_used} times</span></p>
              )}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3 pt-2 border-t">
              <Button size="sm" variant="outline" onClick={handleCopy} className="flex-1">
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              {onUseInChat && (
                <Button size="sm" variant="default" onClick={handleUseInChat} className="flex-1">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Use
                </Button>
              )}
              {onArchive && (
                <Button size="sm" variant="ghost" onClick={handleArchive}>
                  <Archive className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
