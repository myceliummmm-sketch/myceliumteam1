export type Phase = 'VISION' | 'RESEARCH' | 'PROTOTYPE' | 'BUILD' | 'GROW';
export type TeamMember = 'ever' | 'prisma' | 'toxic' | 'phoenix' | 'techpriest' | 'virgil' | 'zen';
export type Mood = 'happy' | 'neutral' | 'stressed' | 'excited';
export type MessageRole = 'user' | 'assistant' | 'system';
export type ArtifactId = 'deepresearch' | 'product' | 'marketing';
export type BlockerType = 'normal' | 'boss';
export type QuickReplyCategory = 'ai-suggested' | 'task' | 'blocker' | 'phase' | 'energy' | 'general';
export type QuickReplyUrgency = 'low' | 'medium' | 'high';
export type ConversationMode = 'discussion' | 'brainstorm' | 'prompt-prep' | 'code-review' | 'user-research' | 'sprint-planning' | 'debug' | 'retrospective';
export type PromptCategory = 'product' | 'technical' | 'research' | 'marketing' | 'design' | 'general';
export type ResponseDepth = 'brief' | 'normal' | 'detailed';

export interface ModeConfig {
  id: ConversationMode;
  name: string;
  icon: string;
  description: string;
  unlockLevel?: number;
  unlockPhase?: Phase;
}

export interface QuickReplyButton {
  text: string;
  category: QuickReplyCategory;
  progress?: {
    current: number;
    total: number;
    percentage: number;
    type: 'tasks' | 'xp' | 'phase' | 'energy';
  };
  urgency?: QuickReplyUrgency;
  icon?: string;
  isHint?: boolean;
  hintContent?: string[];
}

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

export interface LevelMetadata {
  level: number;
  phase: Phase;
  emoji: string;
  totalStages: number;
  description: string;
}

export const LEVEL_METADATA: Record<Phase, LevelMetadata> = {
  VISION: { level: 1, phase: 'VISION', emoji: '📊', totalStages: 4, description: 'Define your product vision' },
  RESEARCH: { level: 2, phase: 'RESEARCH', emoji: '🔍', totalStages: 4, description: 'Validate with users' },
  PROTOTYPE: { level: 3, phase: 'PROTOTYPE', emoji: '🎨', totalStages: 5, description: 'Design & test with users' },
  BUILD: { level: 4, phase: 'BUILD', emoji: '🏗️', totalStages: 4, description: 'Develop the product' },
  GROW: { level: 5, phase: 'GROW', emoji: '🚀', totalStages: 4, description: 'Launch & scale' }
};

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
        'MILESTONE_UNLOCKED' | 'ARTIFACT_UNLOCKED' | 'MODE_UNLOCKED' | 
        'PROMPT_CREATED' | 'PROMPT_UPDATED';
  data: any;
}

export interface Prompt {
  id: string;
  player_id: string;
  title: string;
  description?: string;
  category: PromptCategory;
  phase?: Phase;
  version: number;
  parent_prompt_id?: string;
  is_template: boolean;
  prompt_text: string;
  prompt_variables: string[];
  created_by_character?: string;
  contributing_characters?: string[];
  times_used: number;
  last_used_at?: string;
  effectiveness_rating?: number;
  tags?: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  segments: MessageSegment[];
  gameEvents: GameEvent[];
  createdAt: Date;
}

export interface PhaseStage {
  phase: Phase;
  stageNumber: number;
  stageProgress: number;
  stageLabel: string;
}

export interface StageCompletion {
  id: string;
  player_id: string;
  session_id: string;
  phase: string;
  stage_number: number;
  stage_label: string;
  completed_at: string;
  xp_earned: number | null;
  tasks_completed: number | null;
  time_spent_seconds: number | null;
}

export interface StageReward {
  xp: number;
  spores: number;
  message: string;
  unlocks?: {
    mode?: ConversationMode;
    feature?: string;
  };
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
  phaseStage?: PhaseStage;
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
  selectedSpeakers: string[];
  teamPanelMode: 'info' | 'select';
  teamMood: Record<TeamMember, Mood>;
  
  // Chat
  messages: ChatMessage[];
  quickReplies: QuickReplyButton[];
  aiSuggestedActions: string[];
  
  // Session
  sessionId: string | null;
  projectName: string | null;
  projectDescription: string | null;
  projectColor: string;
  projectIcon: string;
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
  
  // Conversation modes
  conversationMode: ConversationMode;
  unlockedModes: ConversationMode[];
  
  // Prompt library
  showPromptLibrary: boolean;
  selectedPrompt: any | null;
  showPromptDetailModal: boolean;
  
  // Card system
  showCardPackModal: boolean;
  cardPackToOpen: any[] | null;
  
  // Personality assessment
  showPersonalityAssessment: boolean;
  
  // Panel collapse state
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  cardCollectionCollapsed: boolean;
  
  // Dev mode
  devMode: boolean;
  responseDepth: ResponseDepth;
  
  // Pro Mode toggle
  proMode: boolean;
  
  // Stage progression
  stageHistory: StageCompletion[];
  showStageCompletionModal: boolean;
  completedStage: any | null;
  stageRewards: StageReward | null;
  lastStageTransition: Date | null;
  previousPhaseProgress: number;
  currentStageEnteredAt: Date | null;
}
