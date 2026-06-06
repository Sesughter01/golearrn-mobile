import { API_TODOS } from '../../constants/config';
import { CourseDetails, CourseSummary } from '../../types/course';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

const mockCourses: CourseSummary[] = [
  {
    id: 'course-english-skills',
    title: 'English Skills for Career Growth',
    instructor: 'GOLEARRN Faculty',
    description: 'Build confidence in practical communication for work and study.',
    lessonsCount: 18,
    translationState: 'translated',
    enrolled: true,
  },
  {
    id: 'course-digital-marketing',
    title: 'Digital Marketing Fundamentals',
    instructor: 'GOLEARRN Faculty',
    description: 'Learn campaign basics, audience targeting, and performance tracking.',
    lessonsCount: 24,
    translationState: 'partial',
  },
  {
    id: 'course-data-literacy',
    title: 'Data Literacy for Everyday Decisions',
    instructor: 'GOLEARRN Faculty',
    description: 'Understand charts, reporting, and learner-friendly data reasoning.',
    lessonsCount: 14,
    translationState: 'pending',
  },
];

export const golearrnApi = {
  async login(_payload: LoginPayload) {
    // TODO: Confirm learner mobile auth endpoint and anti-bot requirements.
    return Promise.resolve({
      ok: false,
      message: API_TODOS.authEndpoint,
    });
  },

  async register(_payload: RegisterPayload) {
    // TODO: Confirm learner registration, OTP verification, and reCAPTCHA requirements.
    return Promise.resolve({
      ok: false,
      message: API_TODOS.authEndpoint,
    });
  },

  async fetchCourses() {
    // TODO: Replace mock data after confirming the mobile course catalog API.
    return Promise.resolve(mockCourses);
  },

  async fetchCourseDetails(courseId: string) {
    // TODO: Confirm course detail, chapter, and lesson payload contract.
    const course = mockCourses.find((item) => item.id === courseId) ?? mockCourses[0];

    const details: CourseDetails = {
      ...course,
      chapters: [
        {
          id: 'chapter-1',
          title: 'Getting Started',
          lessons: [
            { id: 'lesson-1', title: 'Welcome to GOLEARRN', duration: '04:20', type: 'video' },
            { id: 'lesson-2', title: 'How Learning Paths Work', duration: '06:10', type: 'reading' },
          ],
        },
        {
          id: 'chapter-2',
          title: 'Knowledge Check',
          lessons: [
            { id: 'lesson-3', title: 'Practice Quiz', duration: '08:00', type: 'quiz' },
          ],
        },
      ],
    };

    return Promise.resolve(details);
  },

  async fetchEnrolledCourses() {
    // TODO: Confirm learner enrollment library endpoint and progress summary shape.
    return Promise.resolve(mockCourses.filter((course) => course.enrolled));
  },

  async fetchTranslatedCourseContent(courseId: string) {
    // TODO: Confirm translation state API and progressive content delivery behavior.
    return Promise.resolve({
      courseId,
      state: 'partial',
      message: API_TODOS.translationState,
    });
  },
};
