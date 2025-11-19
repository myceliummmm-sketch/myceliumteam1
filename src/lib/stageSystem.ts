import { Phase, GameState } from '@/types/game';

export interface StageDefinition {
  phase: Phase;
  stageNumber: number;
  label: string;
  progressRange: [number, number];
  actions: string[];
  completionCriteria: string[];
}

export const STAGE_DEFINITIONS: Record<Phase, StageDefinition[]> = {
  SPARK: [
    {
      phase: 'SPARK',
      stageNumber: 1,
      label: 'Problem Articulation',
      progressRange: [0, 25],
      actions: [
        'Define the core problem',
        'Describe who suffers from this'
      ],
      completionCriteria: ['problem_defined', 'target_user_identified']
    },
    {
      phase: 'SPARK',
      stageNumber: 2,
      label: 'Solution Hypothesis',
      progressRange: [25, 50],
      actions: [
        'Sketch your solution approach',
        'Name your product'
      ],
      completionCriteria: ['solution_outlined', 'product_named']
    },
    {
      phase: 'SPARK',
      stageNumber: 3,
      label: 'Value Proposition',
      progressRange: [50, 75],
      actions: [
        'Articulate the unique value',
        'Identify your competitive edge'
      ],
      completionCriteria: ['value_prop_defined', 'differentiation_clear']
    },
    {
      phase: 'SPARK',
      stageNumber: 4,
      label: 'Vision Lock',
      progressRange: [75, 100],
      actions: [
        'Lock your vision statement',
        'Move to EXPLORE phase'
      ],
      completionCriteria: ['vision_locked', 'ready_for_explore']
    }
  ],
  EXPLORE: [
    {
      phase: 'EXPLORE',
      stageNumber: 1,
      label: 'User Profiling',
      progressRange: [0, 25],
      actions: [
        'Create user personas',
        'Map user journey'
      ],
      completionCriteria: ['personas_created', 'journey_mapped']
    },
    {
      phase: 'EXPLORE',
      stageNumber: 2,
      label: 'Research Planning',
      progressRange: [25, 50],
      actions: [
        'Design interview questions',
        'Identify research channels'
      ],
      completionCriteria: ['questions_ready', 'channels_identified']
    },
    {
      phase: 'EXPLORE',
      stageNumber: 3,
      label: 'Data Collection',
      progressRange: [50, 75],
      actions: [
        'Conduct user interviews',
        'Gather market data'
      ],
      completionCriteria: ['interviews_done', 'data_collected']
    },
    {
      phase: 'EXPLORE',
      stageNumber: 4,
      label: 'Insight Synthesis',
      progressRange: [75, 100],
      actions: [
        'Synthesize key learnings',
        'Move to CRAFT phase'
      ],
      completionCriteria: ['insights_synthesized', 'ready_for_craft']
    }
  ],
  CRAFT: [
    {
      phase: 'CRAFT',
      stageNumber: 1,
      label: 'Information Architecture',
      progressRange: [0, 25],
      actions: [
        'Map user flows',
        'Define feature hierarchy'
      ],
      completionCriteria: ['flows_mapped', 'hierarchy_defined']
    },
    {
      phase: 'CRAFT',
      stageNumber: 2,
      label: 'Wireframing',
      progressRange: [25, 50],
      actions: [
        'Sketch core screens',
        'Design interaction patterns'
      ],
      completionCriteria: ['screens_sketched', 'interactions_defined']
    },
    {
      phase: 'CRAFT',
      stageNumber: 3,
      label: 'Visual Design',
      progressRange: [50, 75],
      actions: [
        'Apply visual identity',
        'Create design system'
      ],
      completionCriteria: ['visual_applied', 'system_created']
    },
    {
      phase: 'CRAFT',
      stageNumber: 4,
      label: 'Prototype',
      progressRange: [75, 100],
      actions: [
        'Build clickable prototype',
        'Move to FORGE phase'
      ],
      completionCriteria: ['prototype_ready', 'ready_for_forge']
    }
  ],
  FORGE: [
    {
      phase: 'FORGE',
      stageNumber: 1,
      label: 'Architecture',
      progressRange: [0, 25],
      actions: [
        'Define tech stack',
        'Set up infrastructure'
      ],
      completionCriteria: ['stack_defined', 'infra_ready']
    },
    {
      phase: 'FORGE',
      stageNumber: 2,
      label: 'Core Features',
      progressRange: [25, 50],
      actions: [
        'Build MVP features',
        'Implement auth & data'
      ],
      completionCriteria: ['mvp_features_built', 'auth_implemented']
    },
    {
      phase: 'FORGE',
      stageNumber: 3,
      label: 'Integration',
      progressRange: [50, 75],
      actions: [
        'Connect frontend & backend',
        'Add external APIs'
      ],
      completionCriteria: ['integration_complete', 'apis_connected']
    },
    {
      phase: 'FORGE',
      stageNumber: 4,
      label: 'Feature Complete',
      progressRange: [75, 100],
      actions: [
        'Finish remaining features',
        'Move to POLISH phase'
      ],
      completionCriteria: ['features_complete', 'ready_for_polish']
    }
  ],
  POLISH: [
    {
      phase: 'POLISH',
      stageNumber: 1,
      label: 'Testing',
      progressRange: [0, 33],
      actions: [
        'Run QA test suite',
        'Fix critical bugs'
      ],
      completionCriteria: ['qa_complete', 'bugs_fixed']
    },
    {
      phase: 'POLISH',
      stageNumber: 2,
      label: 'Optimization',
      progressRange: [33, 66],
      actions: [
        'Optimize performance',
        'Improve code health'
      ],
      completionCriteria: ['performance_optimized', 'code_health_good']
    },
    {
      phase: 'POLISH',
      stageNumber: 3,
      label: 'Final Polish',
      progressRange: [66, 100],
      actions: [
        'Review UX friction',
        'Move to LAUNCH phase'
      ],
      completionCriteria: ['ux_polished', 'ready_for_launch']
    }
  ],
  LAUNCH: [
    {
      phase: 'LAUNCH',
      stageNumber: 1,
      label: 'Pre-Launch',
      progressRange: [0, 33],
      actions: [
        'Complete launch checklist',
        'Set up monitoring'
      ],
      completionCriteria: ['checklist_complete', 'monitoring_ready']
    },
    {
      phase: 'LAUNCH',
      stageNumber: 2,
      label: 'Deployment',
      progressRange: [33, 66],
      actions: [
        'Deploy to production',
        'Publish announcement'
      ],
      completionCriteria: ['deployed', 'announced']
    },
    {
      phase: 'LAUNCH',
      stageNumber: 3,
      label: 'Post-Launch',
      progressRange: [66, 100],
      actions: [
        'Monitor first users',
        'Gather feedback'
      ],
      completionCriteria: ['monitoring_active', 'feedback_collected']
    }
  ]
};

