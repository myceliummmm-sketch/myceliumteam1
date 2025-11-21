import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/lib/badgeSystem';

interface PlayerBadge {
  id: string;
  badge_id: string;
  unlocked_at: string;
  milestone_value: number;
}

export function useBadges() {
  const [badges, setBadges] = useState<PlayerBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('player_badges')
        .select('*')
        .eq('player_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockBadge = async (badge: Badge, playerId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('player_badges')
        .insert({
          player_id: playerId,
          badge_id: badge.id,
          milestone_value: badge.unlocksAt
        });

      if (error) {
        // Ignore duplicate badge errors
        if (error.code === '23505') return false;
        throw error;
      }

      await loadBadges();
      return true;
    } catch (error) {
      console.error('Error unlocking badge:', error);
      return false;
    }
  };

  const hasBadge = (badgeId: string): boolean => {
    return badges.some(b => b.badge_id === badgeId);
  };

  return {
    badges,
    loading,
    unlockBadge,
    hasBadge,
    refresh: loadBadges
  };
}
