import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGameSession } from '@/hooks/useGameSession';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TeamPanel } from '@/components/shipit/TeamPanel';
import { PhaseProgress } from '@/components/shipit/PhaseProgress';
import { ChatTerminal } from '@/components/shipit/ChatTerminal';
import { InputBar } from '@/components/shipit/InputBar';
import { QuickReplies } from '@/components/shipit/QuickReplies';
import { StatsPanel } from '@/components/shipit/StatsPanel';
import { QuestLog } from '@/components/shipit/QuestLog';
import { LevelUpModal } from '@/components/shipit/LevelUpModal';
import { StreakCalendar } from '@/components/shipit/StreakCalendar';
import { TutorialOverlay } from '@/components/shipit/TutorialOverlay';
import { ArtifactUnlockModal } from '@/components/shipit/ArtifactUnlockModal';
import { DevModePanel } from '@/components/shipit/DevModePanel';
import { LogOut, Loader2, Users, BarChart3, BookOpen } from 'lucide-react';
import { PromptLibrary } from '@/components/shipit/PromptLibrary';
import { SessionShareButton } from '@/components/shipit/SessionShareButton';
import { CollaboratorsList } from '@/components/shipit/CollaboratorsList';
import { ActivityFeed } from '@/components/shipit/ActivityFeed';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export default function ShipIt() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { loading, sendMessage } = useGameSession();
  const quickReplies = useGameStore((state) => state.quickReplies);
  const isLoading = useGameStore((state) => state.isLoading);
  const energy = useGameStore((state) => state.energy);
  const sessionId = useGameStore((state) => state.sessionId);
  const showArtifactUnlockModal = useGameStore((state) => state.showArtifactUnlockModal);
  const unlockedArtifact = useGameStore((state) => state.unlockedArtifact);
  const setShowArtifactUnlockModal = useGameStore((state) => state.setShowArtifactUnlockModal);
  const setShowPromptLibrary = useGameStore((state) => state.setShowPromptLibrary);
  const leftPanelCollapsed = useGameStore((state) => state.leftPanelCollapsed);
  const rightPanelCollapsed = useGameStore((state) => state.rightPanelCollapsed);
  const toggleLeftPanel = useGameStore((state) => state.toggleLeftPanel);
  const toggleRightPanel = useGameStore((state) => state.toggleRightPanel);
  const promptCount = 0;

  // Real-time presence tracking
  const [onlineCollaborators, setOnlineCollaborators] = useState<any[]>([]);

  useEffect(() => {
    if (!sessionId || !user) return;

    const channel = supabase.channel(`session:${sessionId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const collaborators = Object.values(state).flat();
        setOnlineCollaborators(collaborators as any[]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            username: user.email?.split('@')[0],
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your game session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <PromptLibrary />
      <LevelUpModal />
      {showArtifactUnlockModal && unlockedArtifact && (
        <ArtifactUnlockModal 
          artifact={unlockedArtifact}
          onClose={() => setShowArtifactUnlockModal(false)}
        />
      )}
      
      {/* Header with Team button on mobile and Logout */}
      <div className="flex justify-between items-center mb-4">
        {/* Mobile Team Sheet - only visible on mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden">
              <Users className="h-4 w-4 mr-2" />
              Team
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <div className="pt-6" data-tutorial-target="team-panel">
              <TeamPanel />
            </div>
          </SheetContent>
        </Sheet>

        {/* Collaborators, Prompt Library, Analytics and Logout Buttons */}
        <div className="flex gap-2 ml-auto items-center">
          {onlineCollaborators.length > 0 && user && (
            <CollaboratorsList 
              collaborators={onlineCollaborators} 
              currentUserId={user.id}
            />
          )}
          {sessionId && <SessionShareButton sessionId={sessionId} />}
          <Button variant="outline" onClick={() => setShowPromptLibrary(true)} size="sm" className="relative">
            <BookOpen className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Prompts</span>
            {promptCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center">
                {promptCount}
              </span>
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate('/analytics')} size="sm">
            <BarChart3 className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Analytics</span>
          </Button>
          <Button variant="outline" onClick={signOut} size="sm">
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
      
      {/* Responsive Flex Layout */}
      <div className="h-auto lg:h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-4">
        {/* Left: Team Panel - Hidden on mobile, collapsible sidebar on desktop */}
        <div 
          className={`hidden lg:block transition-all duration-300 overflow-y-auto ${
            leftPanelCollapsed ? 'w-20' : 'w-64'
          }`}
          data-tutorial-target="team-panel"
        >
          <TeamPanel collapsed={leftPanelCollapsed} onToggle={toggleLeftPanel} />
        </div>
        
        {/* Center: Chat & Terminal - Full width on mobile, grows to fill space on desktop */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 min-h-[60vh] lg:min-h-0">
          <PhaseProgress />
          <div className="flex-1 min-h-[400px] lg:min-h-0" data-tutorial-target="chat-terminal">
            <ChatTerminal />
          </div>
          <QuickReplies 
            suggestions={quickReplies}
            onSelect={sendMessage}
            disabled={isLoading || energy < 1}
          />
          <div className="sticky bottom-0 bg-background" data-tutorial-target="input-bar">
            <InputBar />
          </div>
        </div>
        
        {/* Right: Stats, Activity Feed & Quest Log - Below chat on mobile, collapsible sidebar on desktop */}
        <div 
          className={`flex flex-col gap-4 overflow-y-auto transition-all duration-300 ${
            rightPanelCollapsed ? 'lg:w-20' : 'lg:w-80'
          }`}
        >
          <div data-tutorial-target="stats-panel">
            <StatsPanel collapsed={rightPanelCollapsed} onToggle={toggleRightPanel} />
          </div>
          <StreakCalendar collapsed={rightPanelCollapsed} />
          {sessionId && onlineCollaborators.length > 1 && (
            <ActivityFeed sessionId={sessionId} collapsed={rightPanelCollapsed} />
          )}
          <div data-tutorial-target="quest-log">
            <QuestLog collapsed={rightPanelCollapsed} />
          </div>
        </div>
      </div>
      <TutorialOverlay />
      <DevModePanel />
    </div>
  );
}
