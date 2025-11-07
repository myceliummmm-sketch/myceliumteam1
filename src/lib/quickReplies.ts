import { GameState, QuickReplyButton, Phase } from '@/types/game';

// Calculate task completion progress
function calculateTaskProgress(state: GameState): { current: number; total: number; percentage: number } {
  const totalTasks = state.currentTasks.length;
  const completedTasks = state.currentTasks.filter(t => t.completed).length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return { current: completedTasks, total: totalTasks, percentage };
}

// Calculate XP progress to next level
function calculateXpProgress(state: GameState): { current: number; total: number; percentage: number } {
  const xpForLevel = state.level * 100;
  const percentage = Math.round((state.xp / xpForLevel) * 100);
  return { current: state.xp, total: xpForLevel, percentage };
}

// Calculate phase progress based on tasks and milestones
function calculatePhaseProgress(state: GameState): number {
  const phaseTasks = state.currentTasks.filter(t => t.phase === state.currentPhase);
  if (phaseTasks.length === 0) return 0;
  const completed = phaseTasks.filter(t => t.completed).length;
  return Math.round((completed / phaseTasks.length) * 100);
}

// Get urgency level based on blocker severity
function getBlockerUrgency(severity: 'low' | 'medium' | 'high'): 'low' | 'medium' | 'high' {
  return severity;
}

export function generateQuickReplies(state: GameState, aiSuggestedActions: string[] = []): QuickReplyButton[] {
  const replies: QuickReplyButton[] = [];
  
  // Priority 1: AI-suggested actions (these are the most contextual and helpful)
  if (aiSuggestedActions.length > 0) {
    // Take up to 3 AI suggestions
    replies.push(...aiSuggestedActions.slice(0, 3).map(text => ({
      text,
      category: 'ai-suggested' as const,
      icon: '✨'
    })));
  }
  
  // If we have 3+ suggestions from AI, we're done
  if (replies.length >= 3) {
    return replies.slice(0, 4); // Max 4 buttons
  }
  
  // Priority 2: Critical blockers (highest priority fallback)
  if (state.blockers.length > 0 && replies.length < 4) {
    const blocker = state.blockers[0];
    const urgencyIcon = blocker.severity === 'high' ? '🔥' : blocker.severity === 'medium' ? '⚠️' : '📋';
    const shortDesc = blocker.description.length > 30 
      ? blocker.description.slice(0, 30) + '...' 
      : blocker.description;
    replies.push({
      text: `Fix: ${shortDesc}`,
      category: 'blocker',
      urgency: getBlockerUrgency(blocker.severity),
      icon: urgencyIcon
    });
  }
  
  // Priority 3: Task completion with progress
  const taskProgress = calculateTaskProgress(state);
  if (state.currentTasks.length > 0 && !state.currentTasks[0].completed && replies.length < 4) {
    const task = state.currentTasks[0];
    const shortDesc = task.description.length > 25 
      ? task.description.slice(0, 25) + '...' 
      : task.description;
    replies.push({
      text: shortDesc,
      category: 'task',
      progress: taskProgress.total > 0 ? {
        current: taskProgress.current,
        total: taskProgress.total,
        percentage: taskProgress.percentage,
        type: 'tasks'
      } : undefined,
      icon: '✓'
    });
  }
  
  // Priority 4: XP progress (near level-up)
  const xpProgress = calculateXpProgress(state);
  if (xpProgress.percentage >= 80 && replies.length < 4) {
    replies.push({
      text: `Level up soon`,
      category: 'general',
      progress: {
        current: xpProgress.current,
        total: xpProgress.total,
        percentage: xpProgress.percentage,
        type: 'xp'
      },
      icon: '🎯'
    });
  }
  
  // Priority 5: Low energy warning
  if (state.energy < 5 && replies.length < 4) {
    replies.push({
      text: `Low energy (${state.energy}/10)`,
      category: 'energy',
      progress: {
        current: state.energy,
        total: 10,
        percentage: state.energy * 10,
        type: 'energy'
      },
      urgency: state.energy < 3 ? 'high' : 'medium',
      icon: '⚡'
    });
  }
  
  // Priority 6: Phase-specific suggestions with progress
  const phaseProgress = calculatePhaseProgress(state);
  if (replies.length < 4) {
    const phaseEmoji: Record<Phase, string> = {
      SPARK: '⚡',
      EXPLORE: '🗺️',
      CRAFT: '🎨',
      FORGE: '⚙️',
      POLISH: '✨',
      LAUNCH: '🚀'
    };
    
    const phaseAction: Record<Phase, string> = {
      SPARK: 'Ignite your idea',
      EXPLORE: 'Discover insights',
      CRAFT: 'Design the vision',
      FORGE: 'Build features',
      POLISH: 'Perfect & validate',
      LAUNCH: 'Release to world'
    };
    
    const hints = [
      `Focus on ${phaseAction[state.currentPhase].toLowerCase()}`,
      `${state.currentTasks.filter(t => !t.completed).length} task(s) remaining`,
      state.energy < 5 ? '⚠️ Low energy - consider taking a break' : '✓ Energy levels good',
      state.blockers.length > 0 ? `⚠️ ${state.blockers.length} blocker(s) need attention` : '✓ No active blockers',
      `Level ${state.level} • ${state.xp} XP`
    ];
    
    replies.push({
      text: `💡 ${phaseAction[state.currentPhase]} Tips`,
      category: 'phase',
      progress: phaseProgress > 0 ? {
        current: phaseProgress,
        total: 100,
        percentage: phaseProgress,
        type: 'phase'
      } : undefined,
      icon: phaseEmoji[state.currentPhase],
      isHint: true,
      hintContent: hints
    });
  }
  
  // Priority 7: General help option if still have room
  if (replies.length < 4) {
    replies.push({
      text: "What should I focus on?",
      category: 'general',
      icon: '💬'
    });
  }
  
  // Return max 4 buttons
  return replies.slice(0, 4);
}
