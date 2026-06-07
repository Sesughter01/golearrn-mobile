import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAppConfig } from '../context/AppConfigContext';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';

export function SplashScreen() {
  const navigation = useAppNavigation();
  const { appName } = useAppConfig();
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'bootstrapping') {
      return;
    }

    const timeoutId = setTimeout(() => {
      navigation.reset({ name: status === 'authenticated' ? 'dashboard' : 'welcome' });
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [navigation, status]);

  return (
    <View style={styles.container}>
      <View style={styles.logoMark}>
        <Text style={styles.logoText}>GO</Text>
      </View>
      <Text style={styles.title}>{appName}</Text>
      <Text style={styles.subtitle}>
        {status === 'bootstrapping'
          ? 'Restoring your learner session.'
          : 'Learner-first mobile learning, built for steady growth.'}
      </Text>
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
