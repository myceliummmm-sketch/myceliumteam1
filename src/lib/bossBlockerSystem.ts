import { GameState, Blocker } from '@/types/game';
import { BOSS_BLOCKERS, BossBlockerDefinition } from './bossBlockers';

export function shouldSpawnBossBlocker(
  gameState: any,
  existingBlockers: Blocker[]
): BossBlockerDefinition | null {
  // Check each boss blocker to see if it should spawn
  for (const boss of BOSS_BLOCKERS) {
    // Check if this boss is already active
    const alreadyActive = existingBlockers.some(
      b => b.type === 'boss' && b.bossData?.name === boss.name
    );
    if (alreadyActive) continue;

    // Check if already defeated
    const alreadyDefeated = (gameState.boss_blockers_defeated || []).includes(boss.id);
    if (alreadyDefeated) continue;

    // Check trigger conditions
    const { minLevel, phase, taskCount } = boss.triggerConditions;
    
    const meetsLevel = !minLevel || (gameState.level || 1) >= minLevel;
    const meetsPhase = !phase || gameState.current_phase === phase;
    const meetsTaskCount = !taskCount || (gameState.completed_tasks || []).length >= taskCount;

    if (meetsLevel && meetsPhase && meetsTaskCount) {
      return boss;
    }
  }

  return null;
}

export function createBossBlocker(boss: BossBlockerDefinition): Blocker {
  return {
    id: crypto.randomUUID(),
    description: boss.description,
    severity: boss.severity,
    type: 'boss',
    bossData: {
      name: boss.name,
      lore: boss.lore,
      defeatReward: boss.rewards
    },
    createdAt: new Date()
  };
}

export function checkBossDefeat(
  blocker: Blocker,
  gameState: any
): boolean {
  if (blocker.type !== 'boss' || !blocker.bossData) return false;

  // Find the boss definition
  const bossDefinition = BOSS_BLOCKERS.find(
    b => b.name === blocker.bossData?.name
  );
  
  if (!bossDefinition) return false;

  // Check defeat conditions based on game state
  // This is a simplified check - in a real game, you'd track specific actions
  const { requiredActions } = bossDefinition.defeatConditions;
  
  // For now, we'll consider a boss defeated if certain thresholds are met
  // This will be refined when we add more detailed tracking
  const { level, code_health, completed_tasks, current_phase } = gameState;
  
  // Research Block: Defeated if completed enough research tasks
  if (bossDefinition.id === 'research_block') {
    const researchTasks = (completed_tasks || []).filter(
      (t: any) => t.phase === 'RESEARCH'
    ).length;
    return researchTasks >= 3;
  }
  
  // Technical Debt Demon: Defeated if code health is above 80%
  if (bossDefinition.id === 'technical_debt_demon') {
    return (code_health || 100) >= 80;
  }
  
  // Launch Anxiety Beast: Defeated if reached SHIP phase and completed tasks
  if (bossDefinition.id === 'launch_anxiety_beast') {
    return current_phase === 'SHIP' && (completed_tasks || []).length >= 15;
  }

  return false;
}

export function defeatBossBlocker(
  blocker: Blocker,
  gameState: any
): {
  updatedState: any;
  rewards: { xp: number; spores: number; artifact?: string };
} {
  if (!blocker.bossData) {
    return { updatedState: gameState, rewards: { xp: 0, spores: 0 } };
  }

  const rewards = blocker.bossData.defeatReward;
  const bossDefinition = BOSS_BLOCKERS.find(
    b => b.name === blocker.bossData?.name
  );

  const updatedState = {
    ...gameState,
    xp: (gameState.xp || 0) + rewards.xp,
    spores: (gameState.spores || 0) + rewards.spores,
    boss_blockers_defeated: [
      ...(gameState.boss_blockers_defeated || []),
      bossDefinition?.id || blocker.id
    ]
  };

  // Handle level up if needed
  const xpForLevel = updatedState.level * 100;
  if (updatedState.xp >= xpForLevel) {
    updatedState.level = (updatedState.level || 1) + 1;
    updatedState.xp -= xpForLevel;
  }

  return { updatedState, rewards };
}
