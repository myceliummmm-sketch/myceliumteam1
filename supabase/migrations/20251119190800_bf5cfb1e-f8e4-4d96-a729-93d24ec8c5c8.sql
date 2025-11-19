-- Create daily challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  phase TEXT NOT NULL,
  stage_number INTEGER NOT NULL,
  challenge_type TEXT NOT NULL,
  challenge_text TEXT NOT NULL,
  target_count INTEGER DEFAULT 1,
  current_count INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 50,
  spores_reward INTEGER DEFAULT 10,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(player_id, challenge_date, challenge_type, challenge_text)
);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_player_date ON daily_challenges(player_id, challenge_date);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);

-- RLS Policies
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own challenges" ON daily_challenges;
CREATE POLICY "Users can view their own challenges"
  ON daily_challenges FOR SELECT
  USING (auth.uid() = player_id);

DROP POLICY IF EXISTS "Users can update their own challenges" ON daily_challenges;
CREATE POLICY "Users can update their own challenges"
  ON daily_challenges FOR UPDATE
  USING (auth.uid() = player_id);

DROP POLICY IF EXISTS "Users can insert their own challenges" ON daily_challenges;
CREATE POLICY "Users can insert their own challenges"
  ON daily_challenges FOR INSERT
  WITH CHECK (auth.uid() = player_id);

-- Add new enum values for game_phase (these need to be committed before being used)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'VISION' AND enumtypid = 'game_phase'::regtype) THEN
    ALTER TYPE game_phase ADD VALUE 'VISION';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'RESEARCH' AND enumtypid = 'game_phase'::regtype) THEN
    ALTER TYPE game_phase ADD VALUE 'RESEARCH';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'PROTOTYPE' AND enumtypid = 'game_phase'::regtype) THEN
    ALTER TYPE game_phase ADD VALUE 'PROTOTYPE';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'BUILD' AND enumtypid = 'game_phase'::regtype) THEN
    ALTER TYPE game_phase ADD VALUE 'BUILD';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'GROW' AND enumtypid = 'game_phase'::regtype) THEN
    ALTER TYPE game_phase ADD VALUE 'GROW';
  END IF;
END $$;