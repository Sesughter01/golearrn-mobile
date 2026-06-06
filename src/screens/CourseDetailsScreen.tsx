import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, spacing } from '../constants/theme';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseDetails } from '../types/course';

type CourseDetailsScreenProps = {
  courseId: string;
};

export function CourseDetailsScreen({ courseId }: CourseDetailsScreenProps) {
  const navigation = useAppNavigation();
  const [course, setCourse] = useState<CourseDetails | null>(null);

  useEffect(() => {
    golearrnApi.fetchCourseDetails(courseId).then(setCourse).catch(() => setCourse(null));
  }, [courseId]);

  if (!course) {
    return (
      <ScreenContainer
        eyebrow="Course"
        title="Loading course"
        subtitle="We are preparing the course details placeholder."
      >
        <InfoCard
          title="Missing contract"
          description="Course details, enrollment status, and lesson access rules still need backend clarification."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      eyebrow="Course"
      title={course.title}
      subtitle="This page will eventually include enrollment state, progress, translated content status, and curriculum metadata from Laravel."
    >
      <InfoCard
        title="Overview"
        description={`${course.description} Translation state: ${course.translationState}.`}
      />
      {course.chapters.map((chapter) => (
        <View key={chapter.id} style={styles.chapter}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          {chapter.lessons.map((lesson) => (
            <Text key={lesson.id} style={styles.lesson}>
              {lesson.title} · {lesson.type} · {lesson.duration}
            </Text>
          ))}
        </View>
      ))}
      <PrimaryButton
        label="Open course player"
        onPress={() =>
          navigation.navigate({
            name: 'course-player',
            params: { courseId: course.id, lessonId: course.chapters[0]?.lessons[0]?.id },
          })
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chapter: {
    gap: spacing.xs,
  },
  chapterTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  lesson: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
});
