import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, Filter, SortAsc, ChevronLeft, Sparkles, LogOut, LayoutGrid, List, Package } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FlippableCard } from './FlippableCard';
import { CardDeck } from './CardDeck';
import { CardDetailModal } from './CardDetailModal';
import { PromptGenerationModal } from './PromptGenerationModal';
import { groupCardsByPhase, groupCardsByCharacter, groupCardsByType } from '@/lib/cardDeckSystem';
import { useGameStore } from '@/stores/gameStore';
import { ParticleEffect } from './ParticleEffect';
import { VersionTogglePanel } from './VersionTogglePanel';
import { motion } from 'framer-motion';
import { SemanticSearchBar } from './SemanticSearchBar';
import { DuplicateDetectionAlert } from './DuplicateDetectionAlert';
import { DYNAMIC_CARD_COLUMNS } from '@/lib/cardColumns';

interface DynamicCard {
  id: string;
  card_type: 'IDEA' | 'INSIGHT' | 'DESIGN' | 'CODE' | 'GROWTH' | 'AUTHENTICITY' | 'RAW_RESEARCH' | 'RESEARCH_INSIGHT' | 'TEAM_PERSPECTIVE';
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
  const [semanticResults, setSemanticResults] = useState<DynamicCard[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<DynamicCard | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'decks'>('grid');
  const [deckGrouping, setDeckGrouping] = useState<'phase' | 'character' | 'type'>('phase');
  
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
        .select(DYNAMIC_CARD_COLUMNS)
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

  const handleSemanticSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('semantic-card-search', {
        body: { query, limit: 20, minSimilarity: 0.6 }
      });
      
      if (error) throw error;
      setSemanticResults(data.results || []);
      setSearchQuery(query);
    } catch (error) {
      console.error('Semantic search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeywordSearch = (query: string) => {
    setSearchQuery(query);
    setSemanticResults(null);
  };

  const filteredCards = (semanticResults || cards).filter((card) => {
    if (!semanticResults && searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
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

      {/* Search, Filters and Generate Prompt */}
      <div className="p-4 space-y-3 border-b border-border/30 bg-card/20">
        <div className="flex items-center gap-2">
          <SemanticSearchBar
            onSearch={handleKeywordSearch}
            onSemanticSearch={handleSemanticSearch}
            isLoading={isSearching}
          />
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-9 w-9"
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-9 w-9"
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'decks' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('decks')}
              className="h-9 w-9"
              title="Deck View"
            >
              <Package className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Deck Grouping Selector - Only visible in decks view */}
        {viewMode === 'decks' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">GROUP BY:</span>
            <div className="flex gap-1">
              <Button
                variant={deckGrouping === 'phase' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeckGrouping('phase')}
                className="text-xs font-mono h-7"
              >
                PHASE
              </Button>
              <Button
                variant={deckGrouping === 'character' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeckGrouping('character')}
                className="text-xs font-mono h-7"
              >
                CHARACTER
              </Button>
              <Button
                variant={deckGrouping === 'type' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeckGrouping('type')}
                className="text-xs font-mono h-7"
              >
                TYPE
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPromptModal(true)}
            disabled={filteredCards.length === 0}
            className="gap-2 whitespace-nowrap flex-1"
          >
            <Sparkles className="w-4 h-4" />
            Generate Prompt
          </Button>
          <DuplicateDetectionAlert />
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
          {(['RAW_RESEARCH', 'RESEARCH_INSIGHT', 'TEAM_PERSPECTIVE'] as const).map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(type)}
              className="text-xs font-mono h-7"
            >
              {type === 'RAW_RESEARCH' ? '🔬 RAW' : type === 'RESEARCH_INSIGHT' ? '💡 INSIGHT' : '👥 TEAM'}
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
        ) : viewMode === 'list' ? (
          <div className="p-4 space-y-2">
            {filteredCards.map((card) => (
              <div 
                key={card.id} 
                className="p-4 bg-card rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedCard(card);
                  setShowDetailModal(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center text-2xl">
                    {card.rarity === 'legendary' ? '👑' : card.rarity === 'epic' ? '💎' : card.rarity === 'rare' ? '⭐' : '📄'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{card.description}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20">{card.card_type}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20">{card.rarity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCards.map((card) => (
              <FlippableCard
                key={card.id}
                card={card}
                isNew={card.id === newCardId}
                onClick={() => {
                  setSelectedCard(card);
                  setShowDetailModal(true);
                }}
                onUseInChat={() => {
                  window.dispatchEvent(new CustomEvent('useCardInChat', { detail: { card } }));
                  toast.success(`"${card.title}" added to chat context`);
                }}
                onArchive={async () => {
                  try {
                    const { error } = await supabase
                      .from('dynamic_cards')
                      .update({ is_archived: true })
                      .eq('id', card.id);
                    
                    if (error) throw error;
                    
                    toast.success('Card archived');
                    await loadCards();
                  } catch (error) {
                    console.error('Error archiving card:', error);
                    toast.error('Failed to archive card');
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="p-4">
            {(() => {
              const decks = deckGrouping === 'phase' 
                ? groupCardsByPhase(filteredCards)
                : deckGrouping === 'character'
                ? groupCardsByCharacter(filteredCards)
                : groupCardsByType(filteredCards);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {decks.map((deck) => (
                    <CardDeck
                      key={deck.id}
                      deck={deck}
                      onCardClick={(card) => {
                        setSelectedCard(card);
                        setShowDetailModal(true);
                      }}
                    />
                  ))}
                </div>
              );
            })()}
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
          onCardClick={(card) => {
            setSelectedCard(card);
            setShowDetailModal(true);
          }}
        />
      )}
      
      <PromptGenerationModal
        open={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        allCards={filteredCards}
      />
    </div>
  );
}
