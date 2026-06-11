import { API_TODOS, APP_CONFIG } from '../../constants/config';
import {
  ApiEnvelope,
  AppConfigResponse,
  AuthUser,
  MobileSearchMeta,
  QrResolveResponse,
} from '../../types/api';
import {
  ContinueLearningItem,
  EnrolledCourseItem,
  LearnerDashboard,
  LearnerDashboardStats,
} from '../../types/dashboard';
import { CourseDetails, CourseSummary, CourseTranslationState } from '../../types/course';
import {
  CoursePlayerChapter,
  CoursePlayerData,
  CoursePlayerLesson,
  CoursePlayerNavigation,
  CoursePlayerPlayback,
  CoursePlayerProgress,
  CourseProgressEventPayload,
} from '../../types/player';
import { devLog } from '../../utils/devLogger';
import { htmlToPlainText } from '../../utils/html';
import { apiRequest } from './client';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type MobileCourseListItem = {
  id: number | string;
  slug: string;
  title: string;
  short_description?: string | null;
  thumbnail_url?: string | null;
  category?: { name?: string | null } | null;
  instructor?: { name?: string | null } | null;
  pricing?: {
    currency?: string | null;
    effective_price?: number | string | null;
    is_free?: boolean | null;
  } | null;
  rating?: { average?: number | null } | null;
  lesson_count?: number | null;
  enrollment_count?: number | null;
  language?: { id?: number | string | null; name?: string | null } | null;
  translation?: { ai_translation_enabled?: boolean | null; state?: string | null } | null;
  enrollment_status?: string | null;
  level?: string | null;
  description?: string | null;
  chapter_count?: number | null;
  progress_percent?: number | null;
  last_lesson?: {
    id?: number | string | null;
    slug?: string | null;
    title?: string | null;
  } | null;
  last_accessed_at?: string | null;
};

type MobileCourseDetails = MobileCourseListItem & {
  description?: string | null;
  chapters?: Array<{
    id?: number | string | null;
    title?: string | null;
    lessons?: Array<{
      id?: number | string | null;
      title?: string | null;
      duration?: string | null;
      type?: 'video' | 'reading' | 'quiz' | string | null;
    }> | null;
  }> | null;
};

type MobileAuthEnvelope = {
  user: AuthUser;
  token?: string;
  token_type?: string;
};

type MobileSearchResponse = {
  query: string;
  results: MobileCourseListItem[];
  search_meta?: MobileSearchMeta;
};

type MobileLearnerDashboardResponse = {
  user?: AuthUser | null;
  continue_learning?: MobileCourseListItem[] | null;
  recommended_courses?: MobileCourseListItem[] | null;
  stats?: {
    enrolled_courses?: number | null;
    in_progress_courses?: number | null;
    completed_courses?: number | null;
  } | null;
};

type MobilePlayerLessonItem = {
  id?: number | string | null;
  slug?: string | null;
  title?: string | null;
  type?: 'video' | 'reading' | 'quiz' | string | null;
  duration?: string | null;
  duration_seconds?: number | null;
  completed?: boolean | null;
  is_completed?: boolean | null;
  resume_position_seconds?: number | null;
  translation?: { state?: string | null; ai_translation_enabled?: boolean | null } | null;
};

type MobilePlayerChapterItem = {
  id?: number | string | null;
  title?: string | null;
  translation?: { state?: string | null; ai_translation_enabled?: boolean | null } | null;
  lessons?: MobilePlayerLessonItem[] | null;
};

type MobilePlayerResponse = {
  course?: MobileCourseDetails | null;
  access?: {
    can_play?: boolean | null;
    enrolled?: boolean | null;
    requires_web_handoff?: boolean | null;
    web_url?: string | null;
  } | null;
  progress?: {
    percent?: number | null;
    completed_lessons?: number | null;
    total_lessons?: number | null;
    resume_position_seconds?: number | null;
  } | null;
  current_lesson?: MobilePlayerLessonItem | null;
  navigation?: {
    previous_lesson_id?: number | string | null;
    next_lesson_id?: number | string | null;
  } | null;
  playback?: {
    resume_position_seconds?: number | null;
    duration_seconds?: number | null;
    media_url?: string | null;
    media_type?: string | null;
  } | null;
  chapters?: MobilePlayerChapterItem[] | null;
} & MobileCourseDetails;

function unwrapData<T>(envelope: ApiEnvelope<T>) {
  return envelope.data;
}

function normalizeAuthUser(user: AuthUser | { user?: AuthUser }) {
  if ('user' in user && user.user) {
    return user.user;
  }

  return user as AuthUser;
}

