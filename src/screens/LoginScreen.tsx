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

export function LoginScreen() {
  const navigation = useAppNavigation();
  const { login, error, errorKind, isSubmitting, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleContinue() {
    clearError();
    const success = await login({ email, password });

    if (success) {
      navigation.reset({ name: 'dashboard' });
    }
  }

  return (
    <ScreenContainer
      eyebrow="Authentication"
      title="Log in to GOLEARRN"
      subtitle="Use your real learner account credentials. The app now authenticates against the live mobile API."
    >
      <InfoCard
        accent="soft"
        title="Secure learner sign in"
        description="Sign in with your GOLEARRN learner account. Sanctum bearer tokens are now stored in SecureStore and restored during app bootstrap."
        footer={<Badge label="Bearer token via SecureStore" tone="blue" />}
      />
      <InfoCard
        title="Release test checklist"
        description="After signing in on a physical device, close and reopen the app to confirm SecureStore restore works, then log out and confirm the app returns to the guest flow."
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
        <TextField
          autoCapitalize="none"
          label="Password"
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {errorKind === 'invalid_credentials' ? (
          <Text style={styles.note}>
            If you created your account with Google on the web, use Forgot Password to set a password for mobile, or continue on the web for now.
          </Text>
        ) : null}
        <PrimaryButton
          label={isSubmitting ? 'Signing in...' : 'Log In'}
          onPress={handleContinue}
        />
        <PrimaryButton
          label="Forgot Password?"
          variant="secondary"
          onPress={() => navigation.navigate({ name: 'forgot-password' })}
        />
        <PrimaryButton
          label="Need an account? Register"
          variant="secondary"
          onPress={() => navigation.navigate({ name: 'register' })}
        />
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
  error: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 20,
  },
});
