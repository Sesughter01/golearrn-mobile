import { AuthUser } from './api';
import { CourseSummary } from './course';

export type LearnerDashboardStats = {
  enrolledCourses: number;
  inProgressCourses: number;
  completedCourses: number;
};

export type ContinueLearningItem = CourseSummary;

export type EnrolledCourseItem = CourseSummary;

export type LearnerDashboard = {
  user: AuthUser | null;
  continueLearning: ContinueLearningItem[];
  recommendedCourses: CourseSummary[];
  stats: LearnerDashboardStats | null;
};
