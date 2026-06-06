import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../hooks/useAppNavigation';

export function SplashScreen() {
  const navigation = useAppNavigation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.reset({ name: 'welcome' });
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoMark}>
        <Text style={styles.logoText}>GO</Text>
      </View>
      <Text style={styles.title}>GOLEARRN</Text>
      <Text style={styles.subtitle}>Learner-first mobile learning, built for steady growth.</Text>
      <ActivityIndicator color={colors.primary} size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  logoMark: {
    width: 86,
    height: 86,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: '800',
  },
  title: {
    color: colors.primaryDark,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
