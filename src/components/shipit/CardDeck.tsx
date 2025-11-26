import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlippableCard } from "./FlippableCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Layers } from "lucide-react";

interface CardDeckProps {
  deck: {
    id: string;
    name: string;
    description: string;
    cards: any[];
    rarity: 'mixed' | 'common' | 'rare' | 'epic' | 'legendary';
    phase?: string;
  };
  onCardClick?: (card: any) => void;
}

const rarityColors = {
  mixed: "from-gray-400 to-gray-500",
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-500",
  epic: "from-purple-400 to-purple-500",
  legendary: "from-amber-400 to-amber-500"
};

export const CardDeck = ({ deck, onCardClick }: CardDeckProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  
  const coverCard = deck.cards[0];
  const cardCount = deck.cards.length;

  if (!coverCard) return null;

  return (
    <>
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Stacked cards behind */}
        <div className="relative">
          {[...Array(Math.min(3, cardCount))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-card border-2 border-border rounded-lg"
              style={{
                zIndex: -i,
                top: `${i * 4}px`,
                left: `${i * 4}px`,
                right: `${-i * 4}px`,
                opacity: 1 - (i * 0.2)
              }}
              animate={hovering ? {
                top: `${i * 8}px`,
                left: `${i * 8}px`,
                right: `${-i * 8}px`,
              } : {}}
              transition={{ duration: 0.2 }}
            />
          ))}
          
          {/* Cover card */}
          <Card className="relative z-10 h-64 overflow-hidden border-2">
            {/* Deck header */}
            <div className={`absolute top-0 left-0 right-0 bg-gradient-to-r ${rarityColors[deck.rarity]} p-2 flex items-center justify-between`}>
              <div className="flex items-center gap-2 text-white">
                <Layers className="w-4 h-4" />
                <span className="text-sm font-bold">{deck.name}</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {cardCount}
              </Badge>
            </div>

            {/* Card preview */}
            <div className="w-full h-full pt-12">
              {coverCard.artwork_url ? (
                <img 
                  src={coverCard.artwork_url} 
                  alt={coverCard.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="text-center p-4">
                    <h4 className="font-bold text-lg mb-1">{coverCard.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">{coverCard.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Deck description */}
            <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t p-2">
              <p className="text-xs text-muted-foreground line-clamp-2">{deck.description}</p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Deck expansion modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              {deck.name}
              <Badge variant="secondary">{cardCount} cards</Badge>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{deck.description}</p>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {deck.cards.map((card) => (
                <FlippableCard
                  key={card.id}
                  card={card}
                  onClick={() => onCardClick?.(card)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
