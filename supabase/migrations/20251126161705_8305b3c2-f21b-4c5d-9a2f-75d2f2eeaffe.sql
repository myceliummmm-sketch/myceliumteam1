-- Add RAW_RESEARCH and RESEARCH_INSIGHT to allowed card types
ALTER TABLE dynamic_cards DROP CONSTRAINT IF EXISTS dynamic_cards_card_type_check;

ALTER TABLE dynamic_cards ADD CONSTRAINT dynamic_cards_card_type_check 
CHECK (card_type IN (
  'IDEA',
  'INSIGHT',
  'RESEARCH_INSIGHT',
  'RAW_RESEARCH',
  'AUTHENTICITY',
  'CODE',
  'DESIGN',
  'BLOCKER',
  'MILESTONE',
  'RESOURCE',
  'DECISION',
  'QUESTION',
  'ACTION',
  'LEARNING'
));