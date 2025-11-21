import { VisionTemplate } from './visionTemplates';

export interface VisionSubStageProgress {
  subStageNumber: 1 | 2 | 3 | 4;
  templateId: string | null;
  filledValues: Record<string, string>;
  cardId: string | null;
  completed: boolean;
  completedAt: Date | null;
}

export interface VisionFlowState {
  currentSubStage: 1 | 2 | 3 | 4;
  subStages: VisionSubStageProgress[];
  isSelectingTemplate: boolean;
  selectedTemplate: VisionTemplate | null;
  isDraftSaved: boolean;
}

export function createInitialVisionState(): VisionFlowState {
  return {
    currentSubStage: 1,
    subStages: [
      { subStageNumber: 1, templateId: null, filledValues: {}, cardId: null, completed: false, completedAt: null },
      { subStageNumber: 2, templateId: null, filledValues: {}, cardId: null, completed: false, completedAt: null },
      { subStageNumber: 3, templateId: null, filledValues: {}, cardId: null, completed: false, completedAt: null },
      { subStageNumber: 4, templateId: null, filledValues: {}, cardId: null, completed: false, completedAt: null }
    ],
    isSelectingTemplate: true,
    selectedTemplate: null,
    isDraftSaved: false
  };
}

export function calculateVisionProgress(subStages: VisionSubStageProgress[]): number {
  const completedCount = subStages.filter(s => s.completed).length;
  return (completedCount / 4) * 100;
}

export function getNextUncompletedSubStage(subStages: VisionSubStageProgress[]): 1 | 2 | 3 | 4 | null {
  const uncompleted = subStages.find(s => !s.completed);
  return uncompleted?.subStageNumber || null;
}

export function canProceedToNextSubStage(currentSubStage: VisionSubStageProgress): boolean {
  return currentSubStage.completed && currentSubStage.cardId !== null;
}
