import { create } from 'zustand';
import { GameState, ChatMessage, GameEvent, TeamMember } from '@/types/game';

interface GameActions {
  addMessage: (message: ChatMessage) => void;
  updateStats: (stats: Partial<GameState>) => void;
  processGameEvents: (events: GameEvent[]) => void;
  setActiveSpeaker: (speaker: TeamMember | null) => void;
  setLoading: (isLoading: boolean) => void;
  setSessionId: (sessionId: string) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  xp: 0,
  level: 1,
  spores: 0,
  energy: 10,
  streak: 0,
  codeHealth: 100,
  currentPhase: 'INCEPTION',
  completedTasks: [],
  currentTasks: [],
  blockers: [],
  milestones: [],
  activeSpeaker: null,
  teamMood: {
    ever: 'neutral',
    prisma: 'neutral',
    toxic: 'neutral',
    phoenix: 'neutral',
    techpriest: 'neutral',
    virgil: 'neutral',
    zen: 'happy',
  },
  messages: [],
  sessionId: null,
  isLoading: false,
  lastSaved: null,
};

export const useGameStore = create<GameState & GameActions>((set) => ({
  ...initialState,
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  updateStats: (stats) => set(stats),
  
  processGameEvents: (events) => {
    // Will be implemented in game event processor
    console.log('Processing events:', events);
  },
  
  setActiveSpeaker: (speaker) => set({ activeSpeaker: speaker }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setSessionId: (sessionId) => set({ sessionId }),
  
  resetGame: () => set(initialState),
}));
