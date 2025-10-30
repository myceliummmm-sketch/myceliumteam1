export type Phase = 'INCEPTION' | 'RESEARCH' | 'DESIGN' | 'BUILD' | 'TEST' | 'SHIP';
export type TeamMember = 'ever' | 'prisma' | 'toxic' | 'phoenix' | 'techpriest' | 'virgil' | 'zen';
export type Mood = 'happy' | 'neutral' | 'stressed' | 'excited';
export type MessageRole = 'user' | 'assistant' | 'system';

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
  createdAt: Date;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  phase: Phase;
  unlockedAt: Date;
}

export interface MessageSegment {
  type: 'speech' | 'narration' | 'ascii';
  speaker?: TeamMember;
  content: string;
}

export interface GameEvent {
  type: 'XP_GAIN' | 'SPORES_GAIN' | 'ENERGY_UPDATE' | 'LEVEL_UP' | 
        'PHASE_CHANGE' | 'TASK_COMPLETE' | 'STREAK_UPDATE' | 
        'CODE_HEALTH_UPDATE' | 'BLOCKER_ADDED' | 'MILESTONE_UNLOCKED';
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
  
  // Team state
  activeSpeaker: TeamMember | null;
  teamMood: Record<TeamMember, Mood>;
  
  // Chat
  messages: ChatMessage[];
  
  // Session
  sessionId: string | null;
  isLoading: boolean;
  lastSaved: Date | null;
}
