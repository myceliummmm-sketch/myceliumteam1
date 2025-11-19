import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortAsc, ChevronLeft, Sparkles, LogOut } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollectibleCard } from './CollectibleCard';
import { CardDetailModal } from './CardDetailModal';
import { useGameStore } from '@/stores/gameStore';
import { ParticleEffect } from './ParticleEffect';
import { VersionTogglePanel } from './VersionTogglePanel';
import { motion } from 'framer-motion';

interface DynamicCard {
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
  created_at: string;
}

interface CardCollectionProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function CardCollection({ collapsed = false, onToggle }: CardCollectionProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const setShowPersonalityAssessment = useGameStore((state) => state.setShowPersonalityAssessment);
  const proMode = useGameStore((state) => state.proMode);
  const [cards, setCards] = useState<DynamicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<DynamicCard | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState(false);
  const [glowBorder, setGlowBorder] = useState(false);
  const [newCardId, setNewCardId] = useState<string | null>(null);
  const [floatingText, setFloatingText] = useState(false);

  useEffect(() => {
    if (user) {
      loadCards();
    }
  }, [user]);

  // Listen for card generation events
  useEffect(() => {
    const handleCardGenerated = () => {
      loadCards();
    };
    
    const handleCardGeneratedWithAnimation = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { cardId, rarity } = customEvent.detail;
      
      // Trigger confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Trigger glow
      setGlowBorder(true);
      setTimeout(() => setGlowBorder(false), 2000);
      
      // Set new card ID for reveal animation
      setNewCardId(cardId);
      setTimeout(() => setNewCardId(null), 2000);
      
      // Show floating text
      setFloatingText(true);
      setTimeout(() => setFloatingText(false), 1500);
      
      // Reload cards
      loadCards();
    };
    
    window.addEventListener('cardGenerated', handleCardGenerated);
    window.addEventListener('cardGeneratedWithAnimation', handleCardGeneratedWithAnimation);
    
    return () => {
      window.removeEventListener('cardGenerated', handleCardGenerated);
      window.removeEventListener('cardGeneratedWithAnimation', handleCardGeneratedWithAnimation);
    };
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

  const levelLabels = ['AUTHENTICITY', 'VISION', 'RESEARCH', 'PROTOTYPE', 'BUILD', 'GROW'];

  return (
    <div className={`h-full flex flex-col bg-background/50 backdrop-blur-sm border-l transition-all duration-300 relative ${
      collapsed ? 'w-16' : 'w-full'
    } ${glowBorder ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'border-border/30'}`}>
      {/* Confetti Effect */}
      {showConfetti && <ParticleEffect type="confetti" count={80} />}
      
      {/* Floating +1 CARD Text */}
      {floatingText && (
        <motion.div
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -100, opacity: 0, scale: 1.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="text-3xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            +1 CARD
          </div>
        </motion.div>
      )}
      
      {/* Collapse Toggle Button */}
      {onToggle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute top-2 -left-3 z-10 h-6 w-6 rounded-full bg-card border border-border shadow-lg hover:bg-accent"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </Button>
      )}

      {collapsed ? (
        // Collapsed view: Just icon and card count
        <div className="h-full p-4 text-center flex flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto">
            <div className="text-3xl">🎴</div>
            <div className="text-xs font-mono text-muted-foreground font-bold">
              {cards.length}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPersonalityAssessment(true)}
              className="w-full text-xs"
              title="Take Authenticity Assessment"
            >
              🎭
            </Button>
          </div>
          
          {/* Bottom buttons in collapsed view */}
          {!proMode && (
            <div className="flex flex-col gap-2 pt-4 mt-auto border-t border-border/30">
              <VersionTogglePanel />
              <Button
                variant="outline"
                size="icon"
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
                className="h-8 w-8 border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Full expanded view
        <>
      {/* Header */}
      <div className="p-4 border-b border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold font-mono neon-text-cyan">
            &gt; CARD_COLLECTION.EXE
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPersonalityAssessment(true)}
              className="gap-1 h-7"
            >
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline text-xs">Assessment</span>
            </Button>
            <Badge variant="outline" className="font-mono">
              {filteredCards.length}/{cards.length}
            </Badge>
          </div>
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
          <Button
            variant={typeFilter === 'AUTHENTICITY' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('AUTHENTICITY')}
            className="text-xs font-mono h-7"
          >
            🎭 L0
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

      {/* Cards Grid - Only in expanded view */}
      <ScrollArea className="flex-1 min-h-0">
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
                isNew={card.id === newCardId}
                onClick={() => {
                  setSelectedCard(card);
                  setShowDetailModal(true);
                }}
              />
            ))}
          </div>
        )}
      </ScrollArea>
      
      {/* Bottom buttons in expanded view */}
      {!proMode && (
        <div className="p-2 border-t border-border/30 bg-card/30 backdrop-blur-sm flex items-center justify-end gap-2 shrink-0">
          <VersionTogglePanel />
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="h-8 w-8 border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
      </>
      )}

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
