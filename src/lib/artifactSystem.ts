import { GameState, Artifact, ArtifactId } from '@/types/game';
import { LEGENDARY_ARTIFACTS } from './artifacts';

export function checkArtifactUnlocks(
  gameState: any,
  bossBlockersDefeated: string[]
): ArtifactId[] {
  const unlockedArtifacts: ArtifactId[] = [];
  const currentArtifacts = gameState.artifacts || [];
  
  Object.values(LEGENDARY_ARTIFACTS).forEach(artifactDef => {
    // Check if already unlocked
    const alreadyUnlocked = currentArtifacts.some(
      (a: Artifact) => a.id === artifactDef.id && a.unlocked
    );
    if (alreadyUnlocked) return;
    
    // Check requirements
    const meetsLevel = (gameState.level || 1) >= artifactDef.requirements.minLevel;
    const meetsBossCount = bossBlockersDefeated.length >= artifactDef.requirements.bossBlockersDefeated;
    
    // Check milestones (simplified - check if we have enough milestones)
    const meetsMilestones = (gameState.milestones || []).length >= artifactDef.requirements.milestonesRequired.length;
    
    // Check phases completed (simplified - check if current phase is at or beyond required)
    const phaseOrder: any = { INCEPTION: 0, RESEARCH: 1, DESIGN: 2, BUILD: 3, TEST: 4, SHIP: 5 };
    const currentPhaseIndex = phaseOrder[gameState.current_phase] || 0;
    const requiredPhaseIndex = Math.max(
      ...artifactDef.requirements.phasesCompleted.map(p => phaseOrder[p] || 0)
    );
    const meetsPhases = currentPhaseIndex >= requiredPhaseIndex;
    
    if (meetsLevel && meetsBossCount && meetsMilestones && meetsPhases) {
      unlockedArtifacts.push(artifactDef.id);
    }
  });
  
  return unlockedArtifacts;
}

export function applyArtifactBonuses(
  unlockedArtifacts: Artifact[]
): {
  xpMultiplier: number;
  energyBonus: number;
  sporeMultiplier: number;
} {
  let xpMultiplier = 1;
  let energyBonus = 0;
  let sporeMultiplier = 1;
  
  unlockedArtifacts.forEach(artifact => {
    if (artifact.unlocked) {
      if (artifact.passiveBonuses.xpMultiplier) {
        xpMultiplier *= artifact.passiveBonuses.xpMultiplier;
      }
      if (artifact.passiveBonuses.energyRegenBonus) {
        energyBonus += artifact.passiveBonuses.energyRegenBonus;
      }
      if (artifact.passiveBonuses.sporeMultiplier) {
        sporeMultiplier *= artifact.passiveBonuses.sporeMultiplier;
      }
    }
  });
  
  return { xpMultiplier, energyBonus, sporeMultiplier };
}

export function createArtifactFromDefinition(
  artifactId: ArtifactId,
  unlocked: boolean = false
): Artifact {
  const def = LEGENDARY_ARTIFACTS[artifactId];
  return {
    ...def,
    unlocked,
    unlockedAt: unlocked ? new Date() : null
  };
}
