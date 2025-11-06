-- Add test user flag and user type to players table
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS is_test_user BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'customer';

-- Add comment for clarity
COMMENT ON COLUMN players.is_test_user IS 'Flag to identify internal team members and testers for analytics filtering';
COMMENT ON COLUMN players.user_type IS 'User classification: customer, internal, or tester';

-- Create user_events table for comprehensive event tracking
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_category TEXT,
  event_data JSONB,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_test_event BOOLEAN DEFAULT FALSE
);

-- Performance indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_user_events_player ON user_events(player_id);
CREATE INDEX IF NOT EXISTS idx_user_events_session ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON user_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_is_test ON user_events(is_test_event);
CREATE INDEX IF NOT EXISTS idx_user_events_category ON user_events(event_category);
CREATE INDEX IF NOT EXISTS idx_user_events_player_created ON user_events(player_id, created_at DESC);

-- Enable RLS
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can insert own events"
ON user_events FOR INSERT
WITH CHECK (player_id = auth.uid());

CREATE POLICY "Users can view own events"
ON user_events FOR SELECT
USING (player_id = auth.uid());

-- Trigger function to auto-set is_test_event flag based on player's is_test_user
CREATE OR REPLACE FUNCTION set_test_event_flag()
RETURNS TRIGGER AS $$
BEGIN
  SELECT is_test_user INTO NEW.is_test_event
  FROM players
  WHERE id = NEW.player_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS auto_set_test_event_flag ON user_events;
CREATE TRIGGER auto_set_test_event_flag
BEFORE INSERT ON user_events
FOR EACH ROW
EXECUTE FUNCTION set_test_event_flag();