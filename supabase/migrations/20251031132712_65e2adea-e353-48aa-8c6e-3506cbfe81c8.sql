-- Add suggested_actions column to chat_messages table
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS suggested_actions jsonb;