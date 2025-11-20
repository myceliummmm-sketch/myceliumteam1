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
    const aiReplies: QuickReplyButton[] = aiSuggestedActions.slice(0, 3).map((text, idx) => ({
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
    
    // Always add help button as 4th button
    aiReplies.push({
      text: '❓ What should I focus on?',
      category: 'general',
      icon: '🤔'
    });
    
    return aiReplies;
  }
  
  // Priority 2: Stage-driven actions (Swiss clock precision)
  const stageActions = getStageActions(
    state.currentPhase,
    currentStage.stageNumber,
    state
  );
  
  const replies: QuickReplyButton[] = [];
  
  // 1. Primary stage action (always)
  replies.push({
    text: stageActions[0],
    category: 'phase',
    icon: '🎯',
    progress: {
      current: Math.round(stageProgress),
      total: 100,
      percentage: Math.round(stageProgress),
      type: 'phase'
    }
  });
  
  // 2. Secondary stage action (always)
  replies.push({
    text: stageActions[1] || "Continue working",
    category: 'phase',
    icon: '📍'
  });
  
  // 3. Context-aware action (dynamic)
  const criticalBlockers = state.blockers?.filter(b => b.severity === 'high') || [];
  
  if (criticalBlockers.length > 0) {
    replies.push({
      text: `Fix: ${criticalBlockers[0].description.slice(0, 30)}...`,
      category: 'blocker',
      urgency: 'high',
      icon: '🚨'
    });
  } else if (state.energy < 3) {
    replies.push({
      text: 'Take a break (restore energy)',
      category: 'energy',
      urgency: 'high',
      icon: '⚡'
    });
  } else {
    replies.push({
      text: stageActions[2] || "Explore alternatives",
      category: 'general',
      icon: '💡'
    });
  }
  
  // 4. Help/Guidance button (ALWAYS available)
  replies.push({
    text: '❓ What should I focus on?',
    category: 'general',
    icon: '🤔'
  });
  
  return replies; // Always 4 buttons
}
