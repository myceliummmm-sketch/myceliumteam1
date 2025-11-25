-- Add artwork_url column to dynamic_cards table
ALTER TABLE dynamic_cards 
ADD COLUMN IF NOT EXISTS artwork_url TEXT;