-- Add artifact tracking table
CREATE TABLE public.player_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  artifact_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, artifact_id)
);

CREATE INDEX idx_player_artifacts_player ON public.player_artifacts(player_id);

-- RLS policies for player_artifacts
ALTER TABLE public.player_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own artifacts"
ON public.player_artifacts FOR SELECT
USING (player_id = auth.uid());

CREATE POLICY "Users can insert own artifacts"
ON public.player_artifacts FOR INSERT
WITH CHECK (player_id = auth.uid());

-- Add boss blocker tracking column to game_states
ALTER TABLE public.game_states
ADD COLUMN boss_blockers_defeated JSONB DEFAULT '[]'::jsonb;

-- Track blocker resolutions
CREATE TABLE public.blocker_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  blocker_id TEXT NOT NULL,
  blocker_type TEXT NOT NULL,
  boss_name TEXT,
  resolved_at TIMESTAMPTZ DEFAULT NOW(),
  xp_rewarded INTEGER,
  spores_rewarded INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blocker_resolutions_player ON public.blocker_resolutions(player_id);
CREATE INDEX idx_blocker_resolutions_session ON public.blocker_resolutions(session_id);

-- RLS policies for blocker_resolutions
ALTER TABLE public.blocker_resolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blocker resolutions"
ON public.blocker_resolutions FOR SELECT
USING (player_id = auth.uid());

CREATE POLICY "Users can insert own blocker resolutions"
ON public.blocker_resolutions FOR INSERT
WITH CHECK (player_id = auth.uid());