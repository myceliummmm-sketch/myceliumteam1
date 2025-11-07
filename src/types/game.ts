export type Phase = 'INCEPTION' | 'RESEARCH' | 'DESIGN' | 'BUILD' | 'TEST' | 'SHIP';
export type TeamMember = 'ever' | 'prisma' | 'toxic' | 'phoenix' | 'techpriest' | 'virgil' | 'zen';
export type Mood = 'happy' | 'neutral' | 'stressed' | 'excited';
export type MessageRole = 'user' | 'assistant' | 'system';
export type ArtifactId = 'deepresearch' | 'product' | 'marketing';
export type BlockerType = 'normal' | 'boss';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  xpReward: number;
  phase: Phase;
}

export interface Blocker {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  type: BlockerType;
  bossData?: {
    name: string;
    lore: string;
    defeatReward: {
      xp: number;
      spores: number;
      artifact?: ArtifactId;
    };
  };
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  phase: Phase;
  unlockedAt: Date;
}

export interface Artifact {
  id: ArtifactId;
  name: string;
  description: string;
  lore: string;
  phase: Phase;
  unlocked: boolean;
  unlockedAt: Date | null;
  
  requirements: {
    minLevel: number;
    bossBlockersDefeated: number;
    milestonesRequired: string[];
    phasesCompleted: Phase[];
  };
  
  passiveBonuses: {
    xpMultiplier?: number;
    energyRegenBonus?: number;
    sporeMultiplier?: number;
  };
  
  unlocks: {
    newAdvisor?: TeamMember;
    specialQuickReplies?: string[];
    featureUnlock?: string;
  };
  
  prompt: {
    title: string;
    template: string;
    usageInstructions: string;
  };
}

export interface MessageSegment {
  type: 'speech' | 'narration' | 'ascii';
  speaker?: TeamMember;
  content: string;
}

export interface GameEvent {
  type: 'XP_GAIN' | 'SPORES_GAIN' | 'ENERGY_UPDATE' | 'LEVEL_UP' | 
        'PHASE_CHANGE' | 'TASK_COMPLETE' | 'TASK_ADDED' | 'STREAK_UPDATE' | 
        'CODE_HEALTH_UPDATE' | 'BLOCKER_ADDED' | 'BLOCKER_RESOLVED' | 
        'MILESTONE_UNLOCKED' | 'ARTIFACT_UNLOCKED';
  data: any;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  segments: MessageSegment[];
  gameEvents: GameEvent[];
  createdAt: Date;
}

export interface GameState {
  // Player stats
  xp: number;
  level: number;
  spores: number;
  energy: number;
  streak: number;
  codeHealth: number;
  
  // Progress
  currentPhase: Phase;
  completedTasks: Task[];
  currentTasks: Task[];
  blockers: Blocker[];
  milestones: Milestone[];
  
  // Artifacts system
  artifacts: Artifact[];
  bossBlockersDefeated: string[];
  artifactBonuses: {
    xpMultiplier: number;
    energyBonus: number;
    sporeMultiplier: number;
  };
  
  // Team state
  activeSpeaker: TeamMember | null;
  teamMood: Record<TeamMember, Mood>;
  
  // Chat
  messages: ChatMessage[];
  quickReplies: string[];
  
  // Session
  sessionId: string | null;
  isLoading: boolean;
  lastSaved: Date | null;
  
  // Energy system
  lastEnergyUpdate: Date | null;
  
  // Tutorial system
  showTutorial: boolean;
  tutorialStep: number | null;
  hasCompletedTutorial: boolean;
  
  // UI State
  showLevelUpModal: boolean;
  levelUpRewards: {
    spores: number;
    milestone?: string;
  };
  showArtifactUnlockModal: boolean;
  unlockedArtifact: Artifact | null;
}
