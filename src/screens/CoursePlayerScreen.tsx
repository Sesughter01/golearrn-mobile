import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { Badge, getTranslationTone } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
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
      subtitle="A cleaner lesson surface that stays honest about what is and is not yet live from the GOLEARRN backend."
    >
      <AppHeader
        title={course?.title ?? 'Course player'}
        subtitle="Lesson playback and real learner progress still need dedicated backend/player endpoints."
      />
      <View style={styles.playerSurface}>
        <Badge
          label={`Translation: ${course?.translationState ?? 'pending'}`}
          tone={getTranslationTone(course?.translationState ?? 'pending')}
        />
        <Text style={styles.playerTitle}>{currentLesson?.title ?? 'Preparing lesson...'}</Text>
        <Text style={styles.playerMeta}>
          {currentLesson ? `${currentLesson.type} · ${currentLesson.duration}` : `Course ID: ${courseId}`}
        </Text>
        <Text style={styles.playerProgress}>Demo progress only: {progressPercent}% complete</Text>
      </View>
      <InfoCard
        accent="soft"
        title="Player backend dependencies"
        description="We still need secure media URLs, real progress write-back, quiz launch behavior, translation polling, and lesson completion rules from Laravel."
      />
      {!course?.chapters.length ? (
        <EmptyState
          title="Lesson structure is limited"
          description="This prototype cannot show a full curriculum until the backend returns richer player and chapter data."
          imageSource={require('../../assets/placeholders/empty-courses.png')}
        />
      ) : null}
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
        variant="secondary"
        onPress={() => navigation.reset({ name: 'dashboard' })}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  playerSurface: {
    backgroundColor: COLORS.darkNavy,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    justifyContent: 'flex-end',
    minHeight: 240,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  playerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
  },
  playerMeta: {
    color: COLORS.onDarkText,
    fontSize: FONT_SIZES.sm,
  },
  playerProgress: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  chapterCard: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  chapterTitle: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  lessonItem: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 21,
  },
});
