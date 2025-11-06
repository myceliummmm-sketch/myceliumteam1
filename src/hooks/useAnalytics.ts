import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/stores/gameStore';
import { supabase } from '@/integrations/supabase/client';

export type EventCategory = 'gameplay' | 'navigation' | 'social' | 'auth' | 'tutorial';

export function useAnalytics() {
  const { user } = useAuth();
  const sessionId = useGameStore((state) => state.sessionId);

  const trackEvent = async (
    eventType: string,
    eventCategory: EventCategory,
    eventData?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await supabase.from('user_events').insert({
        player_id: user.id,
        session_id: sessionId,
        event_type: eventType,
        event_category: eventCategory,
        event_data: eventData || null,
        page_url: window.location.pathname
      });
    } catch (error) {
      // Silently fail to not disrupt user experience
      console.error('Analytics tracking error:', error);
    }
  };

  return { trackEvent };
}
