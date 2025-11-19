-- Add AUTHENTICITY to card_type check constraint
ALTER TABLE dynamic_cards 
DROP CONSTRAINT IF EXISTS dynamic_cards_card_type_check;

ALTER TABLE dynamic_cards
ADD CONSTRAINT dynamic_cards_card_type_check 
CHECK (card_type IN ('IDEA', 'INSIGHT', 'DESIGN', 'CODE', 'GROWTH', 'AUTHENTICITY'));

-- Update level constraint to include level 0 for AUTHENTICITY cards
ALTER TABLE dynamic_cards
DROP CONSTRAINT IF EXISTS dynamic_cards_level_check;

ALTER TABLE dynamic_cards
ADD CONSTRAINT dynamic_cards_level_check
CHECK (level >= 0 AND level <= 5);