import { StyleSheet, Text } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors } from '../constants/theme';

export function ProfileSettingsScreen() {
  return (
    <ScreenContainer
      eyebrow="Profile"
      title="Profile and settings placeholder"
      subtitle="This screen is reserved for learner account preferences, language settings, support links, and account deletion."
    >
      <InfoCard
        title="Account management"
        description="Before production, we need the account deletion endpoint, privacy policy URL, terms URL, notification preferences contract, and learner profile update fields."
      />
      <Text style={styles.note}>
        TODO: Confirm how mobile should handle account deletion, logout, device sessions, and notification opt-ins.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  note: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
