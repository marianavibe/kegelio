import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Play, Pause, Square } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { CircularTimer } from '@/components/CircularTimer';
import { Logo } from '@/components/Logo';
import { Colors } from '@/constants/Colors';
import { useUserData } from '@/hooks/useUserData';
import { ExerciseSettings, SessionData } from '@/types';

type Phase = 'squeeze' | 'hold' | 'release' | 'rest';

export default function ExerciseScreen() {
  const { user, addSession } = useUserData();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('squeeze');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [progress, setProgress] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const [settings] = useState<ExerciseSettings>({
    squeezeTime: 5,
    holdTime: 5,
    releaseTime: 5,
    restTime: 3,
    cycles: 10,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<Date | null>(null);

  const triggerHapticFeedback = (phase: Phase) => {
    if (Platform.OS !== 'web') {
      switch (phase) {
        case 'squeeze':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'hold':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'release':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'rest':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
      }
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Calculate what the next phase will be
            let nextPhase: Phase;
            switch (currentPhase) {
              case 'squeeze':
                nextPhase = 'hold';
                break;
              case 'hold':
                nextPhase = 'release';
                break;
              case 'release':
                if (currentCycle < settings.cycles) {
                  nextPhase = 'rest';
                } else {
                  // Session complete, don't change phase
                  nextPhase = currentPhase;
                }
                break;
              case 'rest':
                nextPhase = 'squeeze';
                break;
            }

            moveToNextPhase();
            
            // Return the correct time for the next phase
            switch (nextPhase) {
              case 'squeeze':
                return 5;
              case 'hold':
                return 5;
              case 'release':
                return 5;
              case 'rest':
                return 3;
              default:
                return 5;
            }
          }
          return prev - 1;
        });

        setProgress((prev) => {
          const phaseTime = getCurrentPhaseTime();
          return prev + (1 / phaseTime);
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, currentPhase, currentCycle]);

  const getCurrentPhaseTime = () => {
    switch (currentPhase) {
      case 'squeeze':
        return 5;
      case 'hold':
        return 5;
      case 'release':
        return 5;
      case 'rest':
        return 3;
    }
  };

  const moveToNextPhase = () => {
    let nextPhase: Phase;
    switch (currentPhase) {
      case 'squeeze':
        nextPhase = 'hold';
        setCurrentPhase(nextPhase);
        break;
      case 'hold':
        nextPhase = 'release';
        setCurrentPhase(nextPhase);
        break;
      case 'release':
        if (currentCycle < settings.cycles) {
          nextPhase = 'rest';
          setCurrentPhase(nextPhase);
        } else {
          if (!sessionCompleted) {
            setSessionCompleted(true);
            completeSession();
            setIsActive(false);
            return;
          }
        }
        break;
      case 'rest':
        setCurrentCycle((prev) => prev + 1);
        nextPhase = 'squeeze';
        setCurrentPhase(nextPhase);
        break;
    }
    
    // Trigger haptic feedback for the new phase
    if (nextPhase!) {
      triggerHapticFeedback(nextPhase);
    }
    
    setProgress(0);
  };

  const startSession = () => {
    setIsActive(true);
    setSessionStarted(true);
    sessionStartTime.current = new Date();
    setTimeRemaining(getCurrentPhaseTime());
    setProgress(0);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const stopSession = () => {
    if (sessionStarted && currentCycle > 1) {
      Alert.alert(
        'Incomplete Session',
        'This session won\'t be counted toward your progress since it wasn\'t completed. Are you sure you want to stop?',
        [
          { text: 'Continue', style: 'cancel' },
          { text: 'Stop', style: 'destructive', onPress: resetSession },
        ]
      );
    } else {
      resetSession();
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentPhase('squeeze');
    setCurrentCycle(1);
    setTimeRemaining(settings.squeezeTime);
    setProgress(0);
    setSessionStarted(false);
    setSessionCompleted(false);
    sessionStartTime.current = null;
  };

  const completeSession = async () => {
    if (sessionStartTime.current && user) {
      const sessionData: SessionData = {
        date: new Date().toISOString(),
        duration: Math.round((new Date().getTime() - sessionStartTime.current.getTime()) / 1000),
        squeezeTime: settings.squeezeTime,
        holdTime: settings.holdTime,
        releaseTime: settings.releaseTime,
        restTime: settings.restTime,
        cycles: settings.cycles,
      };

      await addSession(sessionData);
    }

    Alert.alert(
      'Session Complete!',
      'Congratulations! You\'ve completed your Kegel exercise session.',
      [{ text: 'Great!', onPress: () => {
        setSessionCompleted(false);
        resetSession();
      }}]
    );
  };

  const handleSettingsPress = () => {
    router.push('/(onboarding)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo size="small" />
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <Text style={styles.introText}>Intro</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.cycleText}>
          Cycle {currentCycle} of {settings.cycles}
        </Text>

        <CircularTimer
          phase={currentPhase}
          progress={progress}
          timeRemaining={timeRemaining}
          isActive={isActive}
        />

        <Text style={styles.instructionText}>
          {currentPhase === 'squeeze' && 'Contract your pelvic floor muscles'}
          {currentPhase === 'hold' && 'Keep those muscles tight'}
          {currentPhase === 'release' && 'Slowly relax your muscles'}
          {currentPhase === 'rest' && 'Take a moment to rest'}
        </Text>
      </View>

      <View style={styles.controls}>
        {!isActive ? (
          <TouchableOpacity style={styles.startButton} onPress={startSession}>
            <Play color={Colors.white} size={32} fill={Colors.white} />
            <Text style={styles.startButtonText}>Start Exercise</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.activeControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.pauseButton]}
              onPress={pauseSession}
            >
              {isPaused ? (
                <Play color={Colors.white} size={24} fill={Colors.white} />
              ) : (
                <Pause color={Colors.white} size={24} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={stopSession}
            >
              <Square color={Colors.white} size={24} fill={Colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  settingsButton: {
    padding: 8,
  },
  introText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cycleText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    backgroundColor: Colors.primary,
  },
  stopButton: {
    backgroundColor: Colors.textMuted,
  },
});