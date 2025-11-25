-- Enable pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to dynamic_cards table
ALTER TABLE dynamic_cards 
ADD COLUMN IF NOT EXISTS embedding vector(384),
ADD COLUMN IF NOT EXISTS last_embedding_update timestamp with time zone,
ADD COLUMN IF NOT EXISTS embedding_model text DEFAULT 'text-embedding-3-small';

-- Create index for fast vector similarity searches
CREATE INDEX IF NOT EXISTS dynamic_cards_embedding_idx ON dynamic_cards 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Table for duplicate detection results
CREATE TABLE IF NOT EXISTS card_duplicates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id_1 uuid REFERENCES dynamic_cards(id) ON DELETE CASCADE,
  card_id_2 uuid REFERENCES dynamic_cards(id) ON DELETE CASCADE,
  similarity_score real NOT NULL,
  status text DEFAULT 'pending',
  detected_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid REFERENCES players(id),
  CONSTRAINT unique_card_pair UNIQUE(card_id_1, card_id_2)
);

-- RLS policies for card_duplicates
ALTER TABLE card_duplicates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their card duplicates" ON card_duplicates
  FOR SELECT USING (
    card_id_1 IN (SELECT id FROM dynamic_cards WHERE player_id = auth.uid())
  );

CREATE POLICY "Users can update their duplicate status" ON card_duplicates
  FOR UPDATE USING (
    card_id_1 IN (SELECT id FROM dynamic_cards WHERE player_id = auth.uid())
  );

CREATE POLICY "System can insert duplicates" ON card_duplicates
  FOR INSERT WITH CHECK (true);

-- Table for search history
CREATE TABLE IF NOT EXISTS card_search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  session_id uuid REFERENCES game_sessions(id) ON DELETE SET NULL,
  query text NOT NULL,
  query_embedding vector(384),
  results_count integer,
  clicked_card_ids uuid[],
  search_type text,
  context jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS policies for card_search_history
ALTER TABLE card_search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search history" ON card_search_history
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Users can insert own search history" ON card_search_history
  FOR INSERT WITH CHECK (auth.uid() = player_id);