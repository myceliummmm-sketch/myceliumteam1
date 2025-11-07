import { GameState } from '@/types/game';

export function generateQuickReplies(state: GameState, aiSuggestedActions: string[] = []): string[] {
  const replies: string[] = [];
  
  // Priority 1: AI-suggested actions (these are the most contextual and helpful)
  if (aiSuggestedActions.length > 0) {
    // Take up to 3 AI suggestions
    replies.push(...aiSuggestedActions.slice(0, 3));
  }
  
  // If we have 3+ suggestions from AI, we're done
  if (replies.length >= 3) {
    return replies.slice(0, 4); // Max 4 buttons
  }
  
  // Priority 2: Context-aware suggestions based on current state (fallbacks)
  
  // If low energy, suggest energy management
  if (state.energy < 5) {
    replies.push("How do I restore energy?");
  }
  
  // If there are blockers, suggest help
  if (state.blockers.length > 0) {
    const blocker = state.blockers[0];
    const shortDesc = blocker.description.length > 35 
      ? blocker.description.slice(0, 35) + '...' 
      : blocker.description;
    replies.push(`Help: ${shortDesc}`);
  }
  
  // If there are tasks, suggest working on them
  if (state.currentTasks.length > 0) {
    const task = state.currentTasks[0];
    const shortDesc = task.description.length > 35 
      ? task.description.slice(0, 35) + '...' 
      : task.description;
    replies.push(`Work on: ${shortDesc}`);
  }
  
  // Phase-specific suggestions
  switch (state.currentPhase) {
    case 'INCEPTION':
      if (replies.length < 3) replies.push("Refine my project idea");
      break;
    case 'RESEARCH':
      if (replies.length < 3) replies.push("What research should I do?");
      break;
    case 'DESIGN':
      if (replies.length < 3) replies.push("Review my design approach");
      break;
    case 'BUILD':
      if (replies.length < 3) replies.push("Review code architecture");
      break;
    case 'TEST':
      if (replies.length < 3) replies.push("What testing strategy?");
      break;
    case 'SHIP':
      if (replies.length < 3) replies.push("Ready to ship!");
      break;
  }
  
  // Priority 3: Always include one general help option if we have room
  if (replies.length < 4) {
    replies.push("What should I focus on?");
  }
  
  // Return max 4 buttons
  return replies.slice(0, 4);
}
