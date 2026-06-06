import { StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, radii, spacing } from '../constants/theme';
import { useAppNavigation } from '../hooks/useAppNavigation';

type CoursePlayerScreenProps = {
  courseId: string;
  lessonId?: string;
};

export function CoursePlayerScreen({
  courseId,
  lessonId,
}: CoursePlayerScreenProps) {
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      eyebrow="Player"
      title="Course player placeholder"
      subtitle="This is reserved for video, readings, quizzes, progress sync, and multilingual lesson rendering."
    >
      <View style={styles.playerSurface}>
        <Text style={styles.playerTitle}>Course ID: {courseId}</Text>
        <Text style={styles.playerMeta}>Current lesson: {lessonId ?? 'TBD by backend'}</Text>
      </View>
      <InfoCard
        title="Player backend dependencies"
        description="We still need secure media access, progress sync, quiz launches, translation state behavior, and lesson completion rules."
      />
      <PrimaryButton
        label="Back to dashboard"
        onPress={() => navigation.reset({ name: 'dashboard' })}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  playerSurface: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.lg,
    minHeight: 220,
    padding: spacing.lg,
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  playerTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '800',
  },
  playerMeta: {
    color: '#DCEBFF',
    fontSize: 14,
  },
});
