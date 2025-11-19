import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortAsc } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollectibleCard } from './CollectibleCard';
import { CardDetailModal } from './CardDetailModal';

interface DynamicCard {
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
  created_at: string;
}

export function CardCollection() {
  const { user } = useAuth();
  const [cards, setCards] = useState<DynamicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<DynamicCard | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadCards();
    }
  }, [user]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dynamic_cards')
        .select('*')
        .eq('player_id', user?.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards((data || []) as DynamicCard[]);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter((card) => {
    if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !card.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (rarityFilter && card.rarity !== rarityFilter) return false;
    if (typeFilter && card.card_type !== typeFilter) return false;
    return true;
  });

  const rarityColors = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const levelLabels = ['VISION', 'RESEARCH', 'PROTOTYPE', 'BUILD', 'GROW'];

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm border-l border-border/30">
      {/* Header */}
      <div className="p-4 border-b border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold font-mono neon-text-cyan">
            &gt; CARD_COLLECTION.EXE
          </h2>
          <Badge variant="outline" className="font-mono">
            {filteredCards.length}/{cards.length}
          </Badge>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="bg-background/50 p-2 rounded border border-primary/20">
            <div className="text-muted-foreground">TOTAL</div>
            <div className="text-primary font-bold text-lg">{cards.length}</div>
          </div>
          <div className="bg-background/50 p-2 rounded border border-primary/20">
            <div className="text-muted-foreground">LEGENDARY</div>
            <div className="text-amber-400 font-bold text-lg">
              {cards.filter(c => c.rarity === 'legendary').length}
            </div>
          </div>
          <div className="bg-background/50 p-2 rounded border border-primary/20">
            <div className="text-muted-foreground">USED</div>
            <div className="text-green-400 font-bold text-lg">
              {cards.reduce((sum, c) => sum + c.times_used, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-3 border-b border-border/30 bg-card/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="SEARCH CARDS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 font-mono text-sm bg-background/50 border-primary/20"
          />
        </div>

        {/* Rarity Filter */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant={rarityFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRarityFilter(null)}
            className="text-xs font-mono h-7"
          >
            ALL
          </Button>
          {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((rarity) => (
            <Button
              key={rarity}
              variant={rarityFilter === rarity ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRarityFilter(rarity)}
              className={`text-xs font-mono h-7 ${rarityFilter === rarity ? '' : rarityColors[rarity]}`}
            >
              {rarity.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant={typeFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter(null)}
            className="text-xs font-mono h-7"
          >
            ALL TYPES
          </Button>
          {(['IDEA', 'INSIGHT', 'DESIGN', 'CODE', 'GROWTH'] as const).map((type, idx) => (
            <Button
              key={type}
              variant={typeFilter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(type)}
              className="text-xs font-mono h-7"
            >
              L{idx + 1}:{type}
            </Button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-pulse font-mono text-primary">
              &gt; LOADING_CARDS...
            </div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="p-8 text-center">
            <div className="font-mono text-muted-foreground space-y-2">
              <div>&gt; NO_CARDS_FOUND</div>
              <div className="text-xs">
                {cards.length === 0
                  ? 'Start conversations with your team to generate cards'
                  : 'Try adjusting your filters'}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 gap-4">
            {filteredCards.map((card) => (
              <CollectibleCard 
                key={card.id} 
                card={card}
                onClick={() => {
                  setSelectedCard(card);
                  setShowDetailModal(true);
                }}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {showDetailModal && selectedCard && (
        <CardDetailModal
          card={selectedCard}
          open={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}
