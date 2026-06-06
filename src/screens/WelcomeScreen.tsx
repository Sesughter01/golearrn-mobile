import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, radii, spacing } from '../constants/theme';
import { useAppNavigation } from '../hooks/useAppNavigation';

export function WelcomeScreen() {
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      eyebrow="Welcome"
      title="Learn with GOLEARRN"
      subtitle="Start with a practical mobile foundation for discovering courses, joining classes, and continuing lessons on the go."
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Learner-first mobile MVP</Text>
        <Text style={styles.heroBody}>
          This first version is focused on students and course consumption, with room for auth, deep links, QR onboarding, and progressive translations.
        </Text>
      </View>
      <PrimaryButton label="Log In" onPress={() => navigation.navigate({ name: 'login' })} />
      <PrimaryButton
        label="Create Account"
        variant="secondary"
        onPress={() => navigation.navigate({ name: 'register' })}
      />
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
  heroTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '800',
  },
  heroBody: {
    color: '#DCEBFF',
    fontSize: 15,
    lineHeight: 22,
  },
});
