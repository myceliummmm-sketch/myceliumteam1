import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    loadInvite();
  }, [token]);

  const loadInvite = async () => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('session_invites')
        .select('*, game_sessions(id, current_phase), players!session_invites_invited_by_fkey(username, email)')
        .eq('invite_token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        setError('This invitation is invalid or has expired');
        setLoading(false);
        return;
      }

      setInvite(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading invite:', err);
      setError('Failed to load invitation');
      setLoading(false);
    }
  };

  const acceptInvite = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to accept this invitation',
      });
      return;
    }

    setAccepting(true);
    try {
      // Check if email matches
      if (user.email !== invite.invited_email) {
        toast({
          title: 'Email mismatch',
          description: `This invitation was sent to ${invite.invited_email}. Please sign in with that email.`,
          variant: 'destructive',
        });
        setAccepting(false);
        return;
      }

      // Update invite status
      const { error: updateError } = await supabase
        .from('session_invites')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString(),
          invited_player_id: user.id,
        })
        .eq('invite_token', token);

      if (updateError) throw updateError;

      // Add user as collaborator
      const { error: collabError } = await supabase
        .from('session_collaborators')
        .insert({
          session_id: invite.session_id,
          player_id: user.id,
          access_level: invite.access_level,
          accepted_at: new Date().toISOString(),
          invited_by: invite.invited_by,
        });

      if (collabError) throw collabError;

      toast({
        title: 'Invitation accepted!',
        description: 'Redirecting to the session...',
      });

      setTimeout(() => {
        navigate(`/shipit?session=${invite.session_id}`);
      }, 1500);
    } catch (err: any) {
      console.error('Error accepting invite:', err);
      toast({
        title: 'Failed to accept invitation',
        description: err.message,
        variant: 'destructive',
      });
      setAccepting(false);
    }
  };

  const declineInvite = async () => {
    if (!token) return;

    try {
      const { error } = await supabase
        .from('session_invites')
        .update({
          status: 'declined',
          responded_at: new Date().toISOString(),
        })
        .eq('invite_token', token);

      if (error) throw error;

      toast({
        title: 'Invitation declined',
        description: 'You can close this page now',
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Error declining invite:', err);
      toast({
        title: 'Failed to decline invitation',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Invalid Invitation</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const inviterName = invite.players?.username || invite.players?.email?.split('@')[0] || 'A team member';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-6 w-6 text-primary" />
            <CardTitle>Session Invitation</CardTitle>
          </div>
          <CardDescription>
            <strong>{inviterName}</strong> has invited you to collaborate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Access Level:</span>
              <span className="font-medium capitalize">{invite.access_level}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Email:</span>
              <span className="font-medium">{invite.invited_email}</span>
            </div>
          </div>

          {!user ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Please sign in with <strong>{invite.invited_email}</strong> to accept this invitation
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Sign In
              </Button>
            </div>
          ) : user.email !== invite.invited_email ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">
                You're signed in as <strong>{user.email}</strong>, but this invitation was sent to <strong>{invite.invited_email}</strong>
              </p>
              <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                Sign in with different account
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={acceptInvite} 
                disabled={accepting}
                className="w-full"
              >
                {accepting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Invitation
                  </>
                )}
              </Button>
              <Button 
                onClick={declineInvite} 
                variant="outline" 
                className="w-full"
              >
                Decline
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
