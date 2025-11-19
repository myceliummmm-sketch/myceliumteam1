import { Phase, StageReward } from '@/types/game';

export const STAGE_REWARDS: Record<Phase, Record<number, StageReward>> = {
  VISION: {
    1: { xp: 50, spores: 10, message: 'Problem discovered!' },
    2: { xp: 75, spores: 15, message: 'Solution concept locked!' },
    3: { xp: 100, spores: 20, message: 'Value defined!' },
    4: { xp: 150, spores: 30, message: 'Vision complete!', unlocks: { mode: 'user-research' } }
  },
  RESEARCH: {
    1: { xp: 75, spores: 15, message: 'User profiles created!' },
    2: { xp: 100, spores: 20, message: 'Research designed!' },
    3: { xp: 125, spores: 25, message: 'Interviews done!' },
    4: { xp: 175, spores: 35, message: 'Insights synthesized!', unlocks: { mode: 'brainstorm' } }
  },
  PROTOTYPE: {
    1: { xp: 100, spores: 20, message: 'Architecture mapped!' },
    2: { xp: 125, spores: 25, message: 'Wireframes complete!' },
    3: { xp: 150, spores: 30, message: 'High-fi prototype built!' },
    4: { xp: 175, spores: 35, message: 'Test setup complete!' },
    5: { xp: 250, spores: 50, message: '🎉 User testing with 5 people complete!', unlocks: { mode: 'code-review' } }
  },
  BUILD: {
    1: { xp: 125, spores: 25, message: 'Foundation built!' },
    2: { xp: 150, spores: 30, message: 'Core features developed!' },
    3: { xp: 175, spores: 35, message: 'Quality assured!' },
    4: { xp: 225, spores: 45, message: 'Beta released!', unlocks: { mode: 'debug' } }
  },
  GROW: {
    1: { xp: 150, spores: 30, message: 'Launch prep complete!' },
    2: { xp: 200, spores: 40, message: '🚀 Public launch!', unlocks: { mode: 'sprint-planning' } },
    3: { xp: 250, spores: 50, message: 'Growth activated!' },
    4: { xp: 400, spores: 80, message: '🏆 Scaled and optimized!' }
  }
};

export function getStageReward(phase: Phase, stageNumber: number): StageReward {
  return STAGE_REWARDS[phase]?.[stageNumber] || { xp: 50, spores: 10, message: 'Stage complete!' };
}
