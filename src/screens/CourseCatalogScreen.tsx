import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, radii, spacing } from '../constants/theme';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseSummary } from '../types/course';

export function CourseCatalogScreen() {
  const navigation = useAppNavigation();
  const [courses, setCourses] = useState<CourseSummary[]>([]);

  useEffect(() => {
    golearrnApi.fetchCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <ScreenContainer
      eyebrow="Catalog"
      title="Course catalog placeholder"
      subtitle="Learners can discover available programs here once the mobile course catalog and filtering API contracts are confirmed."
    >
      <InfoCard
        title="API needed"
        description="We still need pagination, category filters, search behavior, enrollment visibility, and translated metadata support."
      />
      {courses.map((course) => (
        <Pressable
          key={course.id}
          onPress={() =>
            navigation.navigate({ name: 'course-details', params: { courseId: course.id } })
          }
          style={({ pressed }) => [styles.courseCard, pressed && styles.courseCardPressed]}
        >
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseMeta}>
            {course.instructor} · {course.lessonsCount} lessons
          </Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Translation: {course.translationState}</Text>
            </View>
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
  },
  courseMeta: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  courseDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: '#E8F1FF',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  badgeText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
});
