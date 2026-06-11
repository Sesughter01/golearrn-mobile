import { Image, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { Badge } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { LogoMark } from '../components/LogoMark';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppConfig } from '../context/AppConfigContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
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
      subtitle="Account basics, support links, app details, and a simple student-safe logout flow."
    >
      <AppHeader
        title="Your GOLEARRN profile"
        subtitle="Clean student settings for this first internal release."
      />
      <InfoCard
        accent="soft"
        title="Current student mode"
        description={
          user
            ? `${user.name} · ${user.email}`
            : 'This screen is ready for authenticated student data once /auth/me is available during bootstrap.'
        }
        footer={
          <Badge
            label={`Session: ${status === 'authenticated' ? 'Authenticated' : status}`}
            tone="blue"
          />
        }
      />
      <View style={styles.identityRow}>
        <Image
          source={require('../../assets/placeholders/avatar-placeholder.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
        <LogoMark size="sm" showWordmark={false} />
      </View>
      <InfoCard
        title="Support and app links"
        description={`Privacy: ${config?.privacy_policy_url ?? 'Pending from /app/config'}\nTerms: ${config?.terms_url ?? 'Pending from /app/config'}\nSupport: ${config?.support_email ?? config?.support_url ?? 'Pending from /app/config'}\nApp version: 0.1.0`}
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
        During device QA, confirm this screen shows the restored student session after app restart, then log out and verify the app returns cleanly to the guest flow.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionGroup: {
    gap: SPACING.sm,
  },
  identityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.md,
  },
  avatar: {
    borderRadius: 28,
    height: 56,
    width: 56,
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
