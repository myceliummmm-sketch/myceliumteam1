-- Add TEAM_PERSPECTIVE to the allowed card types, including all existing types
ALTER TABLE dynamic_cards 
DROP CONSTRAINT IF EXISTS dynamic_cards_card_type_check;

ALTER TABLE dynamic_cards 
ADD CONSTRAINT dynamic_cards_card_type_check 
CHECK (card_type IN (
  'VISION', 
  'INSIGHT', 
  'DECISION', 
  'TASK', 
  'BLOCKER', 
  'MILESTONE', 
  'TEAM_PERSPECTIVE', 
  'RAW_RESEARCH',
  'RESEARCH_INSIGHT',
  'AUTHENTICITY',
  'CODE',
  'DESIGN',
  'IDEA'
));