import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, CheckCircle2, Shield, Sparkles } from 'lucide-react';

interface ActivityFeedProps {
  sessionId: string;
}

interface Activity {
  id: string;
  player_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
  player_username?: string;
}

export function ActivityFeed({ sessionId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadActivities();

    const channel = supabase
      .channel(`activity:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'collaboration_activity',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setActivities((prev) => [payload.new as Activity, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const loadActivities = async () => {
    const { data } = await supabase
      .from('collaboration_activity')
      .select(`
        id,
        player_id,
        activity_type,
        activity_data,
        created_at,
        players!inner(username)
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setActivities(
        data.map((a: any) => ({
          ...a,
          player_username: a.players?.username,
        }))
      );
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message_sent':
        return <MessageSquare className="w-4 h-4" />;
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'blocker_resolved':
        return <Shield className="w-4 h-4" />;
      case 'phase_changed':
        return <Sparkles className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getActivityText = (activity: Activity) => {
    const username = activity.player_username || 'Someone';
    switch (activity.activity_type) {
      case 'message_sent':
        return `${username} sent a message`;
      case 'task_completed':
        return `${username} completed a task`;
      case 'blocker_resolved':
        return `${username} resolved a blocker`;
      case 'phase_changed':
        return `${username} changed phase`;
      default:
        return `${username} performed an action`;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No recent activity
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {getActivityIcon(activity.activity_type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{getActivityText(activity)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
