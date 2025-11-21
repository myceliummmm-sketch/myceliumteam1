-- Create player_badges table for achievement tracking
CREATE TABLE IF NOT EXISTS public.player_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  milestone_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_player_badges_player ON public.player_badges(player_id);
CREATE INDEX IF NOT EXISTS idx_player_badges_badge ON public.player_badges(badge_id);

-- Enable RLS
ALTER TABLE public.player_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own badges"
  ON public.player_badges
  FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Users can insert their own badges"
  ON public.player_badges
  FOR INSERT
  WITH CHECK (auth.uid() = player_id);

-- Prevent duplicate badges
CREATE UNIQUE INDEX IF NOT EXISTS idx_player_badges_unique 
  ON public.player_badges(player_id, badge_id);