export function getCurrentStage(
  phase: Phase, 
  phaseProgress: number
): StageDefinition {
  const stages = STAGE_DEFINITIONS[phase];
  const currentStage = stages.find(s => 
    phaseProgress >= s.progressRange[0] && 
    phaseProgress <= s.progressRange[1]
  );
  return currentStage || stages[0];
}

export function getStageActions(
  phase: Phase,
  stageNumber: number,
  gameState: GameState
): string[] {
  const stages = STAGE_DEFINITIONS[phase];
  const stage = stages.find(s => s.stageNumber === stageNumber);
  if (!stage) return [];
  
  let actions = [...stage.actions];
  
  // Context-aware overrides: critical blocker takes priority
  const criticalBlocker = gameState.blockers.find(b => b.severity === 'high');
  if (criticalBlocker) {
    const shortDesc = criticalBlocker.description.length > 25 
      ? criticalBlocker.description.slice(0, 25) + '...'
      : criticalBlocker.description;
    actions[2] = `Fix: ${shortDesc}`;
  }
  
  // Low energy warning
  if (gameState.energy < 3 && !criticalBlocker) {
    actions[2] = 'Restore energy';
  }
  
  return actions.slice(0, 3);
}

export function calculateStageProgress(
  phase: Phase,
  phaseProgress: number
): number {
  const currentStage = getCurrentStage(phase, phaseProgress);
  const [rangeStart, rangeEnd] = currentStage.progressRange;
  const rangeSize = rangeEnd - rangeStart;
  const progressInStage = phaseProgress - rangeStart;
  return Math.round((progressInStage / rangeSize) * 100);
}
