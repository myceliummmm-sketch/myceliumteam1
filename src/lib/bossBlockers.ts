import { Phase, ArtifactId } from '@/types/game';

export interface BossBlockerDefinition {
  id: string;
  name: string;
  description: string;
  lore: string;
  severity: 'high';
  triggerConditions: {
    minLevel?: number;
    phase?: Phase;
    taskCount?: number;
  };
  defeatConditions: {
    requiredActions: string[];
    estimatedTurns: number;
  };
  rewards: {
    xp: number;
    spores: number;
    artifactProgress: ArtifactId;
  };
}

export const BOSS_BLOCKERS: BossBlockerDefinition[] = [
  {
    id: 'research_block',
    name: 'The Research Block',
    description: 'A massive wall of uncertainty blocking your path to user insights',
    lore: 'This ancient barrier appears when founders fear talking to users. Only deep research can shatter it.',
    severity: 'high',
    
    triggerConditions: {
      minLevel: 8,
      phase: 'EXPLORE',
      taskCount: 3
    },
    
    defeatConditions: {
      requiredActions: [
        'Conduct 3 user interviews',
        'Analyze competitor landscape',
        'Define target user persona'
      ],
      estimatedTurns: 5
    },
    
    rewards: {
      xp: 200,
      spores: 50,
      artifactProgress: 'deepresearch'
    }
  },
  
  {
    id: 'technical_debt_demon',
    name: 'The Technical Debt Demon',
    description: 'A monstrous accumulation of shortcuts and hacks threatening your codebase',
    lore: 'Born from rushed decisions and "temporary" solutions, this demon grows stronger with each compromise.',
    severity: 'high',
    
    triggerConditions: {
      minLevel: 18,
      phase: 'FORGE'
    },
    
    defeatConditions: {
      requiredActions: [
        'Refactor critical systems',
        'Improve code health to 80%',
        'Write comprehensive tests'
      ],
      estimatedTurns: 7
    },
    
    rewards: {
      xp: 400,
      spores: 100,
      artifactProgress: 'product'
    }
  },
  
  {
    id: 'launch_anxiety_beast',
    name: 'The Launch Anxiety Beast',
    description: 'The paralyzing fear of putting your work out into the world',
    lore: 'Every creator faces this beast. It whispers doubts and amplifies fears. Only courage can banish it.',
    severity: 'high',
    
    triggerConditions: {
      minLevel: 28,
      phase: 'LAUNCH'
    },
    
    defeatConditions: {
      requiredActions: [
        'Complete pre-launch checklist',
        'Share product with 10 people',
        'Publish launch announcement'
      ],
      estimatedTurns: 6
    },
    
    rewards: {
      xp: 600,
      spores: 150,
      artifactProgress: 'marketing'
    }
  }
];
