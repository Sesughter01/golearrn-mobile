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
      subtitle="Use your real learner account credentials and continue learning across app restarts with SecureStore-backed session restore."
    >
      <ImageBackground source={authBackground} imageStyle={styles.heroImage} style={styles.heroCard}>
        <View style={styles.heroOverlay}>
          <LogoMark size="md" variant="dark" />
          <Text style={styles.heroTitle}>Secure learner sign in</Text>
          <Text style={styles.heroBody}>
            Pick up where you left off with SecureStore-backed session restore on supported devices.
          </Text>
        </View>
      </ImageBackground>
      <InfoCard
        accent="soft"
        title="Secure learner sign in"
        description="Sign in with your GOLEARRN learner account. Sanctum bearer tokens are stored securely and restored during app bootstrap."
        footer={<Badge label="SecureStore session" tone="blue" />}
      />
      <InfoCard
        title="Release test checklist"
        description="After signing in on a physical device, close and reopen the app to confirm session restore works, run a live course search, open a course detail, then log out and confirm the app returns to the guest flow."
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
