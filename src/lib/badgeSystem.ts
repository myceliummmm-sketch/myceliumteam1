export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocksAt: number;
  color: string;
  rarity: 'common' | 'rare' | 'legendary';
  xpReward: number;
}

export const BADGES: Record<string, Badge> = {
  VISION_MASTER: {
    id: 'vision-master',
    name: 'Vision Master',
    description: 'Completed all 4 VISION stages',
    icon: '🎯',
    unlocksAt: 4,
    color: 'hsl(var(--chart-1))',
    rarity: 'common',
    xpReward: 200
  },
  HALFWAY_HERO: {
    id: 'halfway-hero',
    name: 'Halfway Hero',
    description: 'Completed 12 of 24 stages',
    icon: '⚡',
    unlocksAt: 12,
    color: 'hsl(var(--chart-2))',
    rarity: 'rare',
    xpReward: 500
  },
  JOURNEY_COMPLETE: {
    id: 'journey-complete',
    name: 'Journey Complete',
    description: 'Completed all 24 stages',
    icon: '👑',
    unlocksAt: 24,
    color: 'hsl(var(--primary))',
    rarity: 'legendary',
    xpReward: 1000
  }
};

export const getBadgeByMilestone = (completedCount: number): Badge | null => {
  return Object.values(BADGES).find(badge => badge.unlocksAt === completedCount) || null;
};

export const getRarityColor = (rarity: Badge['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'hsl(var(--chart-1))';
    case 'rare':
      return 'hsl(var(--chart-2))';
    case 'legendary':
      return 'hsl(var(--primary))';
    default:
      return 'hsl(var(--muted))';
  }
};
