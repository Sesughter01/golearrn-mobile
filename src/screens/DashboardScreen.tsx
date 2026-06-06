import { StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../hooks/useAppNavigation';

export function DashboardScreen() {
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      eyebrow="Learner Home"
      title="Your learning dashboard"
      subtitle="This placeholder dashboard is ready to grow into enrolled courses, progress tracking, reminders, and recommended learning paths."
    >
      <InfoCard
        title="Next course action"
        description="Resume your latest lesson, surface translation status, and highlight quiz deadlines once backend learner progress APIs are available."
      />
      <View style={styles.grid}>
        <PrimaryButton
          label="Browse catalog"
          onPress={() => navigation.navigate({ name: 'catalog' })}
        />
        <PrimaryButton
          label="Profile & settings"
          variant="secondary"
          onPress={() => navigation.navigate({ name: 'profile' })}
        />
      </View>
      <Text style={styles.note}>
        TODO: Confirm learner dashboard API for enrolled courses, progress summaries, recommendations, and notifications.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm,
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
