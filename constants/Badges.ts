import { Badge } from '@/types';

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first-session',
    name: 'First Steps',
    description: 'Complete your first session',
    icon: 'star',
    unlocked: false,
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Complete 7 sessions in a week',
    icon: 'calendar-check',
    unlocked: false,
  },
  {
    id: 'consistency-queen',
    name: 'Consistency Queen',
    description: 'Maintain a 7-day streak',
    icon: 'crown',
    unlocked: false,
  },
  {
    id: 'milestone-master',
    name: 'Milestone Master',
    description: 'Complete 50 total sessions',
    icon: 'trophy',
    unlocked: false,
  },
  {
    id: 'dedication-diva',
    name: 'Dedication Diva',
    description: 'Maintain a 30-day streak',
    icon: 'flame',
    unlocked: false,
  },
];