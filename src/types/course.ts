export type CourseTranslationState =
  | 'original'
  | 'pending'
  | 'partial'
  | 'translated'
  | 'failed';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  description: string;
  lessonsCount: number;
  level: CourseLevel | string;
  language: string;
  translationState: CourseTranslationState;
  enrolled?: boolean;
  progressPercent?: number;
  thumbnailUrl?: string | null;
  category?: string;
  enrollmentCount?: number;
  ratingAverage?: number | null;
  priceLabel?: string;
  isFree?: boolean;
  lastLesson?: {
    id: string;
    slug?: string;
    title: string;
  } | null;
  lastAccessedAt?: string | null;
  enrollmentStatus?: string;
};

export type CourseDetails = CourseSummary & {
  lessonCount: number;
  chapterCount?: number;
  estimatedDuration?: string;
  enrollmentCta: 'Continue Learning' | 'Enroll via Web';
  chapters: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      type: 'video' | 'reading' | 'quiz';
      completed?: boolean;
    }>;
  }>;
};
