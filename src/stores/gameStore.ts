import { create } from 'zustand';
import { GameState, ChatMessage, GameEvent, TeamMember } from '@/types/game';
import { supabase } from '@/integrations/supabase/client';

interface GameActions {
  addMessage: (message: ChatMessage) => void;
  updateStats: (stats: Partial<GameState>) => void;
  processGameEvents: (events: GameEvent[]) => void;
  setActiveSpeaker: (speaker: TeamMember | null) => void;
  setLoading: (isLoading: boolean) => void;
  setSessionId: (sessionId: string) => void;
  resetGame: () => void;
  clearMessages: () => void;
  setShowLevelUpModal: (show: boolean) => void;
  setLevelUpRewards: (rewards: { spores: number; milestone?: string }) => void;
  regenerateEnergy: () => void;
  nextTutorialStep: () => void;
  skipTutorial: () => void;
  setShowTutorial: (show: boolean) => void;
  setQuickReplies: (replies: string[]) => void;
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
  quickReplies: [],
  sessionId: null,
  isLoading: false,
  lastSaved: null,
  lastEnergyUpdate: null,
  showTutorial: false,
  tutorialStep: null,
  hasCompletedTutorial: false,
  showLevelUpModal: false,
  levelUpRewards: { spores: 0 },
};

export const useGameStore = create<GameState & GameActions>((set) => ({
  ...initialState,
  
  addMessage: (message) => set((state) => {
    // Prevent duplicates by checking if message ID already exists
    const exists = state.messages.some(m => m.id === message.id);
    if (exists) return state;
    
    return {
      messages: [...state.messages, message]
    };
  }),
  
  updateStats: (stats) => set(stats),
  
  processGameEvents: (events) => {
    set((state) => {
      let newState = { ...state };
      let didLevelUp = false;
      let sporesEarned = 0;
      
      events.forEach(event => {
        switch (event.type) {
          case 'XP_GAIN':
            const newXp = newState.xp + event.data.amount;
            const xpForLevel = newState.level * 100;
            if (newXp >= xpForLevel) {
              didLevelUp = true;
              sporesEarned = 10 + (newState.level * 5);
              newState.level += 1;
              newState.xp = newXp - xpForLevel;
              newState.spores += sporesEarned;
            } else {
              newState.xp = newXp;
            }
            break;
          
          case 'ENERGY_UPDATE':
            newState.energy = Math.max(0, Math.min(10, newState.energy + event.data.delta));
            break;
          
          case 'CODE_HEALTH_UPDATE':
            newState.codeHealth = Math.max(0, Math.min(100, newState.codeHealth + event.data.delta));
            break;
          
          case 'PHASE_CHANGE':
            newState.currentPhase = event.data.newPhase;
            break;
          
          case 'TASK_COMPLETE':
            const taskIndex = newState.currentTasks.findIndex(t => t.id === event.data.taskId);
            if (taskIndex >= 0) {
              const task = newState.currentTasks[taskIndex];
              newState.completedTasks = [...newState.completedTasks, { ...task, completed: true }];
              newState.currentTasks = newState.currentTasks.filter((_, i) => i !== taskIndex);
            }
            break;
          
          case 'BLOCKER_ADDED':
            const blocker = {
              id: crypto.randomUUID(),
              description: event.data.description,
              severity: event.data.severity,
              createdAt: new Date()
            };
            newState.blockers = [...newState.blockers, blocker];
            break;
          
          case 'MILESTONE_UNLOCKED':
            const milestone = {
              id: crypto.randomUUID(),
              name: event.data.name,
              description: event.data.description,
              phase: newState.currentPhase,
              unlockedAt: new Date()
            };
            newState.milestones = [...newState.milestones, milestone];
            break;
        }
      });
      
      if (didLevelUp) {
        newState.showLevelUpModal = true;
        newState.levelUpRewards = { 
          spores: sporesEarned,
          milestone: newState.level % 5 === 0 ? `Milestone Achieved: Level ${newState.level}!` : undefined
        };
      }
      
      return newState;
    });
  },
  
  setActiveSpeaker: (speaker) => set({ activeSpeaker: speaker }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setSessionId: (sessionId) => set({ sessionId }),
  
  resetGame: () => set(initialState),
  
  clearMessages: () => set({ messages: [] }),
  
  setShowLevelUpModal: (show) => set({ showLevelUpModal: show }),
  
  setLevelUpRewards: (rewards) => set({ levelUpRewards: rewards }),
  
  regenerateEnergy: () => set((state) => {
    if (!state.lastEnergyUpdate || state.energy >= 10) return state;
    
    const { calculateEnergyRegeneration } = require('@/lib/energySystem');
    const { newEnergy, energyGained } = calculateEnergyRegeneration(
      state.lastEnergyUpdate,
      state.energy
    );
    
    if (energyGained > 0) {
      return {
        energy: newEnergy,
        lastEnergyUpdate: new Date()
      };
    }
    
    return state;
  }),
  
  nextTutorialStep: () => set((state) => {
    const nextStep = (state.tutorialStep || 0) + 1;
    
    if (nextStep >= 5) {
      // Tutorial complete - update database
      const updateProgress = async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          await supabase
            .from('player_progress')
            .update({ 
              has_completed_tutorial: true,
              tutorial_step: 5 
            })
            .eq('player_id', data.user.id);
        }
      };
      updateProgress();
      
      return {
        showTutorial: false,
        tutorialStep: null,
        hasCompletedTutorial: true
      };
    }
    
    return { tutorialStep: nextStep };
  }),
  
  skipTutorial: () => {
    // Update database when skipping
    const updateProgress = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase
          .from('player_progress')
          .update({ 
            has_completed_tutorial: true,
            tutorial_step: 5 
          })
          .eq('player_id', data.user.id);
      }
    };
    updateProgress();
    
    return set({
      showTutorial: false,
      tutorialStep: null,
      hasCompletedTutorial: true
    });
  },
  
  setShowTutorial: (show) => set({ showTutorial: show }),
  
  setQuickReplies: (replies) => set({ quickReplies: replies }),
}));
