import { API_TODOS, APP_CONFIG } from '../../constants/config';
import {
  ApiEnvelope,
  AppConfigResponse,
  AuthTokenPayload,
  AuthUser,
  QrResolveResponse,
} from '../../types/api';
import { CourseDetails, CourseSummary, CourseTranslationState } from '../../types/course';
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
  language?: { name?: string | null } | null;
  translation?: { ai_translation_enabled?: boolean | null } | null;
  enrollment_status?: string | null;
  level?: string | null;
  description?: string | null;
  chapter_count?: number | null;
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

function unwrapData<T>(envelope: ApiEnvelope<T>) {
  return envelope.data;
}

function mapTranslationState(enabled?: boolean | null): CourseTranslationState {
  if (enabled) {
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
    description: course.short_description ?? course.description ?? 'Course details coming soon.',
    lessonsCount: course.lesson_count ?? 0,
    level: course.level ?? 'All Levels',
    language: course.language?.name ?? 'English',
    translationState: mapTranslationState(course.translation?.ai_translation_enabled),
    enrolled,
    thumbnailUrl: course.thumbnail_url ?? null,
    category: course.category?.name ?? undefined,
    enrollmentCount: course.enrollment_count ?? undefined,
    ratingAverage: course.rating?.average ?? null,
    priceLabel: price.label,
    isFree: price.isFree,
  };
}

function mapCourseDetails(course: MobileCourseDetails): CourseDetails {
  const summary = mapCourseSummary(course);

  return {
    ...summary,
    description: course.description ?? summary.description,
    lessonCount: course.lesson_count ?? summary.lessonsCount,
    chapterCount: course.chapter_count ?? course.chapters?.length ?? undefined,
    estimatedDuration: undefined,
    enrollmentCta: summary.enrolled ? 'Continue Learning' : 'Enroll via Web',
    chapters:
      course.chapters?.map((chapter, chapterIndex) => ({
        id: String(chapter.id ?? `chapter-${chapterIndex + 1}`),
        title: chapter.title ?? `Chapter ${chapterIndex + 1}`,
        lessons:
          chapter.lessons?.map((lesson, lessonIndex) => ({
            id: String(lesson.id ?? `lesson-${chapterIndex + 1}-${lessonIndex + 1}`),
            title: lesson.title ?? `Lesson ${lessonIndex + 1}`,
            duration: lesson.duration ?? 'TBD',
            type:
              lesson.type === 'reading' || lesson.type === 'quiz' || lesson.type === 'video'
                ? lesson.type
                : 'video',
          })) ?? [],
      })) ?? [],
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
    const response = await apiRequest<MobileCourseListItem[]>(
      `/search/courses?query=${encodeURIComponent(query)}`,
    );
    return unwrapData(response).map(mapCourseSummary);
  },

  async register(payload: RegisterPayload) {
    const response = await apiRequest<AuthTokenPayload>('/auth/register', {
      method: 'POST',
      body: payload,
    });
    return unwrapData(response);
  },

  async login(payload: LoginPayload) {
    const response = await apiRequest<AuthTokenPayload>('/auth/login', {
      method: 'POST',
      body: payload,
    });
    return unwrapData(response);
  },

  async getMe() {
    const response = await apiRequest<AuthUser>('/auth/me', {
      requiresAuth: true,
    });
    return unwrapData(response);
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
    // TODO: Replace this fallback when a learner dashboard or enrolled courses API is available.
    const courses = await this.getCourses();
    return courses.filter((course) => course.enrolled);
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
