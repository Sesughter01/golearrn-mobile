import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppConfig } from '../context/AppConfigContext';
import { colors, radii, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';

export function WelcomeScreen() {
  const navigation = useAppNavigation();
  const { appName, config, error } = useAppConfig();

  return (
    <ScreenContainer
      eyebrow="Welcome"
      title={`Learn with ${appName}`}
      subtitle="Start with a practical mobile foundation for discovering courses, joining classes, and continuing lessons on the go."
    >
      <View style={styles.heroCard}>
        <Badge label="Learner MVP" tone="blue" />
        <Text style={styles.heroTitle}>Learn skills you can use right away</Text>
        <Text style={styles.heroBody}>
          Discover courses, keep up with lessons, and prepare for multilingual learning support while the Laravel mobile contracts are finalized.
        </Text>
      </View>
      <InfoCard
        accent="soft"
        title="Built for mobile-first learners"
        description={
          error
            ? `App config could not be refreshed right now: ${error}`
            : `Feature flags, policy links, and support info are now ready to bootstrap from /app/config. ${
                config?.otp_enabled ? 'OTP remains hidden on mobile for now.' : ''
              }`
        }
      />
      <InfoCard
        title="Internal tester focus"
        description="On a physical Android device, verify login, app restart, session restore through /auth/me, logout, and catalog/course detail loading before the first APK build is shared."
      />
      <View style={styles.actionGroup}>
        <PrimaryButton label="Log In" onPress={() => navigation.navigate({ name: 'login' })} />
        <PrimaryButton
          label="Create Account"
          variant="secondary"
          onPress={() => navigation.navigate({ name: 'register' })}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  actionGroup: {
    gap: spacing.sm,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: '800',
  },
  heroBody: {
    color: '#DCEBFF',
    fontSize: 15,
    lineHeight: 22,
  },
});
