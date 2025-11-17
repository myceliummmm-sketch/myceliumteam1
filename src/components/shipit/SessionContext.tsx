import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGameStore } from '@/stores/gameStore';
import { Badge } from '@/components/ui/badge';
import { User, Users, Crown } from 'lucide-react';

interface SessionInfo {
  is_owner: boolean;
  owner_email: string;
  access_level: string;
}

export function SessionContext() {
  const { user } = useAuth();
  const sessionId = useGameStore((state) => state.sessionId);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  useEffect(() => {
    if (!user || !sessionId) return;
    loadSessionInfo();
  }, [user, sessionId]);

  const loadSessionInfo = async () => {
    if (!user || !sessionId) return;

    try {
      // Get session owner info
      const { data: session } = await supabase
        .from('game_sessions')
        .select('player_id')
        .eq('id', sessionId)
        .single();

      if (!session) return;

      const isOwner = session.player_id === user.id;

      if (isOwner) {
        setSessionInfo({
          is_owner: true,
          owner_email: user.email || '',
          access_level: 'owner',
        });
        return;
      }

      // Get collaborator info
      const { data: collaborator } = await supabase
        .from('session_collaborators')
        .select('access_level')
        .eq('session_id', sessionId)
        .eq('player_id', user.id)
        .single();

      // Get owner email
      const { data: ownerData } = await supabase
        .from('players')
        .select('email')
        .eq('id', session.player_id)
        .single();

      setSessionInfo({
        is_owner: false,
        owner_email: ownerData?.email || 'Unknown',
        access_level: collaborator?.access_level || 'viewer',
      });
    } catch (error) {
      console.error('Error loading session info:', error);
    }
  };

  if (!sessionInfo) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg border border-border/50">
      {sessionInfo.is_owner ? (
        <>
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium">Your Session</span>
        </>
      ) : (
        <>
          <Users className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Shared by {sessionInfo.owner_email.split('@')[0]}
            </span>
          </div>
          <Badge variant="secondary" className="ml-auto capitalize text-xs">
            {sessionInfo.access_level}
          </Badge>
        </>
      )}
    </div>
  );
}
