import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, getTranslationTone } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, radii, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseSummary } from '../types/course';

export function CourseCatalogScreen() {
  const navigation = useAppNavigation();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCourses() {
    setIsLoading(true);
    setError(null);

    try {
      const nextCourses = await golearrnApi.getCourses();
      setCourses(nextCourses);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load courses right now.');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <ScreenContainer
      eyebrow="Catalog"
      title="Discover your next course"
      subtitle="Browse learner-ready programs, track translation availability, and see which courses are already active in your study path."
    >
      <InfoCard
        accent="soft"
        title="Live course catalog"
        description="This screen now loads from the live `/courses` mobile endpoint. Search, filters, and richer enrollment states can be layered on next."
      />
      {isLoading ? <Text style={styles.stateText}>Loading courses...</Text> : null}
      {!isLoading && error ? (
        <View style={styles.stateBlock}>
          <Text style={styles.stateText}>{error}</Text>
          <PrimaryButton label="Retry" onPress={loadCourses} />
        </View>
      ) : null}
      {!isLoading && !error && courses.length === 0 ? (
        <View style={styles.stateBlock}>
          <Text style={styles.stateText}>No courses are available yet.</Text>
          <PrimaryButton label="Refresh" onPress={loadCourses} />
        </View>
      ) : null}
      {courses.map((course) => (
        <Pressable
          key={course.id}
          onPress={() =>
            navigation.navigate({ name: 'course-details', params: { courseId: course.slug } })
          }
          style={({ pressed }) => [styles.courseCard, pressed && styles.courseCardPressed]}
        >
          <View style={styles.titleRow}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            {course.enrolled ? <Badge label="Enrolled" tone="green" /> : null}
          </View>
          <Text style={styles.courseMeta}>{course.instructor}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
          <View style={styles.metaGrid}>
            <Text style={styles.metaItem}>{course.lessonsCount} lessons</Text>
            <Text style={styles.metaItem}>{course.level}</Text>
            <Text style={styles.metaItem}>{course.language}</Text>
            {course.category ? <Text style={styles.metaItem}>{course.category}</Text> : null}
          </View>
          <View style={styles.badgeRow}>
            <Badge
              label={`Translation: ${course.translationState}`}
              tone={getTranslationTone(course.translationState)}
            />
            {course.enrolled ? (
              <Badge label={`Progress: ${course.progressPercent ?? 0}%`} tone="blue" />
            ) : null}
            <Badge label={course.priceLabel ?? 'Enroll via Web'} tone="slate" />
          </View>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  courseCardPressed: {
    opacity: 0.9,
  },
  courseTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  courseMeta: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  courseDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaItem: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  stateBlock: {
    gap: spacing.sm,
  },
  stateText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
});
