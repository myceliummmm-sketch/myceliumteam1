-- Create stage_completions table to track completed stages
CREATE TABLE IF NOT EXISTS stage_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE NOT NULL,
  phase TEXT NOT NULL,
  stage_number INTEGER NOT NULL,
  stage_label TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  time_spent_seconds INTEGER,
  UNIQUE(player_id, session_id, phase, stage_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stage_completions_player ON stage_completions(player_id);
CREATE INDEX IF NOT EXISTS idx_stage_completions_session ON stage_completions(session_id);
CREATE INDEX IF NOT EXISTS idx_stage_completions_phase ON stage_completions(phase, stage_number);

-- RLS Policies
ALTER TABLE stage_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stage completions"
  ON stage_completions FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Users can insert their own stage completions"
  ON stage_completions FOR INSERT
  WITH CHECK (auth.uid() = player_id);

-- Add stage tracking columns to game_states
ALTER TABLE game_states 
ADD COLUMN IF NOT EXISTS current_stage_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_stage_progress REAL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_game_states_stage ON game_states(current_phase, current_stage_number);