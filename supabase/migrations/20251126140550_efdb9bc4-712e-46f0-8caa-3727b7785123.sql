-- Add marketplace fields to dynamic_cards table
ALTER TABLE dynamic_cards 
ADD COLUMN IF NOT EXISTS is_tradable boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trade_value integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS ownership_history jsonb DEFAULT '[]'::jsonb;

-- Add index for marketplace queries
CREATE INDEX IF NOT EXISTS idx_dynamic_cards_tradable ON dynamic_cards(is_tradable) WHERE is_tradable = true;

-- Add RLS policy for viewing tradable cards
CREATE POLICY "Anyone can view tradable cards"
ON dynamic_cards FOR SELECT
USING (is_tradable = true OR player_id = auth.uid());