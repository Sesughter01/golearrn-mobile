import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { ApiError } from '../services/api/client';
import { golearrnApi } from '../services/api/golearrnApi';

export function ForgotPasswordScreen() {
  const navigation = useAppNavigation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await golearrnApi.forgotPassword(email);
      setSuccessMessage('If this email exists, password reset instructions have been sent.');
    } catch (nextError) {
      if (nextError instanceof ApiError) {
        const validationMessage = nextError.validationErrors?.email?.[0];
        setError(validationMessage ?? nextError.message);
      } else {
        setError(nextError instanceof Error ? nextError.message : 'Unable to send reset instructions.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer
      eyebrow="Authentication"
      title="Forgot your password?"
      subtitle="Set a password for mobile access if your GOLEARRN account already exists on the web."
    >
      <InfoCard
        accent="soft"
        title="Existing web accounts are supported"
        description="If you originally signed up with Google on the web, use this step to set a password for mobile until native Google sign-in is ready."
      />
      <View style={styles.actions}>
        <TextField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="learner@example.com"
          value={email}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
        <PrimaryButton
          label={isSubmitting ? 'Sending reset link...' : 'Send reset instructions'}
          onPress={handleSubmit}
        />
        <PrimaryButton
          label="Back to Login"
          variant="secondary"
          onPress={() => navigation.reset({ name: 'login' })}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 20,
  },
  success: {
    color: colors.success,
    fontSize: 13,
    lineHeight: 20,
  },
});
