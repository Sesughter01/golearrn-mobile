import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge, getTranslationTone } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { colors, radii, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseSummary } from '../types/course';

export function DashboardScreen() {
  const navigation = useAppNavigation();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    golearrnApi
      .fetchEnrolledCourses()
      .then(setEnrolledCourses)
      .catch((nextError) => {
        setError(nextError instanceof Error ? nextError.message : 'Unable to load courses.');
        setEnrolledCourses([]);
      });
  }, []);

  return (
    <ScreenContainer
      eyebrow="Learner Home"
      title="Your learning dashboard"
      subtitle="Pick up where you left off, watch translation readiness, and keep your momentum moving from lesson to lesson."
    >
      <InfoCard
        accent="soft"
        title="Today’s learner focus"
        description={
          user
            ? `Welcome back, ${user.name}. This dashboard uses live catalog data for now while the dedicated learner dashboard API is still pending.`
            : 'Your learner session is active, but user profile details could not be loaded.'
        }
      />
      {error ? <Text style={styles.note}>{error}</Text> : null}
      {enrolledCourses.map((course) => (
        <View key={course.id} style={styles.courseSpotlight}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Badge
              label={`Translation: ${course.translationState}`}
              tone={getTranslationTone(course.translationState)}
            />
          </View>
          <Text style={styles.courseMeta}>
            {course.instructor} · {course.level} · {course.language}
          </Text>
          <Text style={styles.courseProgress}>
            Demo progress placeholder: {course.progressPercent ?? 0}% complete
          </Text>
          <PrimaryButton
            label="Continue learning"
            onPress={() =>
              navigation.navigate({ name: 'course-details', params: { courseId: course.slug } })
            }
          />
        </View>
      ))}
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
        TODO: Full learner dashboard, enrolled-course progress, recommendations, and notifications still require dedicated backend endpoints.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm,
  },
  courseSpotlight: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  courseHeader: {
    gap: spacing.xs,
  },
  courseTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  courseMeta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  courseProgress: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
