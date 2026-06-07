import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';

import { Badge, getTranslationTone } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, radii, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseDetails } from '../types/course';
import { buildCourseWebUrl } from '../utils/links';

type CourseDetailsScreenProps = {
  courseId: string;
};

export function CourseDetailsScreen({ courseId }: CourseDetailsScreenProps) {
  const navigation = useAppNavigation();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    golearrnApi
      .getCourseDetails(courseId)
      .then((nextCourse) => {
        setCourse(nextCourse);
        setError(null);
      })
      .catch((nextError) => {
        setCourse(null);
        setError(nextError instanceof Error ? nextError.message : 'Unable to load course details.');
      });
  }, [courseId]);

  if (!course) {
    return (
      <ScreenContainer
        eyebrow="Course"
        title={error ? 'Course unavailable' : 'Loading course'}
        subtitle="Live course detail now comes from the mobile API."
      >
        <InfoCard
          title={error ? 'API error' : 'Preparing course details'}
          description={
            error ??
            'Course details, enrollment state, and lesson structure are loading from the live endpoint.'
          }
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      eyebrow="Course"
      title={course.title}
      subtitle="Review the course path, translation readiness, and whether this learner should continue immediately or enroll on the web."
    >
      <View style={styles.heroCard}>
        <View style={styles.badgeWrap}>
          <Badge label={course.level} tone="blue" />
          <Badge label={course.language} tone="slate" />
          <Badge
            label={`Translation: ${course.translationState}`}
            tone={getTranslationTone(course.translationState)}
          />
        </View>
        <Text style={styles.heroDescription}>{course.description}</Text>
        <Text style={styles.heroMeta}>
          {course.category ? `${course.category} · ` : ''}
          {course.chapterCount ?? 'TBD'} chapters · {course.lessonCount} lessons
        </Text>
        <Text style={styles.heroMeta}>
          Instructor: {course.instructor} · Price: {course.priceLabel ?? 'Enroll via Web'}
        </Text>
      </View>
      <InfoCard
        accent="soft"
        title="What the learner needs next"
        description="If the learner is not enrolled yet, this prototype hands them off to the web course page instead of implementing in-app payments."
      />
      {course.chapters.map((chapter) => (
        <View key={chapter.id} style={styles.chapterCard}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          {chapter.lessons.map((lesson) => (
            <View key={lesson.id} style={styles.lessonRow}>
              <Text style={styles.lesson}>
                {lesson.title} · {lesson.type} · {lesson.duration}
              </Text>
              {lesson.completed ? <Badge label="Done" tone="green" /> : null}
            </View>
          ))}
        </View>
      ))}
      <PrimaryButton
        label={course.enrollmentCta}
        onPress={() => {
          if (course.enrolled) {
            navigation.navigate({
              name: 'course-player',
              params: { courseId: course.slug, lessonId: course.chapters[0]?.lessons[0]?.id },
            });
            return;
          }

          Linking.openURL(buildCourseWebUrl(course.slug));
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  badgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  heroDescription: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 23,
  },
  heroMeta: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  chapterCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  chapterTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lesson: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
});
