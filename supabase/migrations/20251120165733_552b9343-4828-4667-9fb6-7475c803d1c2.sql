-- Add team introduction and personality assessment tracking to player_progress
ALTER TABLE player_progress
ADD COLUMN has_met_team BOOLEAN DEFAULT FALSE,
ADD COLUMN met_team_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN skipped_personality_assessment BOOLEAN DEFAULT FALSE;