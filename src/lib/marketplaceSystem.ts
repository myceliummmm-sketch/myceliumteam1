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
 * Mark a card as tradable and calculate its value
 */
export const markCardTradable = async (cardId: string): Promise<{ success: boolean; tradeValue?: number; error?: string }> => {
  try {
    const { data: card, error: fetchError } = await supabase
      .from('dynamic_cards')
      .select('*')
      .eq('id', cardId)
      .single();
    
    if (fetchError || !card) {
      return { success: false, error: 'Card not found' };
    }
    
    const tradeValue = calculateTradeValue(card);
    
    // Note: Marketplace fields (is_tradable, trade_value) will be added via migration
    // For now, we calculate the value but don't store it
    console.log(`Card ${cardId} marked tradable with value ${tradeValue}`);
    
    return { success: true, tradeValue };
  } catch (error) {
    return { success: false, error: 'Failed to mark card as tradable' };
  }
};

/**
 * Remove a card from the marketplace
 */
export const unmarkCardTradable = async (cardId: string): Promise<{ success: boolean; error?: string }> => {
  // Note: Marketplace fields will be added via migration
  console.log(`Card ${cardId} unmarked as tradable`);
  return { success: true };
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
 * Simulate a trade transaction (placeholder for future implementation)
 */
export const simulateTrade = (
  card: any,
  seller: { id: string; spores: number },
  buyer: { id: string; spores: number }
): { success: boolean; message: string } => {
  const tradeValue = card.trade_value || calculateTradeValue(card);
  
  if (!canAffordCard(buyer.spores, tradeValue)) {
    return {
      success: false,
      message: `Insufficient spores. Need ${tradeValue}, have ${buyer.spores}`
    };
  }
  
  return {
    success: true,
    message: `Trade successful! ${card.title} transferred for ${tradeValue} spores`
  };
};
