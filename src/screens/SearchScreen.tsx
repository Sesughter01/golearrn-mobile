import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { TextField } from '../components/TextField';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseSummary } from '../types/course';

const SEARCH_DEBOUNCE_MS = 450;

export function SearchScreen() {
  const navigation = useAppNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const latestSubmittedQuery = useRef('');

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      setHasSearched(false);
      latestSubmittedQuery.current = '';
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      latestSubmittedQuery.current = trimmedQuery;

      try {
        const nextResults = await golearrnApi.searchCourses(trimmedQuery);
        setResults(nextResults);
        setHasSearched(true);
      } catch (nextError) {
        setResults([]);
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Unable to search courses right now.',
        );
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [query]);

  async function retrySearch() {
    const trimmedQuery = latestSubmittedQuery.current || query.trim();

    if (!trimmedQuery) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextResults = await golearrnApi.searchCourses(trimmedQuery);
      setResults(nextResults);
      setHasSearched(true);
    } catch (nextError) {
      setResults([]);
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Unable to search courses right now.',
      );
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer
      eyebrow="Search"
      title="Find courses fast"
      subtitle="Use the live GOLEARRN search endpoint to search real catalog results by title, instructor, or topic."
    >
      <AppHeader
        title="Live course search"
        subtitle="Results come directly from the mobile search API. No mock fallback is used."
      />
      <TextField
        autoCapitalize="none"
        label="Search courses"
        onChangeText={setQuery}
        placeholder="Try product design, Excel, or a tutor name"
        value={query}
      />
      <SectionHeader
        title="Search results"
        subtitle="Search starts automatically after a short pause while typing."
      />
      {!query.trim() ? (
        <EmptyState
          title="Start searching GOLEARRN"
          description="Type a course topic, instructor name, or skill area to search the live catalog."
          imageSource={require('../../assets/placeholders/empty-search.png')}
        />
      ) : null}
      {isLoading ? <LoadingState label="Searching live courses..." /> : null}
      {!isLoading && error ? (
        <ErrorState
          title="We couldn't search courses"
          description={error}
          actionLabel="Retry"
          onAction={retrySearch}
        />
      ) : null}
      {!isLoading && !error && hasSearched && results.length === 0 ? (
        <EmptyState
          title="No matching courses found"
          description="Try a different phrase or broaden your search to explore more of the live catalog."
          imageSource={require('../../assets/placeholders/empty-search.png')}
        />
      ) : null}
      {!isLoading && !error && hasSearched ? (
        <Text style={styles.resultMeta}>
          {results.length} result{results.length === 1 ? '' : 's'} for "{latestSubmittedQuery.current}"
        </Text>
      ) : null}
      {!isLoading &&
        !error &&
        results.map((course) => (
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
  resultMeta: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
});
