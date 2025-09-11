import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SessionData } from '@/types';
import { AVAILABLE_BADGES } from '@/constants/Badges';

const USER_KEY = 'kegelio_user';
const SESSIONS_KEY = 'kegelio_sessions';

export const getUser = async (): Promise<User> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
    return {
      hasCompletedOnboarding: false,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      badges: [...AVAILABLE_BADGES],
      sessionsThisWeek: 0,
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return {
      hasCompletedOnboarding: false,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      badges: [...AVAILABLE_BADGES],
      sessionsThisWeek: 0,
    };
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getSessions = async (): Promise<SessionData[]> => {
  try {
    const sessionsData = await AsyncStorage.getItem(SESSIONS_KEY);
    return sessionsData ? JSON.parse(sessionsData) : [];
  } catch (error) {
    console.error('Error getting sessions data:', error);
    return [];
  }
};

export const saveSessions = async (sessions: SessionData[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving sessions data:', error);
  }
};