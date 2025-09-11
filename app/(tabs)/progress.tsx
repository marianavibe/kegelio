import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Trophy, Flame, Target } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useUserData } from '@/hooks/useUserData';

export default function ProgressScreen() {
  const { user, sessions } = useUserData();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getSessionsForDate = (date: string) => {
    return sessions.filter(session => 
      session.date.startsWith(date)
    ).length;
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const sessionCount = getSessionsForDate(dateStr);
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = dateStr === today.toISOString().split('T')[0];
      
      days.push({
        date: new Date(date),
        dateStr,
        sessionCount,
        isCurrentMonth,
        isToday,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const unlockedBadges = user?.badges.filter(badge => badge.unlocked) || [];
  const lockedBadges = user?.badges.filter(badge => !badge.unlocked) || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Keep up the great work!</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Target color={Colors.primary} size={24} />
            </View>
            <Text style={styles.statNumber}>{user?.totalSessions || 0}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Flame color={Colors.warning} size={24} />
            </View>
            <Text style={styles.statNumber}>{user?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Trophy color={Colors.success} size={24} />
            </View>
            <Text style={styles.statNumber}>{unlockedBadges.length}</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>
            {currentMonth} {currentYear}
          </Text>
          
          <View style={styles.weekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendar}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  !day.isCurrentMonth && styles.inactiveDay,
                  day.isToday && styles.today,
                  day.sessionCount > 0 && styles.completedDay,
                ]}
                onPress={() => setSelectedDate(day.dateStr)}
              >
                <Text style={[
                  styles.calendarDayText,
                  !day.isCurrentMonth && styles.inactiveDayText,
                  day.isToday && styles.todayText,
                  day.sessionCount > 0 && styles.completedDayText,
                ]}>
                  {day.date.getDate()}
                </Text>
                {day.sessionCount > 0 && (
                  <View style={styles.sessionIndicator}>
                    <Text style={styles.sessionCount}>{day.sessionCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {unlockedBadges.length > 0 && (
          <View style={styles.badgesContainer}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.badgesList}>
                {unlockedBadges.map((badge) => (
                  <View key={badge.id} style={[styles.badge, styles.unlockedBadge]}>
                    <Trophy color={Colors.warning} size={24} />
                    <Text style={styles.badgeName}>{badge.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  calendarContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textLight,
    paddingVertical: 8,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  calendarDayText: {
    fontSize: 16,
    color: Colors.text,
  },
  inactiveDay: {
    opacity: 0.3,
  },
  inactiveDayText: {
    color: Colors.textMuted,
  },
  today: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  todayText: {
    color: Colors.white,
    fontWeight: '600',
  },
  completedDay: {
    backgroundColor: Colors.success,
    borderRadius: 20,
  },
  completedDayText: {
    color: Colors.white,
    fontWeight: '600',
  },
  sessionIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionCount: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  badgesContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  badgesList: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  unlockedBadge: {
    backgroundColor: Colors.background,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
});