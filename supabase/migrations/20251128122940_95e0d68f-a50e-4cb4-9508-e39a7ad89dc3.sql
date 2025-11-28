-- Clear all user data from tables (order matters due to foreign keys)
TRUNCATE TABLE user_events CASCADE;
TRUNCATE TABLE prompt_usage_history CASCADE;
TRUNCATE TABLE prompt_generations CASCADE;
TRUNCATE TABLE prompt_library CASCADE;
TRUNCATE TABLE collaboration_activity CASCADE;
TRUNCATE TABLE session_collaborators CASCADE;
TRUNCATE TABLE session_invites CASCADE;
TRUNCATE TABLE card_search_history CASCADE;
TRUNCATE TABLE card_generation_events CASCADE;
TRUNCATE TABLE card_evaluations CASCADE;
TRUNCATE TABLE card_duplicates CASCADE;
TRUNCATE TABLE chat_messages CASCADE;
TRUNCATE TABLE blocker_resolutions CASCADE;
TRUNCATE TABLE stage_completions CASCADE;
TRUNCATE TABLE vision_progress CASCADE;
TRUNCATE TABLE dynamic_cards CASCADE;
TRUNCATE TABLE player_artifacts CASCADE;
TRUNCATE TABLE player_badges CASCADE;
TRUNCATE TABLE player_progress CASCADE;
TRUNCATE TABLE daily_logins CASCADE;
TRUNCATE TABLE daily_challenges CASCADE;
TRUNCATE TABLE achievements CASCADE;
TRUNCATE TABLE game_states CASCADE;
TRUNCATE TABLE game_sessions CASCADE;
TRUNCATE TABLE players CASCADE;

-- Add optimized index for future card queries
CREATE INDEX IF NOT EXISTS idx_dynamic_cards_player_archived 
ON dynamic_cards(player_id, is_archived) 
WHERE is_archived = false;