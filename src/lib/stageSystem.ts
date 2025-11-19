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
  VISION: [
    { phase: 'VISION', stageNumber: 1, label: 'Problem Discovery', progressRange: [0, 25], actions: ['Define the core problem', 'Identify who faces this problem'], completionCriteria: ['problem_defined', 'target_users_identified'] },
    { phase: 'VISION', stageNumber: 2, label: 'Solution Concept', progressRange: [25, 50], actions: ['Sketch your solution idea', 'Name your product'], completionCriteria: ['solution_concept_defined', 'product_named'] },
    { phase: 'VISION', stageNumber: 3, label: 'Value Definition', progressRange: [50, 75], actions: ['Define unique value proposition', 'Identify competitive advantage'], completionCriteria: ['value_prop_clear', 'advantage_identified'] },
    { phase: 'VISION', stageNumber: 4, label: 'Vision Statement', progressRange: [75, 100], actions: ['Craft vision statement', 'Lock vision and proceed'], completionCriteria: ['vision_statement_complete', 'ready_for_research'] }
  ],
  RESEARCH: [
    { phase: 'RESEARCH', stageNumber: 1, label: 'User Profiling', progressRange: [0, 25], actions: ['Create detailed user personas', 'Map user pain points'], completionCriteria: ['personas_created', 'pain_points_mapped'] },
    { phase: 'RESEARCH', stageNumber: 2, label: 'Research Design', progressRange: [25, 50], actions: ['Design interview questions', 'Plan research approach'], completionCriteria: ['questions_prepared', 'approach_planned'] },
    { phase: 'RESEARCH', stageNumber: 3, label: 'User Interviews', progressRange: [50, 75], actions: ['Conduct user interviews', 'Gather qualitative data'], completionCriteria: ['interviews_conducted', 'data_collected'] },
    { phase: 'RESEARCH', stageNumber: 4, label: 'Insights Synthesis', progressRange: [75, 100], actions: ['Analyze findings', 'Document key insights'], completionCriteria: ['findings_analyzed', 'insights_documented'] }
  ],
  PROTOTYPE: [
    { phase: 'PROTOTYPE', stageNumber: 1, label: 'Information Architecture', progressRange: [0, 20], actions: ['Map user flows', 'Define feature hierarchy'], completionCriteria: ['flows_defined', 'features_prioritized'] },
    { phase: 'PROTOTYPE', stageNumber: 2, label: 'Wireframe Design', progressRange: [20, 40], actions: ['Create low-fi wireframes', 'Design core interactions'], completionCriteria: ['wireframes_complete', 'interactions_designed'] },
    { phase: 'PROTOTYPE', stageNumber: 3, label: 'High-Fi Prototype', progressRange: [40, 60], actions: ['Build clickable prototype', 'Apply visual design'], completionCriteria: ['prototype_built', 'design_applied'] },
    { phase: 'PROTOTYPE', stageNumber: 4, label: 'User Testing Setup', progressRange: [60, 80], actions: ['Recruit 5 test users', 'Prepare test scenarios'], completionCriteria: ['users_recruited', 'scenarios_ready'] },
    { phase: 'PROTOTYPE', stageNumber: 5, label: 'User Testing → 5 People', progressRange: [80, 100], actions: ['Test with 5 users', 'Document feedback & iterate'], completionCriteria: ['5_users_tested', 'feedback_synthesized'] }
  ],
  BUILD: [
    { phase: 'BUILD', stageNumber: 1, label: 'Technical Foundation', progressRange: [0, 25], actions: ['Setup tech stack', 'Build core architecture'], completionCriteria: ['stack_configured', 'architecture_built'] },
    { phase: 'BUILD', stageNumber: 2, label: 'Core Features', progressRange: [25, 50], actions: ['Develop main features', 'Integrate backend'], completionCriteria: ['features_developed', 'backend_integrated'] },
    { phase: 'BUILD', stageNumber: 3, label: 'Quality Assurance', progressRange: [50, 75], actions: ['Write tests', 'Fix critical bugs'], completionCriteria: ['tests_passing', 'bugs_resolved'] },
    { phase: 'BUILD', stageNumber: 4, label: 'Beta Release', progressRange: [75, 100], actions: ['Deploy beta version', 'Gather early user feedback'], completionCriteria: ['beta_deployed', 'feedback_collected'] }
  ],
  GROW: [
    { phase: 'GROW', stageNumber: 1, label: 'Launch Prep', progressRange: [0, 25], actions: ['Finalize marketing materials', 'Setup analytics'], completionCriteria: ['materials_ready', 'analytics_configured'] },
    { phase: 'GROW', stageNumber: 2, label: 'Public Launch', progressRange: [25, 50], actions: ['Launch to public', 'Announce on channels'], completionCriteria: ['launched_publicly', 'announced'] },
    { phase: 'GROW', stageNumber: 3, label: 'Growth Activation', progressRange: [50, 75], actions: ['Implement growth tactics', 'Track key metrics'], completionCriteria: ['tactics_active', 'metrics_tracked'] },
    { phase: 'GROW', stageNumber: 4, label: 'Scale & Optimize', progressRange: [75, 100], actions: ['Scale infrastructure', 'Optimize conversion'], completionCriteria: ['infrastructure_scaled', 'conversion_optimized'] }
  ]
};

export function getCurrentStage(phase: Phase, phaseProgress: number): StageDefinition {
  const stages = STAGE_DEFINITIONS[phase];
  if (!stages || !Array.isArray(stages)) {
    // Fallback for unknown phase - return VISION stage 1
    return STAGE_DEFINITIONS.VISION[0];
  }
  for (const stage of stages) {
    if (phaseProgress >= stage.progressRange[0] && phaseProgress < stage.progressRange[1]) return stage;
  }
  return stages[stages.length - 1];
}

export function getStageActions(phase: Phase, stageNumber: number, gameState: GameState): string[] {
  const stages = STAGE_DEFINITIONS[phase];
  const stage = stages.find(s => s.stageNumber === stageNumber);
  if (!stage) return [];
  const criticalBlockers = gameState.blockers.filter(b => b.severity === 'high' && !b.resolvedAt);
  if (criticalBlockers.length > 0) return [`URGENT: Resolve critical blocker "${criticalBlockers[0].description}"`, ...stage.actions.slice(0, 2)];
  if (gameState.energy < 20) return ['Take a break and regenerate energy', ...stage.actions];
  return stage.actions;
}

export function calculateStageProgress(phase: Phase, phaseProgress: number): number {
  const stage = getCurrentStage(phase, phaseProgress);
  const [min, max] = stage.progressRange;
  const stageSpan = max - min;
  const progressInStage = phaseProgress - min;
  return Math.min(100, Math.max(0, (progressInStage / stageSpan) * 100));
}

export function hasCompletedStage(currentProgress: number, previousProgress: number, stage: StageDefinition): boolean {
  const [, stageEnd] = stage.progressRange;
  return previousProgress < stageEnd && currentProgress >= stageEnd;
}

export function getCompletedStages(phase: Phase, currentProgress: number, previousProgress: number): StageDefinition[] {
  const stages = STAGE_DEFINITIONS[phase];
  return stages.filter(stage => hasCompletedStage(currentProgress, previousProgress, stage));
}
