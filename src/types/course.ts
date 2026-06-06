export type CourseTranslationState =
  | 'original'
  | 'pending'
  | 'partial'
  | 'translated'
  | 'failed';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseSummary = {
  id: string;
  title: string;
  instructor: string;
  description: string;
  lessonsCount: number;
  level: CourseLevel;
  language: string;
  translationState: CourseTranslationState;
  enrolled?: boolean;
  progressPercent?: number;
};

export type CourseDetails = CourseSummary & {
  lessonCount: number;
  chapterCount: number;
  estimatedDuration: string;
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
