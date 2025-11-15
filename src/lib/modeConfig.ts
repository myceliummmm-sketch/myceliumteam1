import { ConversationMode, Phase, ModeConfig } from '@/types/game';

export const MODE_CONFIGS: Record<ConversationMode, ModeConfig> = {
  'discussion': {
    id: 'discussion',
    name: 'Discussion',
    icon: '💬',
    description: 'Standard collaborative conversation',
  },
  'brainstorm': {
    id: 'brainstorm',
    name: 'Brainstorm',
    icon: '💡',
    description: 'Generate creative ideas and explore possibilities',
    unlockLevel: 2,
  },
  'prompt-prep': {
    id: 'prompt-prep',
    name: 'Prompt Prep',
    icon: '✍️',
    description: 'Craft effective prompts for AI tools',
    unlockLevel: 3,
  },
  'code-review': {
    id: 'code-review',
    name: 'Code Review',
    icon: '🔍',
    description: 'Systematic code analysis and improvements',
    unlockLevel: 5,
    unlockPhase: 'BUILD' as Phase,
  },
  'user-research': {
    id: 'user-research',
    name: 'User Research',
    icon: '👥',
    description: 'Design interviews and analyze feedback',
    unlockLevel: 4,
    unlockPhase: 'RESEARCH' as Phase,
  },
  'sprint-planning': {
    id: 'sprint-planning',
    name: 'Sprint Planning',
    icon: '📋',
    description: 'Break down features and estimate effort',
    unlockLevel: 6,
  },
  'debug': {
    id: 'debug',
    name: 'Debug',
    icon: '🐛',
    description: 'Systematic problem-solving and troubleshooting',
    unlockLevel: 7,
  },
  'retrospective': {
    id: 'retrospective',
    name: 'Retrospective',
    icon: '🔄',
    description: 'Reflect on progress and plan improvements',
    unlockLevel: 8,
  },
};

export function isModeUnlocked(
  mode: ConversationMode,
  level: number,
  phase: Phase,
  completedPhases: Phase[] = []
): boolean {
  const config = MODE_CONFIGS[mode];
  
  // Discussion is always unlocked
  if (mode === 'discussion') return true;
  
  // Check level requirement
  if (config.unlockLevel && level < config.unlockLevel) return false;
  
  // Check phase requirement
  if (config.unlockPhase && phase !== config.unlockPhase && !completedPhases.includes(config.unlockPhase)) {
    return false;
  }
  
  return true;
}

export function getUnlockMessage(mode: ConversationMode): string {
  const config = MODE_CONFIGS[mode];
  const requirements: string[] = [];
  
  if (config.unlockLevel) {
    requirements.push(`Level ${config.unlockLevel}`);
  }
  
  if (config.unlockPhase) {
    requirements.push(`${config.unlockPhase} phase`);
  }
  
  return `Unlocks at ${requirements.join(' or ')}`;
}
