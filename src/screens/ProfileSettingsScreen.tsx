import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppConfig } from '../context/AppConfigContext';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';

export function ProfileSettingsScreen() {
  const navigation = useAppNavigation();
  const { user, status, logout, isSubmitting, error } = useAuth();
  const { config } = useAppConfig();

  async function handleLogout() {
    await logout();
    navigation.reset({ name: 'welcome' });
  }

  return (
    <ScreenContainer
      eyebrow="Profile"
      title="Profile and settings"
      subtitle="Review the current learner mode, prepare for future account controls, and return safely to guest mode when you are done."
    >
      <InfoCard
        accent="soft"
        title="Current learner mode"
        description={
          user
            ? `${user.name} · ${user.email}`
            : 'This screen is ready for authenticated learner data once /auth/me is available during bootstrap.'
        }
        footer={
          <Badge
            label={`Session: ${status === 'authenticated' ? 'Authenticated' : status}`}
            tone="blue"
          />
        }
      />
      <InfoCard
        title="Support and policies"
        description={`Privacy: ${config?.privacy_policy_url ?? 'Pending from /app/config'}\nTerms: ${config?.terms_url ?? 'Pending from /app/config'}\nSupport: ${config?.support_email ?? config?.support_url ?? 'Pending from /app/config'}`}
      />
      <View style={styles.actionGroup}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          label={isSubmitting ? 'Logging out...' : 'Log out'}
          variant="secondary"
          onPress={handleLogout}
        />
      </View>
      <Text style={styles.note}>
        TODO: Confirm how mobile should handle account deletion, logout, device sessions, and notification opt-ins.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionGroup: {
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
