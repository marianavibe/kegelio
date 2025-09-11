import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export function Logo({ size = 'medium', showIcon = true }: LogoProps) {
  const styles = getStyles(size);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kegelio</Text>
      {showIcon && (
        <Heart
          color={Colors.primary}
          size={size === 'small' ? 20 : size === 'large' ? 36 : 28}
          fill={Colors.primary}
          style={styles.icon}
        />
      )}
    </View>
  );
}

const getStyles = (size: 'small' | 'medium' | 'large') => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: size === 'small' ? 8 : size === 'large' ? 16 : 12,
  },
  text: {
    fontSize: size === 'small' ? 20 : size === 'large' ? 36 : 28,
    fontWeight: '300',
    color: Colors.primary,
    letterSpacing: 1,
  },
  icon: {
    marginTop: 2,
  },
});