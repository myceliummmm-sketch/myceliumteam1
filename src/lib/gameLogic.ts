import { GameState, GameEvent } from '@/types/game';

export function calculateXpProgress(xp: number, level: number): number {
  const xpForLevel = level * 100;
  return (xp / xpForLevel) * 100;
}

export function calculateLevelUp(currentXp: number, level: number): { leveledUp: boolean; newLevel: number; remainingXp: number } {
  const xpForLevel = level * 100;
  if (currentXp >= xpForLevel) {
    return {
      leveledUp: true,
      newLevel: level + 1,
      remainingXp: currentXp - xpForLevel
    };
  }
  return { leveledUp: false, newLevel: level, remainingXp: currentXp };
}

export function processXpGain(state: Partial<GameState>, amount: number): Partial<GameState> {
  const newXp = (state.xp || 0) + amount;
  const level = state.level || 1;
  const xpForLevel = level * 100;
  
  if (newXp >= xpForLevel) {
    return {
      ...state,
      xp: newXp - xpForLevel,
      level: level + 1
    };
  }
  
  return {
    ...state,
    xp: newXp
  };
}

export function processEnergyUpdate(state: Partial<GameState>, delta: number): Partial<GameState> {
  const newEnergy = Math.max(0, Math.min(10, (state.energy || 10) + delta));
  return {
    ...state,
    energy: newEnergy
  };
}

export function processCodeHealthUpdate(state: Partial<GameState>, delta: number): Partial<GameState> {
  const newHealth = Math.max(0, Math.min(100, (state.codeHealth || 100) + delta));
  return {
    ...state,
    codeHealth: newHealth
  };
}

export function applyGameEvent(state: Partial<GameState>, event: GameEvent): Partial<GameState> {
  let newState = { ...state };
  
  switch (event.type) {
    case 'XP_GAIN':
      newState = processXpGain(newState, event.data.amount);
      break;
    
    case 'ENERGY_UPDATE':
      newState = processEnergyUpdate(newState, event.data.delta);
      break;
    
    case 'CODE_HEALTH_UPDATE':
      newState = processCodeHealthUpdate(newState, event.data.delta);
      break;
    
    case 'PHASE_CHANGE':
      newState.currentPhase = event.data.newPhase;
      break;
    
    case 'STREAK_UPDATE':
      newState.streak = event.data.newStreak;
      break;
    
    case 'LEVEL_UP':
      // Already handled in XP_GAIN
      break;
    
    default:
      break;
  }
  
  return newState;
}
