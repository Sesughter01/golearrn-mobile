import { StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { golearrnApi } from '../services/api/golearrnApi';

export function LoginScreen() {
  const navigation = useAppNavigation();

  async function handleContinue() {
    await golearrnApi.login({ email: 'learner@example.com', password: 'placeholder' });
    navigation.setAuthenticated(true);
    navigation.reset({ name: 'dashboard' });
  }

  return (
    <ScreenContainer
      eyebrow="Authentication"
      title="Login placeholder"
      subtitle="We have the learner login screen stubbed in, but the real mobile auth contract still needs to be confirmed with Laravel."
    >
      <InfoCard
        title="Backend contract needed"
        description="We still need the mobile auth endpoint, token strategy, Google sign-in flow, and any OTP or anti-bot requirements before wiring a production form."
      />
      <View style={styles.actions}>
        <PrimaryButton label="Continue as demo learner" onPress={handleContinue} />
        <Text style={styles.note}>
          TODO: Confirm whether native mobile should use session cookies, Sanctum, Passport, or a custom token approach.
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
