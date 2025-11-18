import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGameStore } from '@/stores/gameStore';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, Users } from 'lucide-react';

interface Session {
  id: string;
  player_id: string;
  created_at: string;
  project_name: string;
  project_color: string;
  is_owner: boolean;
  access_level?: string;
}

export function SessionSwitcher() {
  const { user } = useAuth();
  const sessionId = useGameStore((state) => state.sessionId);
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('session_collaborators')
        .select(`
          session_id,
          access_level,
          game_sessions!inner(
            id,
            player_id,
            created_at,
            project_name,
            project_color,
            is_active
          )
        `)
        .eq('player_id', user.id)
        .not('accepted_at', 'is', null)
        .eq('game_sessions.is_active', true)
        .order('game_sessions.updated_at', { ascending: false });

      if (error) throw error;

      const formattedSessions = data?.map((item: any) => ({
        id: item.game_sessions.id,
        player_id: item.game_sessions.player_id,
        created_at: item.game_sessions.created_at,
        project_name: item.game_sessions.project_name || 'Untitled Project',
        project_color: item.game_sessions.project_color || '#6366f1',
        is_owner: item.game_sessions.player_id === user.id,
        access_level: item.access_level,
      })) || [];

      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchSession = (newSessionId: string) => {
    if (newSessionId === sessionId) return;
    navigate(`/shipit?session=${newSessionId}`);
    window.location.reload(); // Reload to initialize new session
  };

  const ownedSessions = sessions.filter((s) => s.is_owner);
  const sharedSessions = sessions.filter((s) => !s.is_owner);
  const currentSession = sessions.find((s) => s.id === sessionId);

  if (sessions.length <= 1) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div 
            className="w-3 h-3 rounded"
            style={{ backgroundColor: currentSession?.project_color || '#6366f1' }}
          />
          <span className="hidden sm:inline max-w-[150px] truncate">
            {currentSession?.project_name || 'Select Project'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {ownedSessions.length > 0 && (
          <>
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Sessions
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {ownedSessions.map((session) => (
                <DropdownMenuItem
                  key={session.id}
                  onClick={() => switchSession(session.id)}
                  className={sessionId === session.id ? 'bg-accent' : ''}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: session.project_color }}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {session.project_name}
                      </span>
                      {sessionId === session.id && (
                        <span className="text-xs text-muted-foreground">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        {sharedSessions.length > 0 && (
          <>
            {ownedSessions.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Shared with You
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {sharedSessions.map((session) => (
                <DropdownMenuItem
                  key={session.id}
                  onClick={() => switchSession(session.id)}
                  className={sessionId === session.id ? 'bg-accent' : ''}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: session.project_color }}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {session.project_name}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {session.access_level}
                        {sessionId === session.id && ' • Current'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
