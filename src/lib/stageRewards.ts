import { Phase, StageReward } from '@/types/game';

export const STAGE_REWARDS: Record<Phase, Record<number, StageReward>> = {
  SPARK: {
    1: { xp: 50, spores: 10, message: 'Problem clearly articulated! Your vision is taking shape.' },
    2: { xp: 75, spores: 15, message: 'Solution hypothesis locked in! Direction is clear.' },
    3: { xp: 100, spores: 20, message: 'Value proposition defined! You know what makes this unique.' },
    4: { 
      xp: 150, 
      spores: 30, 
      message: 'Vision complete! Ready to explore and validate.',
      unlocks: { mode: 'user-research' }
    }
  },
  EXPLORE: {
    1: { xp: 75, spores: 15, message: 'User profiles created! You know who you\'re building for.' },
    2: { xp: 100, spores: 20, message: 'Research plan established! Ready to gather insights.' },
    3: { xp: 125, spores: 25, message: 'Data collected successfully! User insights unlocked.' },
    4: { 
      xp: 175, 
      spores: 35, 
      message: 'Insights synthesized! Ready to craft your solution.',
      unlocks: { mode: 'brainstorm' }
    }
  },
  CRAFT: {
    1: { xp: 100, spores: 20, message: 'Information architecture mapped! Structure is clear.' },
    2: { xp: 125, spores: 25, message: 'Wireframes complete! Visual foundation established.' },
    3: { xp: 150, spores: 30, message: 'Visual design applied! Your product has a face.' },
    4: { 
      xp: 200, 
      spores: 40, 
      message: 'Prototype ready! Time to forge the real thing.',
      unlocks: { mode: 'code-review' }
    }
  },
  FORGE: {
    1: { xp: 125, spores: 25, message: 'Architecture defined! Technical foundation solid.' },
    2: { xp: 150, spores: 30, message: 'Core features built! MVP is functional.' },
    3: { xp: 175, spores: 35, message: 'Integration complete! All systems connected.' },
    4: { 
      xp: 225, 
      spores: 45, 
      message: 'Feature complete! Ready for polish.',
      unlocks: { mode: 'debug' }
    }
  },
  POLISH: {
    1: { xp: 150, spores: 30, message: 'Testing complete! Bugs squashed.' },
    2: { xp: 175, spores: 35, message: 'Optimization done! Performance enhanced.' },
    3: { 
      xp: 200, 
      spores: 40, 
      message: 'Final polish applied! Ready to launch.',
      unlocks: { mode: 'sprint-planning' }
    },
    4: { xp: 250, spores: 50, message: 'Polish phase complete! Launch-ready.' }
  },
  LAUNCH: {
    1: { xp: 175, spores: 35, message: 'Pre-launch complete! Systems ready.' },
    2: { xp: 200, spores: 40, message: 'Deployment successful! You\'re live!' },
    3: { xp: 300, spores: 60, message: '🎊 Project Launched! Congratulations on shipping!' },
    4: { xp: 400, spores: 80, message: '🏆 Launch complete! You\'ve mastered the journey.' }
  }
};

export function getStageReward(phase: Phase, stageNumber: number): StageReward {
  return STAGE_REWARDS[phase]?.[stageNumber] || { 
    xp: 50, 
    spores: 10, 
    message: 'Stage complete! Keep building.' 
  };
}
