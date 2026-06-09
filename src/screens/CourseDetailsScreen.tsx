import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';

import { AppHeader } from '../components/AppHeader';
import { Badge, getTranslationTone } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { PriceLabel } from '../components/PriceLabel';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
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
  const [isLoading, setIsLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  async function loadCourseDetails() {
    setIsLoading(true);
    try {
      const nextCourse = await golearrnApi.getCourseDetails(courseId);
      setCourse(nextCourse);
      setError(null);
      setImageFailed(false);
    } catch (nextError) {
      setCourse(null);
      setError(nextError instanceof Error ? nextError.message : 'Unable to load course details.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  if (!course) {
    return (
      <ScreenContainer
        eyebrow="Course"
        title={error ? 'Course unavailable' : 'Loading course'}
        subtitle="Live course detail now comes from the mobile API."
      >
        {isLoading ? <LoadingState label="Loading course details..." /> : null}
        {!isLoading && error ? (
          <ErrorState
            title="We couldn't load this course"
            description={error}
            actionLabel="Retry"
            onAction={loadCourseDetails}
          />
        ) : null}
      </ScreenContainer>
    );
  }

  const descriptionBlocks = course.description
    .split('\n\n')
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <ScreenContainer
      eyebrow="Course"
      title={course.title}
      subtitle="A polished overview that keeps enrollment on the web and helps learners understand what this course offers."
    >
      <AppHeader
        title={course.title}
        subtitle={`Instructor: ${course.instructor}${course.category ? ` · ${course.category}` : ''}`}
      />
      <View style={styles.heroCard}>
        {course.thumbnailUrl ? (
          <Image
            source={
              imageFailed
                ? require('../../assets/placeholders/course-placeholder.png')
                : { uri: course.thumbnailUrl }
            }
            style={styles.heroImage}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Image
            source={require('../../assets/placeholders/course-placeholder.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.badgeWrap}>
          <Badge label={course.level} tone="blue" />
          <Badge label={course.language} tone="slate" />
          <Badge
            label={`Translation: ${course.translationState}`}
            tone={getTranslationTone(course.translationState)}
          />
        </View>
        <View style={styles.descriptionWrap}>
          {descriptionBlocks.map((block, index) => {
            const lines = block
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean);
            const isBulletGroup = lines.every((line) => line.startsWith('- '));

            if (isBulletGroup) {
              return (
                <View key={`${block}-${index}`} style={styles.bulletGroup}>
                  {lines.map((line) => (
                    <View key={line} style={styles.bulletRow}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>{line.replace(/^- /, '')}</Text>
                    </View>
                  ))}
                </View>
              );
            }

            return (
              <Text key={`${block}-${index}`} style={styles.heroDescription}>
                {block}
              </Text>
            );
          })}
        </View>
        <View style={styles.metaWrap}>
          <Text style={styles.heroMeta}>{course.lessonCount} lessons</Text>
          <Text style={styles.heroMeta}>{course.chapterCount ?? 'TBD'} chapters</Text>
          {course.ratingAverage ? (
            <Text style={styles.heroMeta}>Rating {course.ratingAverage.toFixed(1)}</Text>
          ) : null}
        </View>
        <PriceLabel label={course.priceLabel ?? 'Enroll via Web'} isFree={course.isFree} />
      </View>
      <SectionHeader
        title="Curriculum preview"
        subtitle="Enrollment and payments still stay on the web. This screen focuses on helping learners understand the course before handoff."
      />
      {!course.chapters.length ? (
        <EmptyState
          title="Curriculum preview is limited"
          description="This course detail response did not include chapter data yet, so the learner still needs the web view for the full outline."
          actionLabel="Back to catalog"
          onAction={() => navigation.reset({ name: 'catalog' })}
        />
      ) : null}
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
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  heroImage: {
    height: 220,
    width: '100%',
  },
  badgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  descriptionWrap: {
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  heroDescription: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.md,
    lineHeight: 28,
  },
  bulletGroup: {
    gap: SPACING.sm,
  },
  bulletRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  bulletDot: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 999,
    height: 8,
    marginTop: 10,
    width: 8,
  },
  bulletText: {
    color: COLORS.primaryText,
    flex: 1,
    fontSize: FONT_SIZES.md,
    lineHeight: 28,
  },
  metaWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  heroMeta: {
    color: COLORS.secondaryText,
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
  lessonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  lesson: {
    color: COLORS.secondaryText,
    flex: 1,
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
  },
});
