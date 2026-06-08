import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { COLORS, FONT_SIZES, RADIUS, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseSummary } from '../types/course';

export function CourseCatalogScreen() {
  const navigation = useAppNavigation();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

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

  const filteredCourses = query
    ? courses.filter((course) => {
        const normalized = query.toLowerCase();
        return (
          course.title.toLowerCase().includes(normalized) ||
          course.instructor.toLowerCase().includes(normalized) ||
          course.category?.toLowerCase().includes(normalized)
        );
      })
    : courses;

  return (
    <ScreenContainer
      eyebrow="Catalog"
      title="Discover your next course"
      subtitle="A cleaner GOLEARRN learning catalog with live course data, clearer badges, and a more learner-friendly browsing flow."
    >
      <AppHeader
        title="Explore GOLEARRN courses"
        subtitle="Browse live catalog results, then continue to course details for the full overview."
      />
      <View style={styles.searchShell}>
        <TextInput
          onChangeText={setQuery}
          placeholder="Search courses, instructors, or categories"
          placeholderTextColor={COLORS.secondaryText}
          style={styles.searchInput}
          value={query}
        />
      </View>
      <SectionHeader
        title="Live catalog"
        subtitle="Search is local on the currently loaded catalog for now. Dedicated server search can be layered into this screen next."
      />
      {isLoading ? <LoadingState label="Loading course catalog..." /> : null}
      {!isLoading && error ? (
        <ErrorState
          title="We couldn't load the catalog"
          description={error}
          actionLabel="Retry"
          onAction={loadCourses}
        />
      ) : null}
      {!isLoading && !error && courses.length === 0 ? (
        <EmptyState
          title="No courses are available yet"
          description="The live catalog returned no courses right now. Try refreshing again shortly."
          imageSource={require('../../assets/placeholders/empty-courses.png')}
          actionLabel="Refresh"
          onAction={loadCourses}
        />
      ) : null}
      {!isLoading && !error && filteredCourses.length === 0 ? (
        <EmptyState
          title="No matching courses found"
          description="Try a different search term or clear the search field to see the full course list."
          imageSource={require('../../assets/placeholders/empty-search.png')}
        />
      ) : null}
      {filteredCourses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onPress={() =>
            navigation.navigate({ name: 'course-details', params: { courseId: course.slug } })
          }
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchShell: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xs,
  },
  searchInput: {
    color: COLORS.primaryText,
    fontSize: FONT_SIZES.md,
    minHeight: 52,
    paddingHorizontal: SPACING.md,
  },
});