function mapTranslationState(
  translation?: MobileCourseListItem['translation'],
): CourseTranslationState {
  const explicitState = translation?.state?.toLowerCase();

  if (
    explicitState === 'original' ||
    explicitState === 'pending' ||
    explicitState === 'partial' ||
    explicitState === 'translated' ||
    explicitState === 'failed'
  ) {
    return explicitState;
  }

  if (translation?.ai_translation_enabled) {
    return 'translated';
  }

  return 'original';
}

function formatPrice(
  pricing?: MobileCourseListItem['pricing'],
): { label: string; isFree: boolean } {
  if (pricing?.is_free) {
    return { label: 'Free', isFree: true };
  }

  if (pricing?.effective_price != null && pricing?.currency) {
    return {
      label: `${pricing.currency} ${pricing.effective_price}`,
      isFree: false,
    };
  }

  return {
    label: 'Enroll via Web',
    isFree: false,
  };
}

function mapCourseSummary(course: MobileCourseListItem): CourseSummary {
  const price = formatPrice(course.pricing);
  const enrolled =
    course.enrollment_status === 'enrolled' ||
    course.enrollment_status === 'active' ||
    course.enrollment_status === 'purchased';

  return {
    id: String(course.id),
    slug: course.slug,
    title: course.title,
    instructor: course.instructor?.name ?? 'GOLEARRN Instructor',
    description: htmlToPlainText(course.short_description ?? course.description) || 'Course details coming soon.',
    lessonsCount: course.lesson_count ?? 0,
    level: course.level ?? 'All Levels',
    language: course.language?.name ?? 'English',
    translationState: mapTranslationState(course.translation),
    enrolled,
    thumbnailUrl: course.thumbnail_url ?? null,
    category: course.category?.name ?? undefined,
    enrollmentCount: course.enrollment_count ?? undefined,
    ratingAverage: course.rating?.average ?? null,
    priceLabel: price.label,
    isFree: price.isFree,
    progressPercent: course.progress_percent ?? undefined,
    lastLesson: course.last_lesson
      ? {
          id: String(course.last_lesson.id ?? ''),
          slug: course.last_lesson.slug ?? undefined,
          title: course.last_lesson.title ?? 'Continue learning',
        }
      : null,
    lastAccessedAt: course.last_accessed_at ?? null,
    enrollmentStatus: course.enrollment_status ?? undefined,
  };
}

function mapCourseDetails(course: MobileCourseDetails): CourseDetails {
  const summary = mapCourseSummary(course);

  return {
    ...summary,
    description: htmlToPlainText(course.description) || summary.description,
    lessonCount: course.lesson_count ?? summary.lessonsCount,
    chapterCount: course.chapter_count ?? course.chapters?.length ?? undefined,
    estimatedDuration: undefined,
    enrollmentCta: summary.enrolled ? 'Continue Learning' : 'Enroll via Web',
    chapters:
      course.chapters?.map((chapter, chapterIndex) => ({
        id: String(chapter.id ?? `chapter-${chapterIndex + 1}`),
        title: htmlToPlainText(chapter.title) || `Chapter ${chapterIndex + 1}`,
        lessons:
          chapter.lessons?.map((lesson, lessonIndex) => ({
            id: String(lesson.id ?? `lesson-${chapterIndex + 1}-${lessonIndex + 1}`),
            title: htmlToPlainText(lesson.title) || `Lesson ${lessonIndex + 1}`,
            duration: lesson.duration ?? 'TBD',
            type:
              lesson.type === 'reading' || lesson.type === 'quiz' || lesson.type === 'video'
                ? lesson.type
                : 'video',
          })) ?? [],
      })) ?? [],
  };
}

function normalizeLessonType(type?: string | null): 'video' | 'reading' | 'quiz' {
  if (type === 'reading' || type === 'quiz' || type === 'video') {
    return type;
  }

  return 'video';
}

function formatDurationLabel(duration?: string | null, durationSeconds?: number | null) {
  if (duration) {
    return duration;
  }

  if (typeof durationSeconds === 'number' && durationSeconds > 0) {
    const minutes = Math.max(1, Math.round(durationSeconds / 60));
    return `${minutes} min`;
  }

  return 'TBD';
}

