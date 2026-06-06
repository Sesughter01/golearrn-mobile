import { APP_CONFIG } from '../constants/config';
import { RootRoute } from '../types/navigation';

export function buildRoutePath(route: RootRoute) {
  switch (route.name) {
    case 'splash':
      return '/';
    case 'welcome':
      return '/welcome';
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'dashboard':
      return '/app';
    case 'catalog':
      return '/courses';
    case 'course-details':
      return `/courses/${route.params.courseId}`;
    case 'course-player':
      return `/courses/${route.params.courseId}/player${
        route.params.lessonId ? `?lesson=${route.params.lessonId}` : ''
      }`;
    case 'profile':
      return '/profile';
  }
}

export function buildQrOnboardingUrl(code: string) {
  return `${APP_CONFIG.webBaseUrl}/register/scan?code=${encodeURIComponent(code)}`;
}
