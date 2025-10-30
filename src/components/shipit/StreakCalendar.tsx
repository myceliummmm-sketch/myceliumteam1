import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { calculateStreak, getNextMilestone, getDaysUntilNextMilestone, STREAK_MILESTONES } from '@/lib/streakSystem';
import { format, subDays, startOfDay } from 'date-fns';

export function StreakCalendar() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [loginDates, setLoginDates] = useState<string[]>([]);
  const [last7Days, setLast7Days] = useState<{ date: Date; hasLogin: boolean }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchLoginData = async () => {
      const { data } = await supabase
        .from('daily_logins')
        .select('login_date')
        .eq('player_id', user.id)
        .order('login_date', { ascending: false })
        .limit(100);

      if (data) {
        const dates = data.map(d => d.login_date);
        setLoginDates(dates);
        
        const currentStreak = calculateStreak(dates);
        setStreak(currentStreak);

        // Generate last 7 days
        const today = startOfDay(new Date());
        const daysData = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(today, 6 - i);
          const dateStr = format(date, 'yyyy-MM-dd');
          return {
            date,
            hasLogin: dates.includes(dateStr)
          };
        });
        setLast7Days(daysData);
      }
    };

    fetchLoginData();
  }, [user]);

  const nextMilestone = getNextMilestone(streak);
  const daysUntilNext = getDaysUntilNextMilestone(streak);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Streak Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-lg">{streak} Day Streak</span>
          </div>
          {streak > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>

        {/* Last 7 Days Calendar */}
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map((day, idx) => (
            <div
              key={idx}
              className={`
                aspect-square rounded-md flex flex-col items-center justify-center text-xs
                ${day.hasLogin 
                  ? 'bg-primary/20 border-2 border-primary' 
                  : 'bg-muted border border-border'}
                ${format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ? 'ring-2 ring-accent'
                  : ''}
              `}
            >
              <div className="text-[10px] text-muted-foreground">
                {format(day.date, 'EEE')}
              </div>
              <div className="font-bold">{format(day.date, 'd')}</div>
              {day.hasLogin && <Flame className="h-3 w-3 text-orange-500" />}
            </div>
          ))}
        </div>

        {/* Next Milestone */}
        {nextMilestone && daysUntilNext !== null && (
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>Next Milestone: {nextMilestone.title}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {daysUntilNext} more {daysUntilNext === 1 ? 'day' : 'days'} to earn +{nextMilestone.reward} Spores
            </div>
          </div>
        )}

        {/* Milestones List */}
        {streak >= 3 && (
          <div className="pt-2 border-t space-y-1">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Milestones Reached</div>
            {STREAK_MILESTONES.filter(m => streak >= m.days).map(milestone => (
              <div key={milestone.days} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <span>{milestone.emoji}</span>
                  <span>{milestone.title}</span>
                </span>
                <Badge variant="outline" className="text-[10px] h-5">
                  +{milestone.reward} Spores
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
