import { StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { golearrnApi } from '../services/api/golearrnApi';

export function RegisterScreen() {
  const navigation = useAppNavigation();

  async function handleDemoRegistration() {
    await golearrnApi.register({
      fullName: 'Demo Learner',
      email: 'learner@example.com',
      password: 'placeholder',
    });
    navigation.setAuthenticated(true);
    navigation.reset({ name: 'dashboard' });
  }

  return (
    <ScreenContainer
      eyebrow="Authentication"
      title="Register placeholder"
      subtitle="This starter screen reserves space for learner onboarding, OTP checks, and future QR registration handoff."
    >
      <InfoCard
        title="Registration questions still open"
        description="We need to confirm email OTP, Google sign-in handoff, reCAPTCHA behavior, and whether QR-based registration creates a temporary learner context."
      />
      <View style={styles.actions}>
        <PrimaryButton label="Create demo learner" onPress={handleDemoRegistration} />
        <Text style={styles.note}>
          TODO: Confirm QR onboarding flow from `/register/scan` and whether native deep links should receive invitation parameters.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
