import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';

import { AppHeader } from '../components/AppHeader';
import { Badge, getTranslationTone } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { InfoCard } from '../components/InfoCard';
import { LoadingState } from '../components/LoadingState';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { buildCourseWebUrl } from '../utils/links';
import { CoursePlayerData } from '../types/player';

type CoursePlayerScreenProps = {
  courseId: string;
  lessonId?: string;
};

export function CoursePlayerScreen({
  courseId,
  lessonId,
}: CoursePlayerScreenProps) {
  const navigation = useAppNavigation();
  const { status } = useAuth();
  const [player, setPlayer] = useState<CoursePlayerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(lessonId);
  const [resumePositionSeconds, setResumePositionSeconds] = useState(0);
  const startedLessonRef = useRef<string | null>(null);
  const lastSavedResumeRef = useRef(0);

  async function loadPlayer(nextLessonId?: string) {
    setIsLoading(true);
    setError(null);

    try {
      const nextPlayer = await golearrnApi.getCoursePlayer(courseId, nextLessonId);
      setPlayer(nextPlayer);
      const resolvedLessonId = nextPlayer.currentLesson?.id;

      if (resolvedLessonId && resolvedLessonId !== selectedLessonId) {
        setSelectedLessonId(resolvedLessonId);
      }

      const nextResume =
        nextPlayer.currentLesson?.resumePositionSeconds ??
        nextPlayer.playback.resumePositionSeconds ??
        0;
      setResumePositionSeconds(nextResume);
      lastSavedResumeRef.current = nextResume;
    } catch (nextError) {
      setPlayer(null);
      setError(nextError instanceof Error ? nextError.message : 'Unable to load this lesson.');
    } finally {
      setIsLoading(false);
    }
  }

  async function saveProgress(
    event: 'progress' | 'completed',
    overrides?: { resumePositionSeconds?: number; completed?: boolean; lessonId?: string },
  ) {
    const lessonToSave = overrides?.lessonId ?? selectedLessonId ?? player?.currentLesson?.id;

    if (!lessonToSave) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await golearrnApi.saveLessonProgress(courseId, lessonToSave, {
        event,
        resume_position_seconds:
          overrides?.resumePositionSeconds ?? resumePositionSeconds ?? 0,
        completed: overrides?.completed,
      });
      if (typeof overrides?.resumePositionSeconds === 'number') {
        lastSavedResumeRef.current = overrides.resumePositionSeconds;
      }
      if (event === 'completed') {
        await loadPlayer(lessonToSave);
      }
    } catch (nextError) {
      setSaveError(
        nextError instanceof Error
          ? nextError.message
          : 'Unable to save your lesson progress right now.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    loadPlayer(lessonId);
  }, [courseId, lessonId, status]);

  const currentLesson = useMemo(() => {
    if (!player) {
      return null;
    }

    return (
      player.chapters
        .flatMap((chapter) => chapter.lessons)
        .find((lesson) => lesson.id === selectedLessonId) ??
      player.currentLesson ??
      player.chapters[0]?.lessons[0] ??
      null
    );
  }, [player, selectedLessonId]);

  useEffect(() => {
    if (!currentLesson) {
      return;
    }

    const nextResume =
      currentLesson.resumePositionSeconds ?? player?.playback.resumePositionSeconds ?? 0;
    setResumePositionSeconds(nextResume);
  }, [currentLesson, player?.playback.resumePositionSeconds]);

  useEffect(() => {
    if (!currentLesson || status !== 'authenticated') {
      return;
    }

    if (startedLessonRef.current === currentLesson.id) {
      return;
    }

    startedLessonRef.current = currentLesson.id;
    saveProgress('progress', {
      lessonId: currentLesson.id,
      resumePositionSeconds: currentLesson.resumePositionSeconds ?? resumePositionSeconds,
    });
  }, [currentLesson, resumePositionSeconds, status]);

  useEffect(() => {
    if (!currentLesson || status !== 'authenticated') {
      return;
    }

    const delta = Math.abs(resumePositionSeconds - lastSavedResumeRef.current);

    if (delta < 30) {
      return;
    }

    const timer = setTimeout(() => {
      saveProgress('progress', {
        lessonId: currentLesson.id,
        resumePositionSeconds,
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [currentLesson, resumePositionSeconds, status]);

  const course = player?.course;
  const webUrl = player?.access.webUrl ?? buildCourseWebUrl(course?.slug ?? courseId);
  const durationSeconds =
    currentLesson?.durationSeconds ?? player?.playback.durationSeconds ?? null;

  function handleLessonSelect(nextLessonId: string) {
    setSelectedLessonId(nextLessonId);
    loadPlayer(nextLessonId);
  }

  return (
    <ScreenContainer
      eyebrow="Player"
      title={course?.title ?? 'Course player'}
      subtitle="A student-first lesson handoff that now uses the live player bootstrap API while preserving GOLEARRN Web for deeper playback where needed."
    >
      {status !== 'authenticated' ? (
        <EmptyState
          title="Sign in to continue"
          description="This course player is only available for signed-in students with an active GOLEARRN session."
          imageSource={require('../../assets/placeholders/empty-courses.png')}
          actionLabel="Back to login"
          onAction={() => navigation.reset({ name: 'login' })}
        />
      ) : null}
      {status !== 'authenticated' ? null : (
        <>
      <AppHeader
        title={course?.title ?? 'Course player'}
        subtitle="Lesson context, chapter navigation, and progress sync now come from the live student player API."
      />
      {isLoading ? <LoadingState label="Loading your lesson player..." /> : null}
      {!isLoading && error ? (
        <ErrorState
          title="We couldn't load this lesson"
          description={error}
          actionLabel="Retry"
          onAction={() => loadPlayer(selectedLessonId)}
        />
      ) : null}
      {!isLoading && !error && !player ? (
        <EmptyState
          title="No player data is available"
          description="This enrolled course did not return playable lesson data yet."
          imageSource={require('../../assets/placeholders/empty-courses.png')}
          actionLabel="Back to dashboard"
          onAction={() => navigation.reset({ name: 'dashboard' })}
        />
      ) : null}
      {!isLoading && !error && player ? (
        <>
      <View style={styles.playerSurface}>
        <Badge
          label={`Translation: ${currentLesson?.translationState ?? course?.translationState ?? 'pending'}`}
          tone={getTranslationTone(currentLesson?.translationState ?? course?.translationState ?? 'pending')}
        />
        <Text style={styles.playerTitle}>{currentLesson?.title ?? 'Preparing lesson...'}</Text>
        <Text style={styles.playerMeta}>
          {currentLesson ? `${currentLesson.type} · ${currentLesson.duration}` : `Course ID: ${courseId}`}
        </Text>
        <Text style={styles.playerProgress}>
          {typeof player.progress.percent === 'number'
            ? `Current learning progress: ${player.progress.percent}%`
            : 'Your progress will appear here once player sync is live.'}
        </Text>
      </View>
      <InfoCard
        accent="soft"
        title="Continue where you left off"
        description={`Completed lessons: ${player.progress.completedLessons}/${player.progress.totalLessons}. Resume marker: ${resumePositionSeconds}s.${player.access.requiresWebHandoff ? ' Continue on GOLEARRN Web for the richest playback experience.' : ''}`}
      />
      {saveError ? (
        <Text style={styles.saveError}>{saveError}</Text>
      ) : null}
      {course?.lastLesson?.title ? (
        <InfoCard
          title="Last student activity"
          description={`Last lesson: ${course.lastLesson.title}${course.lastAccessedAt ? ` • Last accessed ${new Date(course.lastAccessedAt).toLocaleString()}` : ''}`}
        />
      ) : null}
      {player.chapters.length === 0 ? (
        <EmptyState
          title="Lesson structure is limited"
          description="The live player endpoint returned no chapter or lesson structure for this course yet."
          imageSource={require('../../assets/placeholders/empty-courses.png')}
        />
      ) : null}
      {player.chapters.map((chapter) => (
        <View key={chapter.id} style={styles.chapterCard}>
          <View style={styles.chapterHeader}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            {chapter.translationState ? (
              <Badge
                label={`Translation: ${chapter.translationState}`}
                tone={getTranslationTone(chapter.translationState)}
              />
            ) : null}
          </View>
          {chapter.lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() => handleLessonSelect(lesson.id)}
              style={[
                styles.lessonRow,
                lesson.id === currentLesson?.id && styles.lessonRowActive,
              ]}
            >
              <View style={styles.lessonTextWrap}>
                <Text style={styles.lessonItem}>
                  {lesson.id === currentLesson?.id ? 'Now learning: ' : ''}
                  {lesson.title}
                </Text>
                <Text style={styles.lessonMeta}>
                  {lesson.type} · {lesson.duration}
                  {typeof lesson.resumePositionSeconds === 'number'
                    ? ` · Resume ${lesson.resumePositionSeconds}s`
                    : ''}
                </Text>
              </View>
              {lesson.completed ? <Badge label="Completed" tone="green" /> : null}
            </Pressable>
          ))}
        </View>
      ))}
      <View style={styles.resumeControls}>
        <PrimaryButton
          label="Rewind 30s"
          variant="secondary"
          onPress={() => setResumePositionSeconds((current) => Math.max(0, current - 30))}
        />
        <PrimaryButton
          label="Advance 30s"
          variant="secondary"
          onPress={() =>
            setResumePositionSeconds((current) =>
              durationSeconds ? Math.min(durationSeconds, current + 30) : current + 30,
            )
          }
        />
      </View>
      <PrimaryButton
        label={isSaving ? 'Saving progress...' : 'Save current place'}
        onPress={() =>
          saveProgress('progress', {
            lessonId: currentLesson?.id,
            resumePositionSeconds,
          })
        }
      />
      <PrimaryButton
        label="Mark lesson complete"
        onPress={() =>
          saveProgress('completed', {
            lessonId: currentLesson?.id,
            resumePositionSeconds: durationSeconds ?? resumePositionSeconds,
            completed: true,
          })
        }
      />
      <PrimaryButton
        label="Continue on GOLEARRN Web"
        variant="secondary"
        onPress={() => Linking.openURL(webUrl)}
      />
      <PrimaryButton
        label="Back to dashboard"
        variant="secondary"
        onPress={() => navigation.reset({ name: 'dashboard' })}
      />
        </>
      ) : null}
        </>
      )}
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
  saveError: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
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
  chapterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  chapterTitle: {
    color: COLORS.primaryText,
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  lessonRow: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
    padding: SPACING.sm,
  },
  lessonRowActive: {
    backgroundColor: COLORS.navySoft,
    borderColor: COLORS.borderStrong,
  },
  lessonTextWrap: {
    flex: 1,
    gap: 2,
  },
  lessonItem: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 21,
  },
  lessonMeta: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.xs,
    lineHeight: 18,
  },
  resumeControls: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
});
