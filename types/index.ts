export interface User {
  hasCompletedOnboarding: boolean;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  sessionsThisWeek: number;
}

export interface SessionData {
  date: string;
  duration: number;
  squeezeTime: number;
  holdTime: number;
  releaseTime: number;
  restTime: number;
  cycles: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ExerciseSettings {
  squeezeTime: number;
  holdTime: number;
  releaseTime: number;
  restTime: number;
  cycles: number;
}