export const APP_CONFIG = {
  appName: 'GOLEARRN',
  webBaseUrl: 'https://golearrn.com',
  apiBaseUrl: 'https://golearrn.com/api/v1/mobile',
} as const;

export const API_TODOS = {
  authEndpoint: 'TODO: Confirm final mobile auth payloads for /auth/register and /auth/login, including validation and error shapes.',
  tokenStrategy: 'TODO: Persist Laravel Sanctum bearer tokens securely and confirm token refresh or expiry expectations.',
  googleSignIn: 'TODO: Define mobile-safe Google sign-in flow and backend exchange contract.',
  qrOnboarding: 'TODO: Define QR registration handoff from /qr/resolve into native mobile deep links.',
  courseCatalog: 'TODO: Confirm live /courses and /search/courses filtering, pagination, and localization contract.',
  courseEnrollment: 'TODO: Confirm learner enrollment and learner library endpoints beyond public course listing.',
  coursePlayer: 'TODO: Confirm chapters, lessons, assets, progress, and access control endpoints.',
  translationState: 'TODO: Confirm translation status values and partial content delivery shape.',
  ragSearch: 'TODO: Confirm search contract, response latency expectations, and fallbacks.',
  pushNotifications: 'TODO: Define device registration endpoint and notification event schema.',
  accountDeletion: 'TODO: Confirm learner account deletion endpoint and compliance flow.',
} as const;
