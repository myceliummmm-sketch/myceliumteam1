export interface CardGroup {
  id: string;
  title: string;
  description: string;
  cards: any[];
  coherenceScore: number;
  groupType: 'phase' | 'character' | 'tag' | 'event' | 'semantic' | 'custom';
  metadata?: {
    phase?: string;
    character?: string;
    tags?: string[];
    eventType?: string;
    color?: string;
  };
}

export interface GroupingStrategy {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const GROUPING_STRATEGIES: GroupingStrategy[] = [
  {
    id: 'phase',
    name: 'By Phase',
    description: 'Group cards by project development phase',
    icon: 'MapPin'
  },
  {
    id: 'character',
    name: 'By Character',
    description: 'Group by the AI advisor who created the card',
    icon: 'Users'
  },
  {
    id: 'tag',
    name: 'By Theme',
    description: 'Group by common tags and themes',
    icon: 'Tag'
  },
  {
    id: 'event',
    name: 'By Event',
    description: 'Group auto-generated cards by trigger event',
    icon: 'Zap'
  },
  {
    id: 'semantic',
    name: 'AI Smart Groups',
    description: 'AI-powered semantic clustering',
    icon: 'Sparkles'
  }
];

const PHASE_COLORS: Record<string, string> = {
  'VISION': '#8B5CF6',
  'RESEARCH': '#3B82F6',
  'PROTOTYPE': '#10B981',
  'BUILD': '#F59E0B',
  'GROW': '#EF4444'
};

const PHASE_NAMES: Record<string, string> = {
  'VISION': 'Vision',
  'RESEARCH': 'Research',
  'PROTOTYPE': 'Prototype',
  'BUILD': 'Build',
  'GROW': 'Growth'
};

export function groupCardsByPhase(cards: any[]): CardGroup[] {
  const phaseMap = new Map<string, any[]>();
  
  cards.forEach(card => {
    const phase = card.level <= 1 ? 'VISION' :
                  card.level <= 2 ? 'RESEARCH' :
                  card.level <= 3 ? 'PROTOTYPE' :
                  card.level <= 4 ? 'BUILD' : 'GROW';
    
    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, []);
    }
    phaseMap.get(phase)!.push(card);
  });

  return Array.from(phaseMap.entries()).map(([phase, phaseCards]) => ({
    id: `phase-${phase.toLowerCase()}`,
    title: PHASE_NAMES[phase] || phase,
    description: `Cards from the ${PHASE_NAMES[phase] || phase} phase`,
    cards: phaseCards,
    coherenceScore: 1.0,
    groupType: 'phase' as const,
    metadata: {
      phase,
      color: PHASE_COLORS[phase]
    }
  })).sort((a, b) => {
    const order = ['VISION', 'RESEARCH', 'PROTOTYPE', 'BUILD', 'GROW'];
    return order.indexOf(a.metadata?.phase || '') - order.indexOf(b.metadata?.phase || '');
  });
}

export function groupCardsByCharacter(cards: any[]): CardGroup[] {
  const characterMap = new Map<string, any[]>();
  
  cards.forEach(card => {
    const character = card.created_by_character || 'Unknown';
    if (!characterMap.has(character)) {
      characterMap.set(character, []);
    }
    characterMap.get(character)!.push(card);
  });

  return Array.from(characterMap.entries())
    .filter(([_, characterCards]) => characterCards.length > 0)
    .map(([character, characterCards]) => ({
      id: `character-${character.toLowerCase().replace(/\s+/g, '-')}`,
      title: character,
      description: `Cards created by ${character}`,
      cards: characterCards,
      coherenceScore: 0.9,
      groupType: 'character' as const,
      metadata: {
        character
      }
    }))
    .sort((a, b) => b.cards.length - a.cards.length);
}

