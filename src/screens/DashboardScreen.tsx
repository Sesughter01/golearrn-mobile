import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { Badge } from '../components/Badge';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { InfoCard } from '../components/InfoCard';
import { LoadingState } from '../components/LoadingState';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { useAppNavigation } from '../navigation/navigationContext';
import { golearrnApi } from '../services/api/golearrnApi';
import { CourseSummary } from '../types/course';
import { LearnerDashboard } from '../types/dashboard';

const dashboardBackground = require('../../assets/backgrounds/dashboard-bg.png');

export function DashboardScreen() {
  const navigation = useAppNavigation();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<LearnerDashboard | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseSummary[]>([]);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard() {
    setIsLoading(true);
    setDashboardError(null);
    setLibraryError(null);

    const [dashboardResult, enrolledResult] = await Promise.allSettled([
      golearrnApi.fetchLearnerDashboard(),
      golearrnApi.fetchEnrolledCourses(),
    ]);

    if (dashboardResult.status === 'fulfilled') {
      setDashboard(dashboardResult.value);
    } else {
      setDashboard(null);
      setDashboardError(
        dashboardResult.reason instanceof Error
          ? dashboardResult.reason.message
          : 'Unable to load your student dashboard.',
      );
    }

    if (enrolledResult.status === 'fulfilled') {
      setEnrolledCourses(enrolledResult.value);
    } else {
      setEnrolledCourses([]);
      setLibraryError(
        enrolledResult.reason instanceof Error
          ? enrolledResult.reason.message
          : 'Unable to load your enrolled courses.',
      );
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const continueLearningCourse = dashboard?.continueLearning[0];
  const learnerName = dashboard?.user?.name ?? user?.name;
  const learnerStats = dashboard?.stats;
  const recommendedCourses = dashboard?.recommendedCourses ?? [];

  return (
    <ScreenContainer
      eyebrow="Student Home"
      title="Your learning dashboard"
      subtitle="A cleaner student-first home for continuing lessons and exploring live GOLEARRN courses."
    >
      <AppHeader
        title={learnerName ? `Welcome back, ${learnerName}` : 'Welcome back'}
        subtitle="Your student home now reflects authenticated dashboard data from the live mobile API."
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
            Continue learning with real enrolled-course and dashboard data while recommendations remain intentionally minimal for now.
          </Text>
        </View>
      </ImageBackground>
      <SectionHeader
        title="Continue learning"
        subtitle="This section now uses the live student dashboard payload and tolerates courses with no watch history yet."
      />
      {isLoading ? <LoadingState label="Preparing your learning overview..." /> : null}
      {!isLoading && dashboardError ? (
        <ErrorState
          title="We couldn't load your student view"
          description={dashboardError}
          actionLabel="Retry"
          onAction={loadDashboard}
        />
      ) : null}
      {!isLoading && !dashboardError && learnerStats ? (
        <View style={styles.statsRow}>
          <InfoCard
            accent="soft"
            title={`${learnerStats.enrolledCourses}`}
            description="Enrolled courses"
          />
          <InfoCard
            accent="soft"
            title={`${learnerStats.inProgressCourses}`}
            description="In progress"
          />
          <InfoCard
            accent="soft"
            title={`${learnerStats.completedCourses}`}
            description="Completed"
          />
        </View>
      ) : null}
      {!isLoading && !dashboardError && continueLearningCourse ? (
        <CourseCard
          course={continueLearningCourse}
          onPress={() =>
            continueLearningCourse.lastLesson?.id
              ? navigation.navigate({
                  name: 'course-player',
                  params: {
                    courseId: continueLearningCourse.slug,
                    lessonId: continueLearningCourse.lastLesson.id,
                  },
                })
              : navigation.navigate({
                  name: 'course-details',
                  params: { courseId: continueLearningCourse.slug },
                })
          }
        />
      ) : null}
      {!isLoading && !dashboardError && !continueLearningCourse ? (
        <EmptyState
          title="You have not started a course yet"
          description="Your student dashboard is live, but there is no continue-learning item yet because no lesson history has been recorded."
          imageSource={require('../../assets/placeholders/empty-courses.png')}
          actionLabel="Explore courses"
          onAction={() => navigation.navigate({ name: 'catalog' })}
        />
      ) : null}
      <SectionHeader
        title="Your enrolled library"
        subtitle="This section now uses the dedicated enrolled-courses endpoint instead of falling back to the public catalog."
      />
      {!isLoading && !libraryError && recommendedCourses.length > 0 ? (
        <InfoCard
          title="Recommended courses"
          description={`${recommendedCourses.length} recommendation${recommendedCourses.length === 1 ? '' : 's'} available.`}
          footer={<Badge label="Recommendations live" tone="blue" />}
        />
      ) : null}
      {!isLoading && !libraryError && recommendedCourses.length === 0 ? (
        <Text style={styles.sectionNote}>
          Recommended courses are intentionally empty for now, so the mobile app should not assume recommendation data exists yet.
        </Text>
      ) : null}
      {!isLoading && libraryError ? (
        <ErrorState
          title="We couldn't load your enrolled courses"
          description={libraryError}
          actionLabel="Retry"
          onAction={loadDashboard}
        />
      ) : null}
      {!isLoading && !libraryError && enrolledCourses.length === 0 ? (
        <EmptyState
          title="Your course library is empty"
          description="You are authenticated, but there are no enrolled courses in your student library yet."
          imageSource={require('../../assets/placeholders/empty-courses.png')}
          actionLabel="Explore courses"
          onAction={() => navigation.navigate({ name: 'catalog' })}
        />
      ) : null}
      {!isLoading &&
        !libraryError &&
        enrolledCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() =>
              navigation.navigate({ name: 'course-details', params: { courseId: course.slug } })
            }
          />
        ))}
      <View style={styles.actionRow}>
        <PrimaryButton
          label="Explore courses"
          onPress={() => navigation.navigate({ name: 'catalog' })}
        />
        <PrimaryButton
          label="Search live courses"
          variant="secondary"
          onPress={() => navigation.navigate({ name: 'search' })}
        />
        <PrimaryButton
          label="View profile"
          variant="secondary"
          onPress={() => navigation.navigate({ name: 'profile' })}
        />
      </View>
      <Text style={styles.note}>
        Student dashboard and enrolled-library endpoints are now live. Deeper progress, reminders, and recommendation logic can expand on this foundation later.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    gap: SPACING.sm,
  },
  statsRow: {
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
  sectionNote: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZES.sm,
    lineHeight: 21,
  },
});
