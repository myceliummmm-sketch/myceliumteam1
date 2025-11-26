import { supabase } from "@/integrations/supabase/client";

export interface MarketplaceListing {
  id: string;
  cardId: string;
  sellerId: string;
  priceSpores: number;
  status: 'active' | 'sold' | 'cancelled';
  listedAt: Date;
  soldAt?: Date;
  buyerId?: string;
}

export interface TradeHistory {
  cardId: string;
  fromPlayerId: string;
  toPlayerId: string;
  priceSpores: number;
  tradedAt: Date;
}

/**
 * Calculate the trade value of a card based on rarity, scores, and usage
 */
export const calculateTradeValue = (card: any): number => {
  let baseValue = 100;
  
  // Rarity multiplier
  const rarityMultipliers = {
    common: 1,
    rare: 2,
    epic: 5,
    legendary: 10
  };
  
  const rarity = card.rarity?.toLowerCase() || 'common';
  baseValue *= rarityMultipliers[rarity as keyof typeof rarityMultipliers] || 1;
  
  // Score bonus (0-100 score adds 0-100% to value)
  if (card.average_score) {
    baseValue *= (1 + (card.average_score / 100));
  }
  
  // Usage bonus (popular cards are worth more)
  if (card.times_used && card.times_used > 0) {
    baseValue *= (1 + Math.log10(card.times_used) * 0.1);
  }
  
  // Level bonus
  if (card.level > 1) {
    baseValue *= (1 + (card.level - 1) * 0.2);
  }
  
  return Math.round(baseValue);
};

/**
 * List a card for trade on the marketplace
 */
export const listCardForTrade = async (cardId: string, price: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('dynamic_cards')
      .update({ 
        is_tradable: true, 
        trade_value: price 
      })
      .eq('id', cardId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error listing card:', error);
    return { success: false, error: error.message || 'Failed to list card' };
  }
};

/**
 * Remove a card from the marketplace
 */
export const unlistCard = async (cardId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('dynamic_cards')
      .update({ 
        is_tradable: false, 
        trade_value: 0 
      })
      .eq('id', cardId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to unlist card' };
  }
};

/**
 * Get trade history for a card
 */
export const getCardTradeHistory = (card: any): TradeHistory[] => {
  if (!card.ownership_history || !Array.isArray(card.ownership_history)) {
    return [];
  }
  
  return card.ownership_history;
};

/**
 * Get the estimated market value range for a card type
 */
export const getMarketValueRange = (cardType: string, rarity: string): { min: number; max: number } => {
  const baseRanges = {
    common: { min: 50, max: 200 },
    rare: { min: 150, max: 500 },
    epic: { min: 400, max: 1500 },
    legendary: { min: 1000, max: 5000 }
  };
  
  return baseRanges[rarity.toLowerCase() as keyof typeof baseRanges] || baseRanges.common;
};

/**
 * Check if a player can afford a card
 */
export const canAffordCard = (playerSpores: number, cardPrice: number): boolean => {
  return playerSpores >= cardPrice;
};

/**
 * Purchase a card from the marketplace
 */
export const purchaseCard = async (cardId: string, buyerId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get card details
    const { data: card, error: cardError } = await supabase
      .from('dynamic_cards')
      .select('*')
      .eq('id', cardId)
      .single();
    
    if (cardError || !card) {
      return { success: false, error: 'Card not found' };
    }

    // Get buyer's current spores (from game_states or game store)
    const { data: buyerState } = await supabase
      .from('game_states')
      .select('spores')
      .eq('session_id', buyerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const buyerSpores = buyerState?.spores || 0;

    if (buyerSpores < card.trade_value) {
      return { success: false, error: 'Not enough spores' };
    }

    // Update ownership history
    const newHistory: any[] = Array.isArray(card.ownership_history) 
      ? [...card.ownership_history]
      : [];
    
    newHistory.push({
      fromPlayer: card.player_id,
      toPlayer: buyerId,
      price: card.trade_value,
      date: new Date().toISOString()
    });

    // Transfer card ownership and unlist
    const { error: updateError } = await supabase
      .from('dynamic_cards')
      .update({
        player_id: buyerId,
        is_tradable: false,
        ownership_history: newHistory
      })
      .eq('id', cardId);

    if (updateError) throw updateError;

    // Deduct spores from buyer (game store will handle this via processGameEvents)
    // This is a simplified version - in production, use a database transaction
    
    return { success: true };
  } catch (error: any) {
    console.error('Purchase error:', error);
    return { success: false, error: error.message || 'Failed to purchase card' };
  }
};
