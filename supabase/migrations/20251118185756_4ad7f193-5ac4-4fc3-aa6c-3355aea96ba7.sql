-- Add project metadata columns to game_sessions table
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS project_name TEXT DEFAULT 'Untitled Project',
ADD COLUMN IF NOT EXISTS project_description TEXT,
ADD COLUMN IF NOT EXISTS project_color TEXT DEFAULT '#6366f1',
ADD COLUMN IF NOT EXISTS project_icon TEXT DEFAULT 'folder',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster project queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_active_projects 
ON game_sessions(player_id, is_active, updated_at DESC) 
WHERE is_active = true;