-- Phase 1: Dynamic Card System Tables

-- Table for storing generated cards
CREATE TABLE dynamic_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  
  -- Card Classification
  card_type TEXT NOT NULL CHECK (card_type IN ('IDEA', 'INSIGHT', 'DESIGN', 'CODE', 'GROWTH')),
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  
  -- Card Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  
  -- AI Attribution
  created_by_character TEXT,
  contributing_characters TEXT[],
  
  -- Card Metadata
  tags TEXT[],
  average_score DECIMAL(3,1),
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Visual
  visual_theme TEXT DEFAULT 'cyan',
  
  -- Status
  is_archived BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for tracking card evaluation scores (5 factors per card)
CREATE TABLE card_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES dynamic_cards(id) ON DELETE CASCADE,
  
  -- 5 Factor Scores (1-10)
  factor_1_name TEXT NOT NULL,
  factor_1_score INTEGER NOT NULL CHECK (factor_1_score >= 1 AND factor_1_score <= 10),
  factor_1_explanation TEXT,
  
  factor_2_name TEXT NOT NULL,
  factor_2_score INTEGER NOT NULL CHECK (factor_2_score >= 1 AND factor_2_score <= 10),
  factor_2_explanation TEXT,
  
  factor_3_name TEXT NOT NULL,
  factor_3_score INTEGER NOT NULL CHECK (factor_3_score >= 1 AND factor_3_score <= 10),
  factor_3_explanation TEXT,
  
  factor_4_name TEXT NOT NULL,
  factor_4_score INTEGER NOT NULL CHECK (factor_4_score >= 1 AND factor_4_score <= 10),
  factor_4_explanation TEXT,
  
  factor_5_name TEXT NOT NULL,
  factor_5_score INTEGER NOT NULL CHECK (factor_5_score >= 1 AND factor_5_score <= 10),
  factor_5_explanation TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for tracking card generation events
CREATE TABLE card_generation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES dynamic_cards(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  
  -- Generation Context
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('automatic', 'manual', 'milestone')),
  conversation_context JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_dynamic_cards_player ON dynamic_cards(player_id, created_at DESC);
CREATE INDEX idx_dynamic_cards_session ON dynamic_cards(session_id);
CREATE INDEX idx_dynamic_cards_type ON dynamic_cards(card_type);
CREATE INDEX idx_dynamic_cards_level ON dynamic_cards(level);
CREATE INDEX idx_dynamic_cards_rarity ON dynamic_cards(rarity);
CREATE INDEX idx_card_evaluations_card ON card_evaluations(card_id);
CREATE INDEX idx_card_generation_events_card ON card_generation_events(card_id);

-- RLS Policies for dynamic_cards
ALTER TABLE dynamic_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cards"
  ON dynamic_cards FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Users can create own cards"
  ON dynamic_cards FOR INSERT
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Users can update own cards"
  ON dynamic_cards FOR UPDATE
  USING (player_id = auth.uid());

CREATE POLICY "Users can delete own cards"
  ON dynamic_cards FOR DELETE
  USING (player_id = auth.uid());

-- RLS Policies for card_evaluations
ALTER TABLE card_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evaluations for their cards"
  ON card_evaluations FOR SELECT
  USING (card_id IN (SELECT id FROM dynamic_cards WHERE player_id = auth.uid()));

CREATE POLICY "Users can create evaluations for their cards"
  ON card_evaluations FOR INSERT
  WITH CHECK (card_id IN (SELECT id FROM dynamic_cards WHERE player_id = auth.uid()));

-- RLS Policies for card_generation_events
ALTER TABLE card_generation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own card generation events"
  ON card_generation_events FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Users can create own card generation events"
  ON card_generation_events FOR INSERT
  WITH CHECK (player_id = auth.uid());

-- Function to update updated_at timestamp
CREATE TRIGGER update_dynamic_cards_updated_at
  BEFORE UPDATE ON dynamic_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();