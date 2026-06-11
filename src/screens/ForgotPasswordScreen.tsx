import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { LogoMark } from '../components/LogoMark';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { ApiError } from '../services/api/client';
import { golearrnApi } from '../services/api/golearrnApi';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';

const authBackground = require('../../assets/backgrounds/auth-bg.png');

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
      <ImageBackground source={authBackground} imageStyle={styles.heroImage} style={styles.heroCard}>
        <View style={styles.heroOverlay}>
          <LogoMark size="md" variant="dark" />
          <Text style={styles.heroTitle}>Reset mobile access</Text>
          <Text style={styles.heroBody}>
            Use the same GOLEARRN account email and we&apos;ll hand off reset instructions if the account exists.
          </Text>
        </View>
      </ImageBackground>
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
          placeholder="student@example.com"
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
    gap: SPACING.sm,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 24,
  },
  heroOverlay: {
    backgroundColor: COLORS.overlayStrong,
    gap: SPACING.sm,
    minHeight: 190,
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
  },
  heroBody: {
    color: COLORS.onDarkText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 21,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  success: {
    color: COLORS.primaryCyan,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
});
