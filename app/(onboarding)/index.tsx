import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Heart, Target, Calendar, Award } from 'lucide-react-native';
import { Logo } from '@/components/Logo';
import { OnboardingStep } from '@/components/OnboardingStep';
import { Colors } from '@/constants/Colors';
import { useUserData } from '@/hooks/useUserData';

const { width } = Dimensions.get('window');

const onboardingSteps = [
  {
    title: 'Welcome to Kegelio',
    description: 'Your personal guide to pelvic floor strength and wellness. Let\'s begin this empowering journey together.',
    icon: <Heart color={Colors.primary} size={48} fill={Colors.primary} />,
  },
  {
    title: 'Strengthen Your Core',
    description: 'Kegel exercises target your pelvic floor muscles, improving bladder control and core stability.',
    icon: <Target color={Colors.primary} size={48} />,
  },
  {
    title: 'Track Your Progress',
    description: 'Build healthy habits with our intuitive tracking system. See your streaks grow and celebrate milestones.',
    icon: <Calendar color={Colors.primary} size={48} />,
  },
  {
    title: 'Earn Achievements',
    description: 'Unlock badges as you reach your goals. Every session counts toward a stronger, healthier you.',
    icon: <Award color={Colors.primary} size={48} />,
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { user, updateUser } = useUserData();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({ x: nextStep * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    if (user) {
      await updateUser({ ...user, hasCompletedOnboarding: true });
    }
    router.replace('/(tabs)');
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const step = Math.round(contentOffsetX / width);
    setCurrentStep(step);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo size="medium" />
        {currentStep < onboardingSteps.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {onboardingSteps.map((step, index) => (
          <OnboardingStep
            key={index}
            title={step.title}
            description={step.description}
            icon={step.icon}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.indicators}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { backgroundColor: index === currentStep ? Colors.primary : Colors.border }
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
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
  skipText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});