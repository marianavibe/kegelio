import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Shield, Sparkles, Target } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const InfoCard = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardIcon}>
        {icon}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardContent}>{content}</Text>
  </View>
);

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Learn About Kegels</Text>
          <Text style={styles.subtitle}>Knowledge is power for your pelvic floor health</Text>
        </View>

        <InfoCard
          icon={<Heart color={Colors.primary} size={24} fill={Colors.primary} />}
          title="What are Kegel Exercises?"
          content="Kegel exercises strengthen the pelvic floor muscles, which support your bladder, bowel, and uterus. These muscles form a 'hammock' that holds your pelvic organs in place."
        />

        <InfoCard
          icon={<Target color={Colors.primary} size={24} />}
          title="How to Do Kegels Correctly"
          content="Contract your pelvic floor muscles as if you're stopping the flow of urine. Hold for 3-5 seconds, then relax for 3-5 seconds. Focus on tightening only the pelvic floor muscles, not your buttocks, thighs, or abs."
        />

        <InfoCard
          icon={<Sparkles color={Colors.success} size={24} />}
          title="Benefits of Regular Practice"
          content="Regular Kegel exercises can improve bladder control, reduce pelvic organ prolapse risk, enhance sexual health, and support faster recovery after childbirth. Consistency is key to seeing results."
        />

        <InfoCard
          icon={<Shield color={Colors.primary} size={24} />}
          title="When to Expect Results"
          content="Most women notice improvements in bladder control within 3-6 weeks of regular practice. However, it can take up to 3 months to see maximum benefits. Aim for at least 3 sessions per day."
        />

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Quick Tips for Success</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>• Start slowly and gradually increase duration</Text>
            <Text style={styles.tip}>• Practice at regular times each day</Text>
            <Text style={styles.tip}>• Don't hold your breath during exercises</Text>
            <Text style={styles.tip}>• Be patient - results take time to show</Text>
            <Text style={styles.tip}>• Consult your doctor if you experience pain</Text>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This app provides general information about Kegel exercises and is not a substitute for professional medical advice. Consult your healthcare provider before starting any new exercise program, especially if you have pelvic floor dysfunction or other medical conditions.
          </Text>
        </View>
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
    paddingBottom: 16,
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
  card: {
    backgroundColor: Colors.background,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textLight,
  },
  tipsContainer: {
    margin: 24,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tip: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textLight,
  },
  disclaimer: {
    margin: 24,
    marginTop: 8,
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#92400E',
    textAlign: 'center',
  },
});