-- Fix RLS recursion in session_collaborators table

-- Drop existing recursive policies
DROP POLICY IF EXISTS "Users can view collaborations they're part of" ON session_collaborators;
DROP POLICY IF EXISTS "Owners and editors can add collaborators" ON session_collaborators;
DROP POLICY IF EXISTS "Owners can update collaborator access" ON session_collaborators;
DROP POLICY IF EXISTS "Owners can remove collaborators" ON session_collaborators;

-- Create security definer function to check ownership/editor access
CREATE OR REPLACE FUNCTION public.is_session_owner_or_editor(p_session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM session_collaborators
    WHERE session_id = p_session_id
    AND player_id = auth.uid()
    AND access_level IN ('owner', 'editor')
    AND accepted_at IS NOT NULL
  );
END;
$$;

-- Create security definer function to check ownership only
CREATE OR REPLACE FUNCTION public.is_session_owner(p_session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM session_collaborators
    WHERE session_id = p_session_id
    AND player_id = auth.uid()
    AND access_level = 'owner'
    AND accepted_at IS NOT NULL
  );
END;
$$;

-- Recreate non-recursive policies

-- Simple SELECT policy: users can see rows where they are the player
CREATE POLICY "Users can view collaborations they're part of"
  ON session_collaborators FOR SELECT
  USING (player_id = auth.uid());

-- INSERT policy using security definer function
CREATE POLICY "Owners and editors can add collaborators"
  ON session_collaborators FOR INSERT
  WITH CHECK (public.is_session_owner_or_editor(session_id));

-- UPDATE policy using security definer function
CREATE POLICY "Owners can update collaborator access"
  ON session_collaborators FOR UPDATE
  USING (public.is_session_owner(session_id));

-- DELETE policy using security definer function
CREATE POLICY "Owners can remove collaborators"
  ON session_collaborators FOR DELETE
  USING (public.is_session_owner(session_id));