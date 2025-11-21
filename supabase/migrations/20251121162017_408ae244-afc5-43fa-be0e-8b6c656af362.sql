-- Create vision_progress table for tracking VISION phase sub-stages
CREATE TABLE IF NOT EXISTS public.vision_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  sub_stage_number INTEGER NOT NULL CHECK (sub_stage_number BETWEEN 1 AND 4),
  template_id TEXT NOT NULL,
  filled_values JSONB NOT NULL DEFAULT '{}'::jsonb,
  card_id UUID REFERENCES public.dynamic_cards(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, session_id, sub_stage_number)
);

-- Create index for faster lookups
CREATE INDEX idx_vision_progress_player_session ON public.vision_progress(player_id, session_id);
CREATE INDEX idx_vision_progress_stage ON public.vision_progress(player_id, session_id, sub_stage_number);

-- Enable RLS
ALTER TABLE public.vision_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own vision progress"
  ON public.vision_progress FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Users can create their own vision progress"
  ON public.vision_progress FOR INSERT
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Users can update their own vision progress"
  ON public.vision_progress FOR UPDATE
  USING (auth.uid() = player_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_vision_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vision_progress_updated_at
  BEFORE UPDATE ON public.vision_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_vision_progress_updated_at();