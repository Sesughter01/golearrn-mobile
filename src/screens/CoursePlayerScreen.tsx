import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge, getTranslationTone } from '../components/Badge';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, radii, spacing } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseDetails } from '../types/course';

type CoursePlayerScreenProps = {
  courseId: string;
  lessonId?: string;
};

export function CoursePlayerScreen({
  courseId,
  lessonId,
}: CoursePlayerScreenProps) {
  const navigation = useAppNavigation();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    golearrnApi
      .fetchCourseDetails(courseId)
      .then((nextCourse) => {
        setCourse(nextCourse);
        setProgressPercent(nextCourse.progressPercent ?? 0);
      })
      .catch(() => setCourse(null));
  }, [courseId]);

  const currentLesson = useMemo(() => {
    if (!course) {
      return null;
    }

    return (
      course.chapters.flatMap((chapter) => chapter.lessons).find((lesson) => lesson.id === lessonId) ??
      course.chapters[0]?.lessons[0] ??
      null
    );
  }, [course, lessonId]);

  function handleMarkProgress() {
    setProgressPercent((current) => Math.min(current + 10, 100));
  }

  return (
    <ScreenContainer
      eyebrow="Player"
      title={course?.title ?? 'Course player'}
      subtitle="This learner-first prototype focuses on current lesson context, chapter visibility, translation status, and a lightweight progress action."
    >
      <View style={styles.playerSurface}>
        <Badge
          label={`Translation: ${course?.translationState ?? 'pending'}`}
          tone={getTranslationTone(course?.translationState ?? 'pending')}
        />
        <Text style={styles.playerTitle}>{currentLesson?.title ?? 'Preparing lesson...'}</Text>
        <Text style={styles.playerMeta}>
          {currentLesson ? `${currentLesson.type} · ${currentLesson.duration}` : `Course ID: ${courseId}`}
        </Text>
        <Text style={styles.playerProgress}>Progress: {progressPercent}% complete</Text>
      </View>
      <InfoCard
        accent="soft"
        title="Player backend dependencies"
        description="We still need secure media URLs, real progress write-back, quiz launch behavior, translation polling, and lesson completion rules from Laravel."
      />
      {course?.chapters.map((chapter) => (
        <View key={chapter.id} style={styles.chapterCard}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          {chapter.lessons.map((lesson) => (
            <Text key={lesson.id} style={styles.lessonItem}>
              {lesson.id === currentLesson?.id ? 'Now learning: ' : ''}
              {lesson.title} · {lesson.duration}
            </Text>
          ))}
        </View>
      ))}
      <PrimaryButton label="Mark demo progress only" onPress={handleMarkProgress} />
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
    minHeight: 240,
    padding: spacing.lg,
    justifyContent: 'flex-end',
    gap: spacing.sm,
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
  playerProgress: {
    color: colors.surface,
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
  lessonItem: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
});
