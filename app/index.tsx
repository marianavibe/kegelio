import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Logo } from '@/components/Logo';
import { Colors } from '@/constants/Colors';
import { useUserData } from '@/hooks/useUserData';

export default function IndexScreen() {
  const { user, loading } = useUserData();

  useEffect(() => {
    if (!loading) {
      if (user?.hasCompletedOnboarding) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)');
      }
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <Logo size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
});