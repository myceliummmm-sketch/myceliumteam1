-- Create session access level enum
CREATE TYPE session_access_level AS ENUM ('owner', 'editor', 'viewer');

-- Collaborators table
CREATE TABLE session_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  access_level session_access_level NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES players(id),
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, player_id)
);

-- Session owner is automatically added as collaborator
CREATE OR REPLACE FUNCTION add_owner_as_collaborator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO session_collaborators (session_id, player_id, access_level, accepted_at)
  VALUES (NEW.id, NEW.player_id, 'owner', now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_session_created
  AFTER INSERT ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION add_owner_as_collaborator();

-- Pending invites table
CREATE TABLE session_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_player_id UUID REFERENCES players(id),
  invited_by UUID NOT NULL REFERENCES players(id),
  access_level session_access_level NOT NULL DEFAULT 'viewer',
  invite_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ
);

-- Collaboration activity log
CREATE TABLE collaboration_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id),
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_session_collaborators_session ON session_collaborators(session_id);
CREATE INDEX idx_session_collaborators_player ON session_collaborators(player_id);
CREATE INDEX idx_session_invites_email ON session_invites(invited_email);
CREATE INDEX idx_session_invites_token ON session_invites(invite_token);
CREATE INDEX idx_collaboration_activity_session ON collaboration_activity(session_id);

-- Enable RLS
ALTER TABLE session_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for session_collaborators
CREATE POLICY "Users can view collaborations they're part of"
  ON session_collaborators FOR SELECT
  USING (player_id = auth.uid() OR session_id IN (
    SELECT session_id FROM session_collaborators WHERE player_id = auth.uid()
  ));

CREATE POLICY "Owners and editors can add collaborators"
  ON session_collaborators FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() AND access_level IN ('owner', 'editor')
    )
  );

CREATE POLICY "Owners can update collaborator access"
  ON session_collaborators FOR UPDATE
  USING (
    session_id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() AND access_level = 'owner'
    )
  );

CREATE POLICY "Owners can remove collaborators"
  ON session_collaborators FOR DELETE
  USING (
    session_id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() AND access_level = 'owner'
    )
  );

-- RLS Policies for session_invites
CREATE POLICY "Users can view invites sent to them"
  ON session_invites FOR SELECT
  USING (
    invited_email = (SELECT email FROM players WHERE id = auth.uid()) 
    OR invited_player_id = auth.uid()
    OR invited_by = auth.uid()
    OR session_id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() AND access_level IN ('owner', 'editor')
    )
  );

CREATE POLICY "Owners and editors can create invites"
  ON session_invites FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() AND access_level IN ('owner', 'editor')
    )
  );

CREATE POLICY "Users can update their own invite responses"
  ON session_invites FOR UPDATE
  USING (
    invited_email = (SELECT email FROM players WHERE id = auth.uid())
    OR invited_player_id = auth.uid()
  );

-- RLS Policies for collaboration_activity
CREATE POLICY "Collaborators can view session activity"
  ON collaboration_activity FOR SELECT
  USING (session_id IN (
    SELECT session_id FROM session_collaborators WHERE player_id = auth.uid()
  ));

CREATE POLICY "Collaborators can add activity"
  ON collaboration_activity FOR INSERT
  WITH CHECK (player_id = auth.uid());

-- Update existing RLS policies for shared access
DROP POLICY IF EXISTS "Users can view own sessions" ON game_sessions;
CREATE POLICY "Users can view own or shared sessions"
  ON game_sessions FOR SELECT
  USING (
    player_id = auth.uid() 
    OR id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() AND accepted_at IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Users can view own game states" ON game_states;
CREATE POLICY "Users can view shared game states"
  ON game_states FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() AND accepted_at IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
CREATE POLICY "Users can view shared messages"
  ON chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() AND accepted_at IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "Users can create own messages" ON chat_messages;
CREATE POLICY "Editors can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM session_collaborators 
      WHERE player_id = auth.uid() 
      AND access_level IN ('owner', 'editor')
      AND accepted_at IS NOT NULL
    )
  );