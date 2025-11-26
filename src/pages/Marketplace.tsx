import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, TrendingUp, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { FlippableCard } from '@/components/shipit/FlippableCard';
import { ListCardModal } from '@/components/shipit/ListCardModal';
import { purchaseCard, unlistCard } from '@/lib/marketplaceSystem';
import { useGameStore } from '@/stores/gameStore';

export default function Marketplace() {
  const { user } = useAuth();
  const spores = useGameStore(state => state.spores);
  const [loading, setLoading] = useState(true);
  const [marketplaceCards, setMarketplaceCards] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedCardToList, setSelectedCardToList] = useState<any>(null);
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  useEffect(() => {
    loadMarketplaceData();

    // Listen for list card events
    const handleListCard = (e: CustomEvent) => {
      setSelectedCardToList(e.detail.card);
      setShowListModal(true);
    };

    window.addEventListener('listCardForTrade' as any, handleListCard);
    return () => window.removeEventListener('listCardForTrade' as any, handleListCard);
  }, []);

  const loadMarketplaceData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load all tradable cards (marketplace browse)
      const { data: allTradable, error: tradableError } = await supabase
        .from('dynamic_cards')
        .select('*')
        .eq('is_tradable', true)
        .neq('player_id', user.id); // Exclude own cards from browse

      if (tradableError) throw tradableError;

      // Load user's listings
      const { data: myCards, error: myError } = await supabase
        .from('dynamic_cards')
        .select('*')
        .eq('player_id', user.id)
        .eq('is_tradable', true);

      if (myError) throw myError;

      setMarketplaceCards(allTradable || []);
      setMyListings(myCards || []);
    } catch (error) {
      console.error('Error loading marketplace:', error);
      toast.error('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCard = async (card: any) => {
    if (!user) return;

    if (spores < card.trade_value) {
      toast.error(`Not enough spores! Need ${card.trade_value}, have ${spores}`);
      return;
    }

    try {
      await purchaseCard(card.id, user.id);
      toast.success(`Purchased "${card.title}" for ${card.trade_value} spores!`);
      await loadMarketplaceData();
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase card');
    }
  };

  const handleUnlistCard = async (cardId: string) => {
    try {
      await unlistCard(cardId);
      toast.success('Card removed from marketplace');
      await loadMarketplaceData();
    } catch (error) {
      console.error('Unlist error:', error);
      toast.error('Failed to unlist card');
    }
  };

  const filteredMarketplace = rarityFilter === 'all' 
    ? marketplaceCards 
    : marketplaceCards.filter(c => c.rarity === rarityFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              Card Marketplace
            </h1>
            <p className="text-muted-foreground">Buy and sell cards with other players</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Your Balance</div>
            <div className="text-2xl font-bold text-primary">💰 {spores} spores</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="browse">
            <TrendingUp className="h-4 w-4 mr-2" />
            Browse ({filteredMarketplace.length})
          </TabsTrigger>
          <TabsTrigger value="listings">
            My Listings ({myListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="mb-4 flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Button
              size="sm"
              variant={rarityFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setRarityFilter('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={rarityFilter === 'common' ? 'default' : 'outline'}
              onClick={() => setRarityFilter('common')}
            >
              Common
            </Button>
            <Button
              size="sm"
              variant={rarityFilter === 'rare' ? 'default' : 'outline'}
              onClick={() => setRarityFilter('rare')}
            >
              Rare
            </Button>
            <Button
              size="sm"
              variant={rarityFilter === 'epic' ? 'default' : 'outline'}
              onClick={() => setRarityFilter('epic')}
            >
              Epic
            </Button>
            <Button
              size="sm"
              variant={rarityFilter === 'legendary' ? 'default' : 'outline'}
              onClick={() => setRarityFilter('legendary')}
            >
              Legendary
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)]">
            {filteredMarketplace.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No cards available in marketplace</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarketplace.map((card) => (
                  <div key={card.id} className="relative">
                    <FlippableCard card={card} />
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">💰 {card.trade_value}</span>
                        <span className="text-sm text-muted-foreground">spores</span>
                      </div>
                      <Button
                        onClick={() => handleBuyCard(card)}
                        disabled={spores < card.trade_value}
                        className="flex-1"
                      >
                        {spores < card.trade_value ? 'Not Enough Spores' : 'Buy Now'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="listings">
          <ScrollArea className="h-[calc(100vh-300px)]">
            {myListings.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">You haven't listed any cards yet</p>
                <p className="text-sm text-muted-foreground">
                  Go to your collection and click "List for Trade" on any card
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((card) => (
                  <div key={card.id} className="relative">
                    <FlippableCard card={card} />
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Badge variant="secondary">Listed for {card.trade_value} spores</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUnlistCard(card.id)}
                      >
                        Unlist
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <ListCardModal
        open={showListModal}
        card={selectedCardToList}
        onClose={() => {
          setShowListModal(false);
          setSelectedCardToList(null);
        }}
        onSuccess={() => {
          loadMarketplaceData();
        }}
      />
    </div>
  );
}
