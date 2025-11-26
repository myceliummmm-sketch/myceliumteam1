import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, X, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGameStore } from "@/stores/gameStore";
import { toast } from "sonner";

interface CardSwipeGameProps {
  onCardLiked?: (card: PlaceholderCard) => void;
  onCardSkipped?: (card: PlaceholderCard) => void;
}

interface PlaceholderCard {
  id: string;
  title: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  estimatedPrice: number;
  cardType: string;
  artworkUrl?: string;
}

const PLACEHOLDER_CARDS: PlaceholderCard[] = [
  {
    id: "placeholder-1",
    title: "User Pain Point",
    description: "Key insight about customer struggles with current solutions",
    rarity: "rare",
    estimatedPrice: 350,
    cardType: "RESEARCH_INSIGHT"
  },
  {
    id: "placeholder-2",
    title: "Market Opportunity",
    description: "Untapped segment with high demand and low competition",
    rarity: "epic",
    estimatedPrice: 750,
    cardType: "RESEARCH_INSIGHT"
  },
  {
    id: "placeholder-3",
    title: "Feature Request",
    description: "Most requested feature from user interviews",
    rarity: "common",
    estimatedPrice: 150,
    cardType: "RAW_RESEARCH"
  },
  {
    id: "placeholder-4",
    title: "Competitive Advantage",
    description: "Unique selling proposition that sets you apart",
    rarity: "legendary",
    estimatedPrice: 1200,
    cardType: "PERSPECTIVE"
  },
  {
    id: "placeholder-5",
    title: "User Behavior Pattern",
    description: "Common workflow observed across multiple user sessions",
    rarity: "rare",
    estimatedPrice: 400,
    cardType: "RESEARCH_INSIGHT"
  },
  {
    id: "placeholder-6",
    title: "Technical Challenge",
    description: "Key technical hurdle identified during feasibility analysis",
    rarity: "epic",
    estimatedPrice: 600,
    cardType: "PERSPECTIVE"
  },
  {
    id: "placeholder-7",
    title: "Customer Quote",
    description: "Powerful testimonial highlighting core problem",
    rarity: "common",
    estimatedPrice: 200,
    cardType: "RAW_RESEARCH"
  },
  {
    id: "placeholder-8",
    title: "Growth Strategy",
    description: "Proven acquisition channel with high ROI potential",
    rarity: "epic",
    estimatedPrice: 850,
    cardType: "PERSPECTIVE"
  }
];

const RARITY_COLORS = {
  common: "bg-slate-500/20 border-slate-500",
  rare: "bg-blue-500/20 border-blue-500",
  epic: "bg-purple-500/20 border-purple-500",
  legendary: "bg-amber-500/20 border-amber-500"
};

const RARITY_TEXT_COLORS = {
  common: "text-slate-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400"
};

export const CardSwipeGame = ({ onCardLiked, onCardSkipped }: CardSwipeGameProps) => {
  const [cards, setCards] = useState<PlaceholderCard[]>([...PLACEHOLDER_CARDS]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const addLikedCard = useGameStore(state => state.addLikedCard);
  const likedCards = useGameStore(state => state.likedCards);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentCard = cards[currentIndex];

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!currentCard) return;

    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right - LIKE
      handleLike();
    } else if (info.offset.x < -threshold) {
      // Swiped left - SKIP
      handleSkip();
    } else {
      // Reset position
      x.set(0);
    }
  };

  const handleLike = () => {
    if (!currentCard) return;
    
    addLikedCard(currentCard);
    onCardLiked?.(currentCard);
    toast.success(`Liked "${currentCard.title}"!`, {
      icon: "❤️",
      duration: 2000
    });
    
    // Move to next card
    x.set(500);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % cards.length);
      x.set(0);
    }, 200);
  };

  const handleSkip = () => {
    if (!currentCard) return;
    
    onCardSkipped?.(currentCard);
    
    // Move to next card
    x.set(-500);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % cards.length);
      x.set(0);
    }, 200);
  };

  if (!currentCard) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No more cards to swipe!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-6">
      {/* Card Stack */}
      <div className="relative w-full max-w-md h-[400px] mb-6">
        {/* Background cards for depth */}
        {cards.slice(currentIndex + 1, currentIndex + 3).map((card, i) => (
          <motion.div
            key={card.id}
            className="absolute inset-0"
            initial={{ scale: 1 - (i + 1) * 0.05, y: (i + 1) * 10 }}
            style={{ zIndex: -i - 1 }}
          >
            <Card className={`h-full border-2 ${RARITY_COLORS[card.rarity]}`}>
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div className="opacity-50">
                  <Badge variant="outline" className="mb-3">
                    {card.rarity.toUpperCase()}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Current card */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity, zIndex: 10 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: "grabbing" }}
        >
          <Card className={`h-full border-2 ${RARITY_COLORS[currentCard.rarity]} shadow-2xl`}>
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className={RARITY_TEXT_COLORS[currentCard.rarity]}>
                    <Sparkles className="w-3 h-3 mr-1" />
                    {currentCard.rarity.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">
                    {currentCard.cardType}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-3">{currentCard.title}</h3>
                <p className="text-muted-foreground">{currentCard.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    ~{currentCard.estimatedPrice} spores
                  </span>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Swipe left to skip • Swipe right to like
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-8">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 p-0"
          onClick={handleSkip}
        >
          <X className="w-8 h-8 text-destructive" />
        </Button>
        <Button
          size="lg"
          className="rounded-full w-16 h-16 p-0 bg-pink-500 hover:bg-pink-600"
          onClick={handleLike}
        >
          <Heart className="w-8 h-8 text-white" />
        </Button>
      </div>

      {/* Liked Counter */}
      <div className="mt-6 text-center">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Heart className="w-4 h-4 mr-2 text-pink-500" />
          {likedCards.length} cards liked
        </Badge>
      </div>
    </div>
  );
};
