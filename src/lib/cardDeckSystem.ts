interface CardDeck {
  id: string;
  name: string;
  description: string;
  cards: any[];
  coverCard: any;
  rarity: 'mixed' | 'common' | 'rare' | 'epic' | 'legendary';
  phase?: string;
  createdAt?: Date;
}

export const groupCardsByPhase = (cards: any[]): CardDeck[] => {
  const phases = ['VISION', 'RESEARCH', 'PROTOTYPE', 'BUILD', 'GROW'];
  const decks: CardDeck[] = [];

  phases.forEach(phase => {
    const phaseCards = cards.filter(card => {
      // Check if card has phase in tags or was created in that phase
      return card.tags?.some((tag: string) => tag.toUpperCase() === phase) ||
             card.session_id; // Placeholder - would need phase tracking
    });

    if (phaseCards.length > 0) {
      decks.push({
        id: `deck-${phase}`,
        name: `${phase} Phase Cards`,
        description: `Cards generated during the ${phase} phase`,
        cards: phaseCards,
        coverCard: phaseCards[0],
        rarity: calculateDeckRarity(phaseCards),
        phase
      });
    }
  });

  return decks;
};

export const groupCardsByCharacter = (cards: any[]): CardDeck[] => {
  const characters = ['Virgil', 'Zen', 'Prisma', 'Phoenix', 'Advisor', 'Toxic', 'Tech Priest', 'Ever Green'];
  const decks: CardDeck[] = [];

  characters.forEach(character => {
    const characterCards = cards.filter(card => 
      card.created_by_character === character || 
      card.contributing_characters?.includes(character)
    );

    if (characterCards.length > 0) {
      decks.push({
        id: `deck-${character.toLowerCase().replace(' ', '-')}`,
        name: `${character}'s Cards`,
        description: `Cards created or contributed to by ${character}`,
        cards: characterCards,
        coverCard: characterCards[0],
        rarity: calculateDeckRarity(characterCards)
      });
    }
  });

  return decks;
};

export const groupCardsByType = (cards: any[]): CardDeck[] => {
  const types = ['INSIGHT', 'STRATEGY', 'TACTIC', 'TOOL', 'RESEARCH', 'RESOURCE'];
  const decks: CardDeck[] = [];

  types.forEach(type => {
    const typeCards = cards.filter(card => card.card_type === type);

    if (typeCards.length > 0) {
      decks.push({
        id: `deck-${type.toLowerCase()}`,
        name: `${type} Cards`,
        description: `All ${type.toLowerCase()} cards in your collection`,
        cards: typeCards,
        coverCard: typeCards[0],
        rarity: calculateDeckRarity(typeCards)
      });
    }
  });

  return decks;
};

export const createCustomDeck = (
  name: string,
  description: string,
  cardIds: string[],
  allCards: any[]
): CardDeck => {
  const deckCards = allCards.filter(card => cardIds.includes(card.id));
  
  return {
    id: `deck-custom-${Date.now()}`,
    name,
    description,
    cards: deckCards,
    coverCard: deckCards[0],
    rarity: calculateDeckRarity(deckCards),
    createdAt: new Date()
  };
};

const calculateDeckRarity = (cards: any[]): 'mixed' | 'common' | 'rare' | 'epic' | 'legendary' => {
  if (cards.length === 0) return 'common';
  
  const rarities = cards.map(card => card.rarity?.toLowerCase());
  const uniqueRarities = new Set(rarities);
  
  if (uniqueRarities.size > 1) return 'mixed';
  
  const singleRarity = rarities[0];
  if (['common', 'rare', 'epic', 'legendary'].includes(singleRarity)) {
    return singleRarity as 'common' | 'rare' | 'epic' | 'legendary';
  }
  
  return 'common';
};

export const getDeckStats = (deck: CardDeck) => {
  return {
    totalCards: deck.cards.length,
    averageScore: deck.cards.reduce((sum, card) => sum + (card.average_score || 0), 0) / deck.cards.length,
    totalTimesUsed: deck.cards.reduce((sum, card) => sum + (card.times_used || 0), 0),
    rarityBreakdown: deck.cards.reduce((acc, card) => {
      const rarity = card.rarity?.toLowerCase() || 'common';
      acc[rarity] = (acc[rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};
