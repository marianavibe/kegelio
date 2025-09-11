import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface CircularTimerProps {
  phase: 'squeeze' | 'hold' | 'release' | 'rest';
  progress: number;
  timeRemaining: number;
  isActive: boolean;
}

export function CircularTimer({ phase, progress, timeRemaining, isActive }: CircularTimerProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!isActive) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    const getPhaseDuration = () => {
      switch (phase) {
        case 'squeeze':
          return 5000; // 5 seconds
        case 'hold':
          return 5000; // 5 seconds
        case 'release':
          return 5000; // 5 seconds
        case 'rest':
          return 3000; // 3 seconds
        default:
          return 5000;
      }
    };

    const duration = getPhaseDuration();

    switch (phase) {
      case 'squeeze':
        // Slowly shrink to 70% over 5 seconds
        scale.value = withTiming(0.7, {
          duration,
          easing: Easing.out(Easing.quad),
        });
        opacity.value = withTiming(1, { duration: 200 });
        break;
      case 'hold':
        // Stay at 70% for 5 seconds
        scale.value = withTiming(0.7, { duration: 100 });
        opacity.value = withTiming(1, { duration: 200 });
        break;
      case 'release':
        // Slowly expand back to 100% over 5 seconds
        scale.value = withTiming(1, {
          duration,
          easing: Easing.out(Easing.quad),
        });
        opacity.value = withTiming(1, { duration: 200 });
        break;
      case 'rest':
        // Stay at 100% with reduced opacity for 3 seconds
        scale.value = withTiming(1, { duration: 100 });
        opacity.value = withTiming(0.6, { duration: 200 });
        break;
    }
  }, [phase, isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const getPhaseText = () => {
    switch (phase) {
      case 'squeeze':
        return 'Squeeze';
      case 'hold':
        return 'Hold';
      case 'release':
        return 'Release';
      case 'rest':
        return 'Rest';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'squeeze':
        return Colors.primary;
      case 'hold':
        return Colors.primaryDark;
      case 'release':
        return Colors.primary;
      case 'rest':
        return Colors.textMuted;
      default:
        return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle, { borderColor: getPhaseColor() }]}>
        <Text style={[styles.phaseText, { color: getPhaseColor() }]}>{getPhaseText()}</Text>
        <Text style={[styles.timeText, { color: getPhaseColor() }]}>{timeRemaining}s</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  phaseText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '700',
  },
});