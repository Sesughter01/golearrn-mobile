export type RootRoute =
  | { name: 'splash' }
  | { name: 'welcome' }
  | { name: 'login' }
  | { name: 'forgot-password' }
  | { name: 'register' }
  | { name: 'dashboard' }
  | { name: 'catalog' }
  | { name: 'search' }
  | { name: 'course-details'; params: { courseId: string } }
  | { name: 'course-player'; params: { courseId: string; lessonId?: string } }
  | { name: 'profile' };

export type LearnerSessionStatus = 'guest' | 'bootstrapping' | 'authenticated';

export type AppNavigatorValue = {
  currentRoute: RootRoute;
  canGoBack: boolean;
  goBack: () => void;
  navigate: (route: RootRoute) => void;
  reset: (route: RootRoute) => void;
};
