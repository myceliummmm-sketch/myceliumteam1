-- Create security definer function to check if user has a valid invitation
CREATE OR REPLACE FUNCTION public.has_valid_invitation(
  p_session_id uuid,
  p_player_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM session_invites si
    JOIN players p ON p.id = p_player_id
    WHERE si.session_id = p_session_id
    AND (
      si.invited_player_id = p_player_id
      OR si.invited_email = p.email
    )
    AND si.status = 'pending'
    AND si.expires_at > now()
  );
$$;

-- Add new RLS policy to allow users to accept invitations and add themselves
CREATE POLICY "Users can accept invitations and add themselves"
ON session_collaborators
FOR INSERT
TO authenticated
WITH CHECK (
  player_id = auth.uid()
  AND has_valid_invitation(session_id, auth.uid())
);

-- Add index on invite_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_session_invites_token 
ON session_invites(invite_token) 
WHERE status = 'pending';