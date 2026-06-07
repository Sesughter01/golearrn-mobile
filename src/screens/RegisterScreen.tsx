import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';

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
      subtitle="Register with the live mobile API, while keeping OTP and Google mobile sign-in hidden until those contracts are ready."
    >
      <InfoCard
        accent="soft"
        title="Create your learner account"
        description="Registration now targets the live mobile auth endpoint. OTP and Google mobile sign-in still remain out of scope for this milestone."
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
  recoveryActions: {
    gap: spacing.sm,
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 20,
  },
});
