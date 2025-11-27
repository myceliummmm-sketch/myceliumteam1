-- Drop the IVFFlat index on dynamic_cards.embedding column
-- This index is causing severe performance issues:
-- - INSERT operations timeout when adding new cards
-- - UPDATE operations timeout when adding embeddings
-- - The index rebuild is expensive with 1536-dimension vectors
-- 
-- Semantic search will still work but will use sequential scan
-- which is acceptable for the current ~330 cards

DROP INDEX IF EXISTS dynamic_cards_embedding_idx;

-- Optional: If semantic search becomes slow in the future,
-- we can recreate the index with better parameters:
-- CREATE INDEX dynamic_cards_embedding_idx ON dynamic_cards 
-- USING ivfflat (embedding vector_cosine_ops) 
-- WITH (lists = 10);