function mapPlayerLesson(lesson: MobilePlayerLessonItem, fallbackIndex: number): CoursePlayerLesson {
  return {
    id: String(lesson.id ?? `lesson-${fallbackIndex + 1}`),
    slug: lesson.slug ?? undefined,
    title: htmlToPlainText(lesson.title) || `Lesson ${fallbackIndex + 1}`,
    type: normalizeLessonType(lesson.type),
    duration: formatDurationLabel(lesson.duration, lesson.duration_seconds),
    durationSeconds: lesson.duration_seconds ?? null,
    completed: lesson.completed ?? lesson.is_completed ?? false,
    resumePositionSeconds: lesson.resume_position_seconds ?? 0,
    translationState: mapTranslationState(lesson.translation),
  };
}

function mapPlayerChapters(chapters?: MobilePlayerChapterItem[] | null): CoursePlayerChapter[] {
  return (
    chapters?.map((chapter, chapterIndex) => ({
      id: String(chapter.id ?? `chapter-${chapterIndex + 1}`),
      title: htmlToPlainText(chapter.title) || `Chapter ${chapterIndex + 1}`,
      translationState: mapTranslationState(chapter.translation),
      lessons:
        chapter.lessons?.map((lesson, lessonIndex) =>
          mapPlayerLesson(lesson, chapterIndex * 100 + lessonIndex),
        ) ?? [],
    })) ?? []
  );
}

function mapPlayerProgress(
  progress?: MobilePlayerResponse['progress'],
  course?: MobileCourseDetails | null,
): CoursePlayerProgress {
  const totalLessonsFromCourse = course?.lesson_count ?? 0;

  return {
    percent: progress?.percent ?? course?.progress_percent ?? 0,
    completedLessons: progress?.completed_lessons ?? 0,
    totalLessons: progress?.total_lessons ?? totalLessonsFromCourse,
    resumePositionSeconds: progress?.resume_position_seconds ?? 0,
  };
}

function mapPlayerNavigation(
  navigation?: MobilePlayerResponse['navigation'],
): CoursePlayerNavigation {
  return {
    previousLessonId:
      navigation?.previous_lesson_id != null ? String(navigation.previous_lesson_id) : null,
    nextLessonId: navigation?.next_lesson_id != null ? String(navigation.next_lesson_id) : null,
  };
}

function mapPlayerPlayback(
  playback?: MobilePlayerResponse['playback'],
  currentLesson?: MobilePlayerLessonItem | null,
): CoursePlayerPlayback {
  return {
    resumePositionSeconds:
      playback?.resume_position_seconds ?? currentLesson?.resume_position_seconds ?? 0,
    durationSeconds: playback?.duration_seconds ?? currentLesson?.duration_seconds ?? null,
    mediaUrl: playback?.media_url ?? null,
    mediaType: playback?.media_type ?? currentLesson?.type ?? null,
  };
}

function mapCoursePlayerData(data: MobilePlayerResponse): CoursePlayerData {
  const coursePayload = data.course ?? data;
  const course = mapCourseSummary(coursePayload);
  const chapters = mapPlayerChapters(data.chapters ?? coursePayload.chapters);
  const progress = mapPlayerProgress(data.progress, coursePayload);
  const currentLesson = data.current_lesson
    ? mapPlayerLesson(data.current_lesson, 0)
    : chapters.flatMap((chapter) => chapter.lessons)[0] ?? null;

  return {
    course: {
      ...course,
      progressPercent: progress.percent,
    },
    access: {
      canPlay: data.access?.can_play ?? true,
      enrolled: data.access?.enrolled ?? course.enrolled ?? false,
      requiresWebHandoff: data.access?.requires_web_handoff ?? false,
      webUrl: data.access?.web_url ?? null,
    },
    progress,
    currentLesson,
    navigation: mapPlayerNavigation(data.navigation),
    playback: mapPlayerPlayback(data.playback, data.current_lesson),
    chapters,
  };
}

function mapLearnerDashboardStats(
  stats?: MobileLearnerDashboardResponse['stats'],
): LearnerDashboardStats | null {
  if (!stats) {
    return null;
  }

  return {
    enrolledCourses: stats.enrolled_courses ?? 0,
    inProgressCourses: stats.in_progress_courses ?? 0,
    completedCourses: stats.completed_courses ?? 0,
  };
}

function mapLearnerDashboard(data: MobileLearnerDashboardResponse): LearnerDashboard {
  return {
    user: data.user ?? null,
    continueLearning: (data.continue_learning ?? []).map(
      (course) => mapCourseSummary(course) as ContinueLearningItem,
    ),
    recommendedCourses: (data.recommended_courses ?? []).map(mapCourseSummary),
    stats: mapLearnerDashboardStats(data.stats),
  };
}

