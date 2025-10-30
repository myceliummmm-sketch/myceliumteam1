-- Add energy regeneration tracking
ALTER TABLE public.game_states ADD COLUMN IF NOT EXISTS last_energy_update TIMESTAMPTZ DEFAULT NOW();

-- Add last login tracking
ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ DEFAULT NOW();

-- Create daily logins table for streak tracking
CREATE TABLE IF NOT EXISTS public.daily_logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, login_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_logins_player ON public.daily_logins(player_id, login_date DESC);

-- Enable RLS on daily_logins
ALTER TABLE public.daily_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logins" ON public.daily_logins 
  FOR SELECT 
  USING (auth.uid() = player_id);

CREATE POLICY "Users can insert own logins" ON public.daily_logins 
  FOR INSERT 
  WITH CHECK (auth.uid() = player_id);

-- Create player progress table for tutorial tracking
CREATE TABLE IF NOT EXISTS public.player_progress (
  player_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  has_completed_tutorial BOOLEAN DEFAULT FALSE,
  tutorial_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on player_progress
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own progress" ON public.player_progress 
  FOR SELECT 
  USING (auth.uid() = player_id);

CREATE POLICY "Users update own progress" ON public.player_progress 
  FOR UPDATE 
  USING (auth.uid() = player_id);

CREATE POLICY "Users insert own progress" ON public.player_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = player_id);

-- Add trigger for updated_at on player_progress
CREATE TRIGGER update_player_progress_updated_at
  BEFORE UPDATE ON public.player_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();