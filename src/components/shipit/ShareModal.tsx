import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Copy, X, Mail, UserPlus } from 'lucide-react';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  collaborators: any[];
  pendingInvites: any[];
  onUpdate: () => void;
}

export function ShareModal({ open, onOpenChange, sessionId, collaborators, pendingInvites, onUpdate }: ShareModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<'editor' | 'viewer'>('editor');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: 'Invalid email', variant: 'destructive' });
      return;
    }

    setIsInviting(true);
    try {
      const inviteToken = crypto.randomUUID();
      const currentUser = (await supabase.auth.getUser()).data.user;
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      // Insert invite into database
      const { error: insertError } = await supabase
        .from('session_invites')
        .insert({
          session_id: sessionId,
          invited_email: email,
          invite_token: inviteToken,
          access_level: accessLevel,
          invited_by: currentUser.id,
        });

      if (insertError) throw insertError;

      // Send invite email via edge function
      const { data: emailResp, error: emailError } = await supabase.functions.invoke('send-invite-email', {
        body: {
          inviteToken,
          invitedEmail: email.trim(),
          invitedBy: currentUser.id,
          accessLevel,
          sessionId,
        },
      });

      if (emailError) {
        console.error('Failed to send email:', emailError);
        const backendMsg = (emailError as any)?.context?.body?.error || (emailError as any)?.message || 'Email failed to send';
        toast({
          title: 'Invite created — email not sent',
          description: backendMsg,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Invite sent!',
          description: `${email.trim()} will receive an invitation email`,
        });
      }

      setEmail('');
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Failed to send invite',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('session_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      toast({ title: 'Collaborator removed' });
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Failed to remove collaborator',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/shipit?session=${sessionId}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Link copied to clipboard!' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Session</DialogTitle>
          <DialogDescription>
            Invite others to collaborate on this session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Form */}
          <div className="space-y-4 border-b pb-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access">Access level</Label>
              <Select value={accessLevel} onValueChange={(v: any) => setAccessLevel(v)}>
                <SelectTrigger id="access">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor - Can send messages and collaborate</SelectItem>
                  <SelectItem value="viewer">Viewer - Can only view the session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleInvite} disabled={isInviting} className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Send Invite
            </Button>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share link</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/shipit?session=${sessionId}`}
                className="flex-1"
              />
              <Button onClick={copyInviteLink} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can request access to the session
            </p>
          </div>

          {/* Current Collaborators */}
          <div className="space-y-2">
            <Label>Current Collaborators ({collaborators.length})</Label>
            <div className="space-y-2">
              {collaborators.map((collab: any) => (
                <div key={collab.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{collab.player_email || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground capitalize">{collab.access_level}</p>
                    </div>
                  </div>
                  {collab.access_level !== 'owner' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collab.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <div className="space-y-2">
              <Label>Pending Invites ({pendingInvites.length})</Label>
              <div className="space-y-2">
                {pendingInvites.map((invite: any) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm">{invite.invited_email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{invite.access_level}</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