export const golearrnApi = {
  async getAppConfig() {
    const response = await apiRequest<AppConfigResponse>('/app/config');
    return unwrapData(response);
  },

  async getCourses() {
    const response = await apiRequest<MobileCourseListItem[]>('/courses');
    return unwrapData(response).map(mapCourseSummary);
  },

  async getCourseDetails(slug: string) {
    const response = await apiRequest<MobileCourseDetails>(`/courses/${encodeURIComponent(slug)}`);
    return mapCourseDetails(unwrapData(response));
  },

  async searchCourses(query: string) {
    const trimmedQuery = query.trim();
    devLog('Semantic search request', {
      method: 'GET',
      path: '/search/courses',
      params: { q: trimmedQuery },
    });
    const response = await apiRequest<MobileSearchResponse>(
      `/search/courses?q=${encodeURIComponent(trimmedQuery)}`,
    );
    return {
      query: unwrapData(response).query,
      results: unwrapData(response).results.map(mapCourseSummary),
      meta: unwrapData(response).search_meta,
    };
  },

  async fetchLearnerDashboard() {
    const response = await apiRequest<MobileLearnerDashboardResponse>('/dashboard', {
      requiresAuth: true,
    });
    return mapLearnerDashboard(unwrapData(response));
  },

  async register(payload: RegisterPayload) {
    const response = await apiRequest<MobileAuthEnvelope>('/auth/register', {
      method: 'POST',
      body: payload,
    });
    const data = unwrapData(response);
    return {
      token: data.token ?? '',
      user: normalizeAuthUser(data.user),
    };
  },

  async login(payload: LoginPayload) {
    const response = await apiRequest<MobileAuthEnvelope>('/auth/login', {
      method: 'POST',
      body: payload,
    });
    const data = unwrapData(response);
    return {
      token: data.token ?? '',
      user: normalizeAuthUser(data.user),
    };
  },

  async getMe() {
    const response = await apiRequest<{ user: AuthUser }>('/auth/me', {
      requiresAuth: true,
    });
    return normalizeAuthUser(unwrapData(response));
  },

  async logout() {
    const response = await apiRequest<null>('/auth/logout', {
      method: 'POST',
      requiresAuth: true,
    });
    return unwrapData(response);
  },

  async forgotPassword(email: string) {
    const response = await apiRequest<{ email: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      timeoutMs: 30000,
    });
    return unwrapData(response);
  },

  async resolveQr(code: string) {
    // TODO: Confirm signed QR payload parsing rules before native onboarding is enabled.
    // TODO: Confirm how /qr/resolve maps to mobile registration handoff and fallback web routing.
    const response = await apiRequest<QrResolveResponse>(
      `/qr/resolve?code=${encodeURIComponent(code)}`,
    );
    return unwrapData(response);
  },

  async fetchCourses() {
    return this.getCourses();
  },

  async fetchCourseDetails(slug: string) {
    return this.getCourseDetails(slug);
  },

  async fetchEnrolledCourses() {
    const response = await apiRequest<MobileCourseListItem[]>('/courses/enrolled', {
      requiresAuth: true,
    });
    return unwrapData(response).map((course) => mapCourseSummary(course) as EnrolledCourseItem);
  },

  async getCoursePlayer(slug: string, lessonId?: number | string) {
    const query = lessonId ? `?lesson_id=${encodeURIComponent(lessonId)}` : '';
    const response = await apiRequest<MobilePlayerResponse>(
      `/courses/${encodeURIComponent(slug)}/player${query}`,
      {
        requiresAuth: true,
      },
    );
    return mapCoursePlayerData(unwrapData(response));
  },

  async saveLessonProgress(
    slug: string,
    lessonId: number | string,
    payload: CourseProgressEventPayload,
  ) {
    const response = await apiRequest<Record<string, unknown>>(
      `/courses/${encodeURIComponent(slug)}/lessons/${encodeURIComponent(lessonId)}/progress`,
      {
        method: 'POST',
        requiresAuth: true,
        body: payload,
      },
    );
    return unwrapData(response);
  },

  async fetchCoursePlayer(slug: string, lessonId?: string) {
    return this.getCoursePlayer(slug, lessonId);
  },

  async saveCourseLessonProgress(
    slug: string,
    lessonId: string,
    payload: CourseProgressEventPayload,
  ) {
    return this.saveLessonProgress(slug, lessonId, payload);
  },

  async fetchTranslatedCourseContent(courseId: string) {
    // TODO: Confirm translation status API before requesting translated lesson payloads.
    return Promise.resolve({
      courseId,
      state: 'original',
      message: API_TODOS.translationState,
    });
  },

  buildCourseWebUrl(slug: string) {
    return `${APP_CONFIG.webBaseUrl}/courses/${slug}`;
  },
};
