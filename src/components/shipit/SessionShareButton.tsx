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
    if (!user) {
      console.log('SessionShareButton: No user found');
      return;
    }

    console.log('SessionShareButton: Loading data for session:', sessionId, 'user:', user.id);

    // Load collaborators
    const { data: collabData, error: collabError } = await supabase
      .from('session_collaborators')
      .select(`
        id,
        access_level,
        accepted_at,
        player_id,
        players!session_collaborators_player_id_fkey(email)
      `)
      .eq('session_id', sessionId);

    if (collabError) {
      console.error('SessionShareButton: Error loading collaborators:', collabError);
    }

    console.log('SessionShareButton: Collaborators data:', collabData);

    if (collabData) {
      setCollaborators(
        collabData.map((c: any) => ({
          ...c,
          player_email: c.players?.email,
        }))
      );

      // Check if current user is owner
      const userCollab = collabData.find((c: any) => c.player_id === user.id);
      const isOwnerUser = userCollab?.access_level === 'owner';
      console.log('SessionShareButton: User collab:', userCollab, 'isOwner:', isOwnerUser);
      setIsOwner(isOwnerUser);
    }

    // Load pending invites
    const { data: inviteData, error: inviteError } = await supabase
      .from('session_invites')
      .select('*')
      .eq('session_id', sessionId)
      .eq('status', 'pending');

    if (inviteError) {
      console.error('SessionShareButton: Error loading invites:', inviteError);
    }

    if (inviteData) {
      setPendingInvites(inviteData);
    }
  };

  useEffect(() => {
    loadData();
  }, [sessionId, user]);

  // Show button while loading to prevent flicker
  console.log('SessionShareButton: Render - isOwner:', isOwner, 'sessionId:', sessionId);

  // Only hide if we've finished loading and user is not owner
  if (user && !isOwner && collaborators.length > 0) return null;

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
