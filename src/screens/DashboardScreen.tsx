import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseSummary } from '../types/course';

const dashboardBackground = require('../../assets/backgrounds/dashboard-bg.png');

export function DashboardScreen() {
  const navigation = useAppNavigation();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadCourses() {
    setIsLoading(true);
    setError(null);

    try {
      const courses = await golearrnApi.fetchEnrolledCourses();
      setEnrolledCourses(courses);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load courses.');
      setEnrolledCourses([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  const featuredCourse = enrolledCourses[0];

  return (
    <ScreenContainer
      eyebrow="Learner Home"
      title="Your learning dashboard"
      subtitle="A cleaner learner-first home for continuing lessons and exploring live GOLEARRN courses."
    >
      <AppHeader
        title={user ? `Welcome back, ${user.name}` : 'Welcome back'}
        subtitle="GOLEARRN keeps your learning close, even while the dedicated learner dashboard API is still pending."
      />
      <ImageBackground
        source={dashboardBackground}
        imageStyle={styles.heroImage}
        style={styles.heroCard}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroEyebrow}>Internal release preview</Text>
          <Text style={styles.heroTitle}>Your next course is one tap away.</Text>
          <Text style={styles.heroBody}>
            This hero uses the official GOLEARRN asset pack while learner-specific recommendations and live progress APIs are still pending.
          </Text>
        </View>
      </ImageBackground>
      <SectionHeader
        title="Continue learning"
        subtitle="This section stays honest about what is live today versus what still needs backend support."
      />
      {isLoading ? <LoadingState label="Preparing your learning overview..." /> : null}
      {!isLoading && error ? (
        <ErrorState
          title="We couldn't load your learner view"
          description={error}
          actionLabel="Retry"
          onAction={loadCourses}
        />
      ) : null}
      {!isLoading && !error && featuredCourse ? (
        <CourseCard
          course={featuredCourse}
          onPress={() =>
            navigation.navigate({ name: 'course-details', params: { courseId: featuredCourse.slug } })
          }
        />
      ) : null}
      {!isLoading && !error && !featuredCourse ? (
        <EmptyState
          title="Your enrolled learning feed is still limited"
          description="The dedicated learner dashboard and enrolled-course APIs are still pending, so this screen falls back to public course data where possible."
          imageSource={require('../../assets/placeholders/empty-courses.png')}
          actionLabel="Explore courses"
          onAction={() => navigation.navigate({ name: 'catalog' })}
        />
      ) : null}
      <SectionHeader
        title="Keep learning"
        subtitle="Browse the live catalog while richer learner-specific recommendations are still pending."
      />
      <View style={styles.actionRow}>
        <PrimaryButton
          label="Explore courses"
          onPress={() => navigation.navigate({ name: 'catalog' })}
        />
        <PrimaryButton
          label="View profile"
          variant="secondary"
          onPress={() => navigation.navigate({ name: 'profile' })}
        />
      </View>
      <Text style={styles.note}>
        Full learner dashboard, live progress, recommendations, and notifications still require dedicated backend endpoints.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    gap: SPACING.sm,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 24,
  },
  heroOverlay: {
    backgroundColor: COLORS.overlayStrong,
    gap: SPACING.sm,
    minHeight: 220,
    justifyContent: 'flex-end',
    padding: SPACING.lg,
  },
  heroEyebrow: {
    color: COLORS.primaryCyan,
    fontSize: FONT_SIZES.xs,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
  },
  heroBody: {
    color: COLORS.onDarkText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
  },
  note: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 21,
  },
});
