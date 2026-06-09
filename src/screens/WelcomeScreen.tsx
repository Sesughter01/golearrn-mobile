import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { Badge } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { LogoMark } from '../components/LogoMark';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { useAppConfig } from '../context/AppConfigContext';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';

const authBackground = require('../../assets/backgrounds/auth-bg.png');

export function WelcomeScreen() {
  const navigation = useAppNavigation();
  const { appName, config, error } = useAppConfig();

  return (
    <ScreenContainer
      eyebrow="Welcome"
      title={`Learn with ${appName}`}
      subtitle="A cleaner learner-first mobile experience for practical courses, career skills, and flexible learning on the go."
    >
      <ImageBackground source={authBackground} imageStyle={styles.heroImage} style={styles.heroCard}>
        <View style={styles.heroOverlay}>
          <LogoMark size="md" variant="dark" />
          <Badge label="Learner-first mobile" tone="blue" />
          <Text style={styles.heroTitle}>Learn. Upskill. Grow.</Text>
          <Text style={styles.heroBody}>
            Explore career-focused courses, keep learning on your phone, and stay close to the skills that move your work forward.
          </Text>
        </View>
      </ImageBackground>
      <SectionHeader
        title="Why GOLEARRN on mobile?"
        subtitle="Keep the experience practical, polished, and honest while deeper learner APIs continue to mature."
      />
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
        description="On a physical Android device, verify splash, login, app restart, session restore through /auth/me, search, catalog, course detail, profile, and logout before the next APK build is shared."
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
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  heroImage: {
    borderRadius: RADIUS.lg,
  },
  heroOverlay: {
    backgroundColor: COLORS.overlayStrong,
    gap: SPACING.sm,
    minHeight: 280,
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  actionGroup: {
    gap: SPACING.sm,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.hero,
    fontWeight: '800',
  },
  heroBody: {
    color: COLORS.onDarkText,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
  },
});
