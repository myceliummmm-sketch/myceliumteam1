import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CollectibleCard } from './CollectibleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Link2 } from 'lucide-react';

interface SimilarCardsPanelProps {
  cardId: string;
  onCardClick?: (card: any) => void;
}

export function SimilarCardsPanel({ cardId, onCardClick }: SimilarCardsPanelProps) {
  const [similarCards, setSimilarCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimilarCards();
  }, [cardId]);

  const loadSimilarCards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('find-similar-cards', {
        body: { cardId, limit: 5 }
      });

      if (error) throw error;
      setSimilarCards(data.similarCards || []);
    } catch (error) {
      console.error('Error loading similar cards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <h3 className="font-mono text-sm text-muted-foreground flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          SIMILAR CARDS
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (similarCards.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="font-mono text-sm text-muted-foreground flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          SIMILAR CARDS
        </h3>
        <p className="text-xs text-muted-foreground">No similar cards found yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-mono text-sm text-muted-foreground flex items-center gap-2">
        <Link2 className="h-4 w-4" />
        SIMILAR CARDS
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {similarCards.map(card => (
          <div key={card.id} className="relative flex-shrink-0 w-[120px]">
            <CollectibleCard 
              card={card}
              size="thumbnail"
              onClick={() => onCardClick?.(card)}
            />
            <div className="absolute top-1 right-1">
              <span className="text-[8px] font-mono bg-background/90 backdrop-blur-sm px-1 py-0.5 rounded border border-border">
                {(card.similarity * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
