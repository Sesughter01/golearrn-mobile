import * as Linking from 'expo-linking';

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

export function buildNativeQrRoute(code?: string) {
  return Linking.createURL(`/register/scan${code ? `?code=${encodeURIComponent(code)}` : ''}`);
}

export function buildWebQrRoute(code?: string) {
  return `${APP_CONFIG.webBaseUrl}/register/scan${code ? `?code=${encodeURIComponent(code)}` : ''}`;
}

export function buildCourseWebUrl(slug: string) {
  return `${APP_CONFIG.webBaseUrl}/courses/${slug}`;
}

// TODO: Parse signed QR payloads once the backend finalizes the native QR onboarding contract.
// TODO: Use /qr/resolve to translate QR codes into native registration handoff destinations.
// TODO: Fallback to the web registration route when native onboarding cannot continue in-app.
