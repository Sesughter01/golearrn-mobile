import { CourseSummary, CourseTranslationState } from './course';

export type CoursePlayerAccess = {
  canPlay: boolean;
  enrolled: boolean;
  requiresWebHandoff: boolean;
  webUrl?: string | null;
};

export type CoursePlayerProgress = {
  percent: number;
  completedLessons: number;
  totalLessons: number;
  resumePositionSeconds: number;
};

export type CoursePlayerPlayback = {
  resumePositionSeconds: number;
  durationSeconds?: number | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
};

export type CoursePlayerLesson = {
  id: string;
  slug?: string;
  title: string;
  type: 'video' | 'reading' | 'quiz';
  duration: string;
  durationSeconds?: number | null;
  completed?: boolean;
  resumePositionSeconds?: number;
  translationState?: CourseTranslationState;
};

export type CoursePlayerChapter = {
  id: string;
  title: string;
  translationState?: CourseTranslationState;
  lessons: CoursePlayerLesson[];
};

export type CoursePlayerNavigation = {
  previousLessonId?: string | null;
  nextLessonId?: string | null;
};

export type CoursePlayerData = {
  course: CourseSummary;
  access: CoursePlayerAccess;
  progress: CoursePlayerProgress;
  currentLesson: CoursePlayerLesson | null;
  navigation: CoursePlayerNavigation;
  playback: CoursePlayerPlayback;
  chapters: CoursePlayerChapter[];
};

export type CourseProgressEventPayload = {
  event: 'progress' | 'completed';
  resume_position_seconds?: number;
  completed?: boolean;
};
