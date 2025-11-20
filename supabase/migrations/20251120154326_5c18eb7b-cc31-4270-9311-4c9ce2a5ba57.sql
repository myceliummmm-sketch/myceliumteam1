-- Create prompt_generations table for tracking prompt synthesis
CREATE TABLE IF NOT EXISTS public.prompt_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  session_id UUID REFERENCES public.game_sessions(id) ON DELETE SET NULL,
  card_ids UUID[] NOT NULL,
  options JSONB,
  generated_prompt TEXT NOT NULL,
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.prompt_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own prompt generations"
  ON public.prompt_generations
  FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Users can create own prompt generations"
  ON public.prompt_generations
  FOR INSERT
  WITH CHECK (auth.uid() = player_id);

-- Index for performance
CREATE INDEX idx_prompt_generations_player ON public.prompt_generations(player_id, created_at DESC);
CREATE INDEX idx_prompt_generations_session ON public.prompt_generations(session_id);