-- Create prompt_library table
CREATE TABLE IF NOT EXISTS prompt_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id) ON DELETE SET NULL,
  
  -- Prompt metadata
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  phase game_phase,
  
  -- Version tracking
  version INTEGER NOT NULL DEFAULT 1,
  parent_prompt_id UUID REFERENCES prompt_library(id) ON DELETE SET NULL,
  is_template BOOLEAN DEFAULT false,
  
  -- Prompt content
  prompt_text TEXT NOT NULL,
  prompt_variables JSONB DEFAULT '[]'::jsonb,
  
  -- Collaboration metadata
  created_by_character TEXT,
  contributing_characters TEXT[],
  
  -- Usage tracking
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  
  -- Organization
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create prompt_usage_history table
CREATE TABLE IF NOT EXISTS prompt_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES prompt_library(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT now(),
  context TEXT,
  was_helpful BOOLEAN,
  feedback_notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompt_library_player ON prompt_library(player_id);
CREATE INDEX IF NOT EXISTS idx_prompt_library_category ON prompt_library(category);
CREATE INDEX IF NOT EXISTS idx_prompt_library_phase ON prompt_library(phase);
CREATE INDEX IF NOT EXISTS idx_prompt_usage_prompt ON prompt_usage_history(prompt_id);

-- Enable RLS
ALTER TABLE prompt_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_usage_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompt_library
CREATE POLICY "Users can view own prompts or templates"
  ON prompt_library FOR SELECT
  USING (player_id = auth.uid() OR is_template = true);

CREATE POLICY "Users can create own prompts"
  ON prompt_library FOR INSERT
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Users can update own prompts"
  ON prompt_library FOR UPDATE
  USING (player_id = auth.uid());

CREATE POLICY "Users can delete own prompts"
  ON prompt_library FOR DELETE
  USING (player_id = auth.uid() AND is_template = false);

-- RLS Policies for prompt_usage_history
CREATE POLICY "Users can view own usage history"
  ON prompt_usage_history FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Users can create own usage history"
  ON prompt_usage_history FOR INSERT
  WITH CHECK (player_id = auth.uid());