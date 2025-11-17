import { create } from 'zustand';
import { GameState, ChatMessage, GameEvent, TeamMember, Artifact, ArtifactId, QuickReplyButton, ConversationMode } from '@/types/game';
import { supabase } from '@/integrations/supabase/client';

interface GameActions {
  addMessage: (message: ChatMessage) => void;
  updateStats: (stats: Partial<GameState>) => void;
  processGameEvents: (events: GameEvent[]) => void;
  setActiveSpeaker: (speaker: TeamMember | null) => void;
  setPreferredSpeaker: (speaker: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setSessionId: (sessionId: string) => void;
  resetGame: () => void;
  clearMessages: () => void;
  setShowLevelUpModal: (show: boolean) => void;
  setLevelUpRewards: (rewards: { spores: number; milestone?: string }) => void;
  setShowArtifactUnlockModal: (show: boolean) => void;
  setUnlockedArtifact: (artifact: Artifact | null) => void;
  regenerateEnergy: () => void;
  nextTutorialStep: () => void;
  skipTutorial: () => void;
  setShowTutorial: (show: boolean) => void;
  setQuickReplies: (replies: QuickReplyButton[]) => void;
  setAiSuggestedActions: (actions: string[]) => void;
  setConversationMode: (mode: ConversationMode) => void;
  unlockMode: (mode: ConversationMode) => void;
  setShowPromptLibrary: (show: boolean) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setLeftPanelCollapsed: (collapsed: boolean) => void;
  setRightPanelCollapsed: (collapsed: boolean) => void;
}

const initialState: GameState = {
  xp: 0,
  level: 1,
  spores: 0,
  energy: 10,
  streak: 0,
  codeHealth: 100,
  currentPhase: 'SPARK',
  completedTasks: [],
  currentTasks: [],
  blockers: [],
  milestones: [],
  artifacts: [],
  bossBlockersDefeated: [],
  artifactBonuses: {
    xpMultiplier: 1,
    energyBonus: 0,
    sporeMultiplier: 1,
  },
  activeSpeaker: null,
  preferredSpeaker: null,
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
  aiSuggestedActions: [],
  sessionId: null,
  isLoading: false,
  lastSaved: null,
  lastEnergyUpdate: null,
  showTutorial: false,
  tutorialStep: null,
  hasCompletedTutorial: false,
  showLevelUpModal: false,
  levelUpRewards: { spores: 0 },
  showArtifactUnlockModal: false,
  unlockedArtifact: null,
  conversationMode: 'discussion' as ConversationMode,
  unlockedModes: ['discussion'] as ConversationMode[],
  showPromptLibrary: false,
  leftPanelCollapsed: typeof window !== 'undefined' 
    ? localStorage.getItem('leftPanelCollapsed') === 'true' 
    : false,
  rightPanelCollapsed: typeof window !== 'undefined' 
    ? localStorage.getItem('rightPanelCollapsed') === 'true' 
    : false,
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
            // Apply artifact XP multiplier
            const xpAmount = Math.floor(event.data.amount * newState.artifactBonuses.xpMultiplier);
            const newXp = newState.xp + xpAmount;
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
              type: event.data.type || 'normal',
              bossData: event.data.bossData,
              createdAt: new Date()
            };
            newState.blockers = [...newState.blockers, blocker];
            break;
          
          case 'BLOCKER_RESOLVED':
            newState.blockers = newState.blockers.filter(b => b.id !== event.data.blockerId);
            break;
          
          case 'SPORES_GAIN':
            // Apply artifact spore multiplier
            const sporeAmount = Math.floor(event.data.amount * newState.artifactBonuses.sporeMultiplier);
            newState.spores += sporeAmount;
            break;
          
          case 'ARTIFACT_UNLOCKED':
            // Update the artifact to unlocked status
            const artifactId = event.data.artifactId;
            newState.artifacts = newState.artifacts.map(a => 
              a.id === artifactId ? { ...a, unlocked: true, unlockedAt: new Date() } : a
            );
            
            // Recalculate bonuses
            const { applyArtifactBonuses } = require('@/lib/artifactSystem');
            newState.artifactBonuses = applyArtifactBonuses(newState.artifacts);
            
            // Show unlock modal
            const unlockedArtifact = newState.artifacts.find(a => a.id === artifactId);
            if (unlockedArtifact) {
              newState.showArtifactUnlockModal = true;
              newState.unlockedArtifact = unlockedArtifact;
              
              // Track artifact unlock event
              const user = (window as any).supabaseUser;
              const sessionId = state.sessionId;
              if (user && sessionId) {
                import('@/integrations/supabase/client').then(({ supabase }) => {
                  void supabase.from('user_events').insert({
                    player_id: user.id,
                    session_id: sessionId,
                    event_type: 'artifact_unlocked',
                    event_category: 'gameplay',
                    event_data: { 
                      artifact_id: artifactId,
                      artifact_name: unlockedArtifact.name,
                      level: newState.level,
                      phase: newState.currentPhase,
                      xp_multiplier: unlockedArtifact.passiveBonuses.xpMultiplier,
                      energy_bonus: unlockedArtifact.passiveBonuses.energyRegenBonus,
                      spore_multiplier: unlockedArtifact.passiveBonuses.sporeMultiplier,
                    },
                    page_url: window.location.pathname
                  });
                });
              }
            }
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
        
        // Track level up event
        const user = (window as any).supabaseUser;
        const sessionId = state.sessionId;
        if (user && sessionId) {
          import('@/integrations/supabase/client').then(({ supabase }) => {
            void supabase.from('user_events').insert({
              player_id: user.id,
              session_id: sessionId,
              event_type: 'level_up',
              event_category: 'gameplay',
              event_data: { new_level: newState.level, spores_earned: sporesEarned },
              page_url: window.location.pathname
            });
          });
        }
      }
      
      return newState;
    });
  },
  
  setActiveSpeaker: (speaker) => set({ activeSpeaker: speaker }),
  
  setPreferredSpeaker: (speaker) => set({ preferredSpeaker: speaker }),
  
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
  
  setAiSuggestedActions: (actions) => set({ aiSuggestedActions: actions }),
  
  setShowArtifactUnlockModal: (show) => set({ showArtifactUnlockModal: show }),
  
  setUnlockedArtifact: (artifact) => set({ unlockedArtifact: artifact }),
  
  setConversationMode: (mode: ConversationMode) => set({ conversationMode: mode }),
  
  unlockMode: (mode: ConversationMode) => 
    set((state) => ({
      unlockedModes: [...new Set([...state.unlockedModes, mode])]
    })),
  
  setShowPromptLibrary: (show: boolean) => set({ showPromptLibrary: show }),
  
  toggleLeftPanel: () => set((state) => {
    const newValue = !state.leftPanelCollapsed;
    localStorage.setItem('leftPanelCollapsed', String(newValue));
    return { leftPanelCollapsed: newValue };
  }),
  
  toggleRightPanel: () => set((state) => {
    const newValue = !state.rightPanelCollapsed;
    localStorage.setItem('rightPanelCollapsed', String(newValue));
    return { rightPanelCollapsed: newValue };
  }),
  
  setLeftPanelCollapsed: (collapsed: boolean) => {
    localStorage.setItem('leftPanelCollapsed', String(collapsed));
    set({ leftPanelCollapsed: collapsed });
  },
  
  setRightPanelCollapsed: (collapsed: boolean) => {
    localStorage.setItem('rightPanelCollapsed', String(collapsed));
    set({ rightPanelCollapsed: collapsed });
  },
}));