export function groupCardsByTags(cards: any[]): CardGroup[] {
  const tagMap = new Map<string, any[]>();
  
  cards.forEach(card => {
    if (card.tags && Array.isArray(card.tags)) {
      card.tags.forEach((tag: string) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(card);
      });
    }
  });

  return Array.from(tagMap.entries())
    .filter(([_, tagCards]) => tagCards.length >= 2)
    .map(([tag, tagCards]) => ({
      id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
      title: tag,
      description: `Cards tagged with "${tag}"`,
      cards: tagCards,
      coherenceScore: 0.85,
      groupType: 'tag' as const,
      metadata: {
        tags: [tag]
      }
    }))
    .sort((a, b) => b.cards.length - a.cards.length);
}

export function groupCardsByEvent(cards: any[]): CardGroup[] {
  const eventMap = new Map<string, any[]>();
  
  cards.forEach(card => {
    if (card.triggered_by_event && card.auto_generated) {
      const event = card.triggered_by_event;
      if (!eventMap.has(event)) {
        eventMap.set(event, []);
      }
      eventMap.get(event)!.push(card);
    }
  });

  return Array.from(eventMap.entries())
    .filter(([_, eventCards]) => eventCards.length > 0)
    .map(([event, eventCards]) => ({
      id: `event-${event.toLowerCase().replace(/\s+/g, '-')}`,
      title: formatEventName(event),
      description: `Auto-generated cards from ${formatEventName(event)}`,
      cards: eventCards,
      coherenceScore: 0.95,
      groupType: 'event' as const,
      metadata: {
        eventType: event
      }
    }))
    .sort((a, b) => b.cards.length - a.cards.length);
}

function formatEventName(event: string): string {
  return event
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function calculateGroupCoherence(cards: any[]): number {
  if (cards.length <= 1) return 1.0;
  
  let score = 1.0;
  
  // Check phase consistency
  const phases = new Set(cards.map(c => c.level));
  if (phases.size === 1) score += 0.2;
  
  // Check character consistency
  const characters = new Set(cards.map(c => c.created_by_character).filter(Boolean));
  if (characters.size === 1) score += 0.15;
  
  // Check tag overlap
  const allTags = cards.flatMap(c => c.tags || []);
  const uniqueTags = new Set(allTags);
  const tagOverlap = allTags.length > 0 ? uniqueTags.size / allTags.length : 0;
  score += tagOverlap * 0.15;
  
  // Check rarity consistency
  const rarities = new Set(cards.map(c => c.rarity));
  if (rarities.size === 1) score += 0.1;
  
  return Math.min(score, 1.0);
}

export function mergeGroups(groups: CardGroup[]): CardGroup {
  const allCards = groups.flatMap(g => g.cards);
  const uniqueCards = Array.from(new Map(allCards.map(c => [c.id, c])).values());
  
  return {
    id: `merged-${Date.now()}`,
    title: 'Custom Selection',
    description: `${groups.length} groups merged (${uniqueCards.length} cards)`,
    cards: uniqueCards,
    coherenceScore: calculateGroupCoherence(uniqueCards),
    groupType: 'custom',
    metadata: {
      tags: Array.from(new Set(groups.flatMap(g => g.metadata?.tags || [])))
    }
  };
}

export function getRecommendedGroups(
  allGroups: CardGroup[],
  targetAudience: string,
  detailLevel: string
): CardGroup[] {
  const recommended: CardGroup[] = [];
  
  // Always recommend phase groups for comprehensive view
  if (detailLevel === 'comprehensive') {
    recommended.push(...allGroups.filter(g => g.groupType === 'phase'));
  }
  
  // For stakeholders, recommend high-level groups
  if (targetAudience === 'stakeholder') {
    recommended.push(...allGroups.filter(g => 
      g.groupType === 'phase' && ['VISION', 'GROW'].includes(g.metadata?.phase || '')
    ));
  }
  
  // For developers, recommend technical groups
  if (targetAudience === 'developer') {
    recommended.push(...allGroups.filter(g => 
      g.cards.some(c => c.card_type === 'CODE' || c.card_type === 'DESIGN')
    ));
  }
  
  // Recommend high-coherence groups
  recommended.push(...allGroups
    .filter(g => g.coherenceScore >= 0.9 && !recommended.includes(g))
    .slice(0, 3)
  );
  
  return Array.from(new Set(recommended));
}
