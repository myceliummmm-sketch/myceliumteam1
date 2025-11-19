import { Phase } from '@/types/game';

export interface DailyChallenge {
  id: string;
  phase: Phase;
  stageNumber: number;
  challengeType: 'action' | 'milestone';
  challengeText: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  sporesReward: number;
  completed: boolean;
}

export const CHALLENGE_TEMPLATES: Record<Phase, Record<number, string[]>> = {
  VISION: {
    1: ['Define 3 specific user pain points', 'Describe your target user in detail'],
    2: ['Name your product and explain the meaning', 'Sketch 3 solution concepts'],
    3: ['Write your unique value proposition', 'List 3 competitive advantages'],
    4: ['Craft a compelling vision statement', 'Share your vision with someone']
  },
  RESEARCH: {
    1: ['Create 2 detailed user personas', 'Map 5 user pain points'],
    2: ['Write 10 interview questions', 'Identify 3 research channels'],
    3: ['Conduct 2 user interviews', 'Document 5 key insights'],
    4: ['Synthesize findings into 3 themes', 'Create insight presentation']
  },
  PROTOTYPE: {
    1: ['Map 3 core user flows', 'Prioritize top 5 features'],
    2: ['Sketch 5 key screens', 'Design 3 interaction patterns'],
    3: ['Build clickable prototype', 'Apply brand colors and fonts'],
    4: ['Recruit 5 test participants', 'Write 5 test scenarios'],
    5: ['Test with 5 people', 'Document 10+ pieces of feedback', 'Iterate based on feedback']
  },
  BUILD: {
    1: ['Choose tech stack', 'Setup dev environment'],
    2: ['Build 2 core features', 'Integrate authentication'],
    3: ['Write 5 tests', 'Fix 3 bugs'],
    4: ['Deploy beta version', 'Get 5 beta testers']
  },
  GROW: {
    1: ['Create launch checklist', 'Setup analytics'],
    2: ['Launch publicly', 'Post on 3 channels'],
    3: ['Implement 2 growth tactics', 'Track 5 key metrics'],
    4: ['Optimize 2 conversion points', 'Plan next sprint']
  }
};

export function generateDailyChallenges(
  phase: Phase, 
  stageNumber: number
): Pick<DailyChallenge, 'challengeText' | 'xpReward' | 'sporesReward' | 'targetCount'>[] {
  const templates = CHALLENGE_TEMPLATES[phase]?.[stageNumber] || [];
  
  // Pick 1-2 challenges randomly
  const selectedTemplates = templates
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(2, templates.length));
  
  return selectedTemplates.map(text => ({
    challengeText: text,
    xpReward: 50,
    sporesReward: 10,
    targetCount: 1
  }));
}
