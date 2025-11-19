import { GameState, QuickReplyButton } from '@/types/game';
import { getCurrentStage, getStageActions, calculateStageProgress } from './stageSystem';
import { getStageTip } from './stageTips';

// Calculate phase progress based on tasks and milestones
export function calculatePhaseProgress(state: GameState): number {
  const phaseTasks = state.currentTasks.filter(t => t.phase === state.currentPhase);
  if (phaseTasks.length === 0) return 0;
  const completed = phaseTasks.filter(t => t.completed).length;
  return Math.round((completed / phaseTasks.length) * 100);
}

export function generateQuickReplies(state: GameState, aiSuggestedActions: string[] = []): QuickReplyButton[] {
  // Calculate phase progress
  const phaseProgress = calculatePhaseProgress(state);
  
  // Get current stage
  const currentStage = getCurrentStage(state.currentPhase, phaseProgress);
  const stageProgress = calculateStageProgress(state.currentPhase, phaseProgress);
  
  // Priority 1: AI-suggested actions override if present and relevant
  if (aiSuggestedActions.length > 0) {
    return aiSuggestedActions.slice(0, 3).map((text, idx) => ({
      text,
      category: 'ai-suggested' as const,
      icon: idx === 0 ? '🎯' : '✨',
      progress: idx === 0 ? {
        current: Math.round(stageProgress),
        total: 100,
        percentage: Math.round(stageProgress),
        type: 'phase' as const
      } : undefined
    }));
  }
  
  // Priority 2: Stage-driven actions (Swiss clock precision)
  const stageActions = getStageActions(
    state.currentPhase,
    currentStage.stageNumber,
    state
  );
  
  const replies: QuickReplyButton[] = stageActions.map((text, idx) => ({
    text,
    category: 'phase' as const,
    icon: idx === 0 ? '🎯' : idx === 1 ? '📍' : '💡',
    progress: idx === 0 ? {
      current: Math.round(stageProgress),
      total: 100,
      percentage: Math.round(stageProgress),
      type: 'phase' as const
    } : undefined
  }));
  
  // Add hint button if user is stuck in stage (>5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  if (state.currentStageEnteredAt && new Date(state.currentStageEnteredAt) < fiveMinutesAgo) {
    const tip = getStageTip(state.currentPhase, currentStage.stageNumber);
    if (tip) {
      replies.push({
        text: `💡 Need a hint?`,
        category: 'general',
        isHint: true,
        hintContent: tip.tips,
        icon: '💡'
      });
    }
  }
  
  return replies.slice(0, 4); // Max 4 buttons (3 actions + 1 hint)
}
