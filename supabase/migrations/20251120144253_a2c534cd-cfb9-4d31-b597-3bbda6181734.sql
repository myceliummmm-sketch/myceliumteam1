-- Add columns to track auto-generated cards
ALTER TABLE dynamic_cards 
ADD COLUMN IF NOT EXISTS triggered_by_event TEXT,
ADD COLUMN IF NOT EXISTS event_data JSONB,
ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT false;