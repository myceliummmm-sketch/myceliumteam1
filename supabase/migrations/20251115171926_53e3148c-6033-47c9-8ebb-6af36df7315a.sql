-- Backfill existing sessions to add owners as collaborators
INSERT INTO session_collaborators (session_id, player_id, access_level, accepted_at)
SELECT 
  id as session_id,
  player_id,
  'owner'::session_access_level as access_level,
  now() as accepted_at
FROM game_sessions
WHERE NOT EXISTS (
  SELECT 1 FROM session_collaborators 
  WHERE session_collaborators.session_id = game_sessions.id 
  AND session_collaborators.player_id = game_sessions.player_id
);