import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { Badge } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { LogoMark } from '../components/LogoMark';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';

const authBackground = require('../../assets/backgrounds/auth-bg.png');

export function RegisterScreen() {
  const navigation = useAppNavigation();
  const { register, error, errorKind, isSubmitting, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  async function handleRegistration() {
    clearError();
    const success = await register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    if (success) {
      navigation.reset({ name: 'dashboard' });
    }
  }

  return (
    <ScreenContainer
      eyebrow="Authentication"
      title="Create your account"
      subtitle="Start learning on GOLEARRN mobile while OTP and Google sign-in stay hidden until those native flows are ready."
    >
      <ImageBackground source={authBackground} imageStyle={styles.heroImage} style={styles.heroCard}>
        <View style={styles.heroOverlay}>
          <LogoMark size="md" variant="dark" />
          <Text style={styles.heroTitle}>Start learning with GOLEARRN</Text>
          <Text style={styles.heroBody}>
            Create your learner account, then continue into the live course catalog from the same mobile session.
          </Text>
        </View>
      </ImageBackground>
      <InfoCard
        accent="soft"
        title="Create your learner account"
        description="Registration targets the live mobile auth endpoint and keeps the experience simple for learner-first onboarding."
        footer={<Badge label="OTP hidden on mobile" tone="amber" />}
      />
      <View style={styles.actions}>
        <TextField
          label="Full name"
          onChangeText={setName}
          placeholder="Your full name"
          value={name}
        />
        <TextField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="learner@example.com"
          value={email}
        />
        <TextField
          autoCapitalize="none"
          label="Password"
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
          value={password}
        />
        <TextField
          autoCapitalize="none"
          label="Confirm password"
          onChangeText={setPasswordConfirmation}
          placeholder="Repeat your password"
          secureTextEntry
          value={passwordConfirmation}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {errorKind === 'email_taken' ? (
          <View style={styles.recoveryActions}>
            <PrimaryButton
              label="Go to Login"
              variant="secondary"
              onPress={() => navigation.reset({ name: 'login' })}
            />
            <PrimaryButton
              label="Forgot password?"
              variant="secondary"
              onPress={() => navigation.navigate({ name: 'forgot-password' })}
            />
          </View>
        ) : null}
        <PrimaryButton
          label={isSubmitting ? 'Creating account...' : 'Create Account'}
          onPress={handleRegistration}
        />
        <PrimaryButton
          label="Already have an account? Log in"
          variant="secondary"
          onPress={() => navigation.navigate({ name: 'login' })}
        />
        <Text style={styles.note}>
          QR onboarding and deeper registration handoff rules still need backend support before they can be exposed here.
        </Text>
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
  recoveryActions: {
    gap: SPACING.sm,
  },
  note: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
});
