-- Now migrate existing data to use new phase names
-- This must be in a separate migration after enum values are committed

CREATE OR REPLACE FUNCTION migrate_phase_data()
RETURNS void AS $$
BEGIN
  -- Migrate game_states
  UPDATE game_states 
  SET current_phase = CASE current_phase::text
    WHEN 'SPARK' THEN 'VISION'::game_phase
    WHEN 'EXPLORE' THEN 'RESEARCH'::game_phase
    WHEN 'CRAFT' THEN 'PROTOTYPE'::game_phase
    WHEN 'FORGE' THEN 'BUILD'::game_phase
    WHEN 'POLISH' THEN 'GROW'::game_phase
    WHEN 'LAUNCH' THEN 'GROW'::game_phase
    ELSE current_phase
  END
  WHERE current_phase::text IN ('SPARK', 'EXPLORE', 'CRAFT', 'FORGE', 'POLISH', 'LAUNCH');

  -- Migrate stage_completions
  UPDATE stage_completions
  SET phase = CASE phase
    WHEN 'SPARK' THEN 'VISION'
    WHEN 'EXPLORE' THEN 'RESEARCH'
    WHEN 'CRAFT' THEN 'PROTOTYPE'
    WHEN 'FORGE' THEN 'BUILD'
    WHEN 'POLISH' THEN 'GROW'
    WHEN 'LAUNCH' THEN 'GROW'
    ELSE phase
  END
  WHERE phase IN ('SPARK', 'EXPLORE', 'CRAFT', 'FORGE', 'POLISH', 'LAUNCH');

  -- Migrate game_sessions
  UPDATE game_sessions
  SET current_phase = CASE current_phase::text
    WHEN 'SPARK' THEN 'VISION'::game_phase
    WHEN 'EXPLORE' THEN 'RESEARCH'::game_phase
    WHEN 'CRAFT' THEN 'PROTOTYPE'::game_phase
    WHEN 'FORGE' THEN 'BUILD'::game_phase
    WHEN 'POLISH' THEN 'GROW'::game_phase
    WHEN 'LAUNCH' THEN 'GROW'::game_phase
    ELSE current_phase
  END
  WHERE current_phase::text IN ('SPARK', 'EXPLORE', 'CRAFT', 'FORGE', 'POLISH', 'LAUNCH');
END;
$$ LANGUAGE plpgsql;

-- Execute the migration
SELECT migrate_phase_data();