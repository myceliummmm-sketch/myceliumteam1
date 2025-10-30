import { differenceInDays, startOfDay } from 'date-fns';

export interface StreakMilestone {
  days: number;
  title: string;
  reward: number;
  emoji: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, title: '3-Day Streak', reward: 10, emoji: '🔥' },
  { days: 7, title: '1-Week Streak', reward: 25, emoji: '🔥🔥' },
  { days: 14, title: '2-Week Streak', reward: 50, emoji: '⚡' },
  { days: 30, title: '1-Month Streak', reward: 100, emoji: '💎' },
  { days: 60, title: '2-Month Streak', reward: 200, emoji: '👑' },
  { days: 100, title: '100-Day Legend', reward: 500, emoji: '🏆' },
];

export function calculateStreak(loginDates: string[]): number {
  if (loginDates.length === 0) return 0;

  // Sort dates descending (most recent first)
  const sortedDates = loginDates
    .map(d => startOfDay(new Date(d)))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = startOfDay(new Date());
  let streak = 0;

  // Check if player logged in today or yesterday
  const daysSinceLastLogin = differenceInDays(today, sortedDates[0]);
  if (daysSinceLastLogin > 1) {
    // Streak broken
    return 0;
  }

  // Count consecutive days
  let expectedDate = today;
  for (const loginDate of sortedDates) {
    const diff = differenceInDays(expectedDate, loginDate);
    
    if (diff === 0) {
      streak++;
      expectedDate = new Date(expectedDate.getTime() - 24 * 60 * 60 * 1000);
    } else if (diff === 1) {
      // Skip today if we're counting from yesterday
      expectedDate = loginDate;
    } else {
      break;
    }
  }

  return streak;
}

export function getStreakMilestone(streak: number): StreakMilestone | null {
  // Find the highest milestone reached
  const reached = STREAK_MILESTONES.filter(m => m.days === streak);
  return reached.length > 0 ? reached[0] : null;
}

export function getNextMilestone(streak: number): StreakMilestone | null {
  const next = STREAK_MILESTONES.find(m => m.days > streak);
  return next || null;
}

export function getDaysUntilNextMilestone(streak: number): number | null {
  const next = getNextMilestone(streak);
  return next ? next.days - streak : null;
}
