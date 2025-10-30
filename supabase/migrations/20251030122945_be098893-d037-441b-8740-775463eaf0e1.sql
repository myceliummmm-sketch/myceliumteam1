-- Create enum for game phases
CREATE TYPE public.game_phase AS ENUM ('INCEPTION', 'RESEARCH', 'DESIGN', 'BUILD', 'TEST', 'SHIP');

-- Players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own player data"
ON public.players FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own player data"
ON public.players FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Game sessions table
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  current_phase game_phase DEFAULT 'INCEPTION',
  final_xp INTEGER DEFAULT 0,
  final_level INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
ON public.game_sessions FOR SELECT
TO authenticated
USING (player_id = auth.uid());

CREATE POLICY "Users can create own sessions"
ON public.game_sessions FOR INSERT
TO authenticated
WITH CHECK (player_id = auth.uid());

CREATE POLICY "Users can update own sessions"
ON public.game_sessions FOR UPDATE
TO authenticated
USING (player_id = auth.uid());

-- Game states table (snapshots)
CREATE TABLE public.game_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  spores INTEGER DEFAULT 0,
  energy INTEGER DEFAULT 10,
  streak INTEGER DEFAULT 0,
  code_health INTEGER DEFAULT 100,
  current_phase game_phase DEFAULT 'INCEPTION',
  completed_tasks JSONB DEFAULT '[]',
  current_tasks JSONB DEFAULT '[]',
  blockers JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  team_mood JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.game_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game states"
ON public.game_states FOR SELECT
TO authenticated
USING (session_id IN (SELECT id FROM public.game_sessions WHERE player_id = auth.uid()));

CREATE POLICY "Users can create own game states"
ON public.game_states FOR INSERT
TO authenticated
WITH CHECK (session_id IN (SELECT id FROM public.game_sessions WHERE player_id = auth.uid()));

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  game_events JSONB DEFAULT '[]',
  segments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (session_id IN (SELECT id FROM public.game_sessions WHERE player_id = auth.uid()));

CREATE POLICY "Users can create own messages"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (session_id IN (SELECT id FROM public.game_sessions WHERE player_id = auth.uid()));

-- Achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_data JSONB,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
ON public.achievements FOR SELECT
TO authenticated
USING (player_id = auth.uid());

CREATE POLICY "Users can create own achievements"
ON public.achievements FOR INSERT
TO authenticated
WITH CHECK (player_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for players table
CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create player profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.players (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create player on auth signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();