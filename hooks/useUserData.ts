import { useState, useEffect } from 'react';
import { User, SessionData } from '@/types';
import { getUser, saveUser, getSessions, saveSessions } from '@/services/storage';

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUser();
      const sessionsData = await getSessions();
      setUser(userData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      await saveUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const addSession = async (session: SessionData) => {
    try {
      const updatedSessions = [...sessions, session];
      await saveSessions(updatedSessions);
      setSessions(updatedSessions);
      
      // Update user stats
      if (user) {
        const updatedUser = {
          ...user,
          totalSessions: user.totalSessions + 1,
          sessionsThisWeek: user.sessionsThisWeek + 1,
        };
        await updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  return {
    user,
    sessions,
    loading,
    updateUser,
    addSession,
    loadData,
  };
};