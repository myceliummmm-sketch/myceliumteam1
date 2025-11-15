-- Update game_phase enum to match the actual phase names
ALTER TYPE game_phase RENAME TO game_phase_old;

CREATE TYPE game_phase AS ENUM ('SPARK', 'EXPLORE', 'CRAFT', 'FORGE', 'POLISH', 'LAUNCH');

-- Drop defaults before type change
ALTER TABLE game_sessions ALTER COLUMN current_phase DROP DEFAULT;
ALTER TABLE game_states ALTER COLUMN current_phase DROP DEFAULT;

-- Update all tables using the old enum
ALTER TABLE game_sessions ALTER COLUMN current_phase TYPE game_phase USING 
  CASE current_phase::text
    WHEN 'INCEPTION' THEN 'SPARK'::game_phase
    ELSE 'SPARK'::game_phase
  END;

ALTER TABLE game_states ALTER COLUMN current_phase TYPE game_phase USING 
  CASE current_phase::text
    WHEN 'INCEPTION' THEN 'SPARK'::game_phase
    ELSE 'SPARK'::game_phase
  END;

ALTER TABLE prompt_library ALTER COLUMN phase TYPE game_phase USING 
  CASE phase::text
    WHEN 'INCEPTION' THEN 'SPARK'::game_phase
    WHEN 'RESEARCH' THEN 'EXPLORE'::game_phase
    WHEN 'DESIGN' THEN 'CRAFT'::game_phase
    WHEN 'BUILD' THEN 'FORGE'::game_phase
    WHEN 'TEST' THEN 'POLISH'::game_phase
    WHEN 'SHIP' THEN 'LAUNCH'::game_phase
    ELSE NULL
  END;

-- Set new defaults
ALTER TABLE game_sessions ALTER COLUMN current_phase SET DEFAULT 'SPARK'::game_phase;
ALTER TABLE game_states ALTER COLUMN current_phase SET DEFAULT 'SPARK'::game_phase;

DROP TYPE game_phase_old;