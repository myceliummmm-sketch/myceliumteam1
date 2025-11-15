import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShareModal } from './ShareModal';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SessionShareButtonProps {
  sessionId: string;
}

export function SessionShareButton({ sessionId }: SessionShareButtonProps) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  const loadData = async () => {
    if (!user) return;

    // Load collaborators
    const { data: collabData } = await supabase
      .from('session_collaborators')
      .select(`
        id,
        access_level,
        accepted_at,
        player_id,
        players!inner(email)
      `)
      .eq('session_id', sessionId);

    if (collabData) {
      setCollaborators(
        collabData.map((c: any) => ({
          ...c,
          player_email: c.players?.email,
        }))
      );

      // Check if current user is owner
      const userCollab = collabData.find((c: any) => c.player_id === user.id);
      setIsOwner(userCollab?.access_level === 'owner');
    }

    // Load pending invites
    const { data: inviteData } = await supabase
      .from('session_invites')
      .select('*')
      .eq('session_id', sessionId)
      .eq('status', 'pending');

    if (inviteData) {
      setPendingInvites(inviteData);
    }
  };

  useEffect(() => {
    loadData();
  }, [sessionId, user]);

  if (!isOwner) return null;

  return (
    <>
      <Button onClick={() => setShowModal(true)} variant="outline" size="sm">
        <Users className="w-4 h-4 mr-2" />
        Share
      </Button>
      <ShareModal
        open={showModal}
        onOpenChange={setShowModal}
        sessionId={sessionId}
        collaborators={collaborators}
        pendingInvites={pendingInvites}
        onUpdate={loadData}
      />
    </>
  );
}
