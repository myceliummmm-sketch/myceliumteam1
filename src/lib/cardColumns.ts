/**
 * Column selection for dynamic_cards queries
 * Excludes the 'embedding' column which contains large vectors that cause query timeouts
 */
export const DYNAMIC_CARD_COLUMNS = 'id, player_id, session_id, level, average_score, times_used, last_used_at, is_archived, created_at, updated_at, event_data, auto_generated, last_embedding_update, is_tradable, trade_value, ownership_history, card_type, rarity, title, content, description, created_by_character, contributing_characters, tags, embedding_model, visual_theme, artwork_url, triggered_by_event';
