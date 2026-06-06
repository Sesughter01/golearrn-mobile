export const APP_CONFIG = {
  appName: 'GOLEARRN',
  webBaseUrl: 'https://golearrn.com',
  apiBaseUrl: 'https://golearrn.com/api',
} as const;

export const API_TODOS = {
  authEndpoint: 'TODO: Confirm learner-facing mobile auth endpoint(s) and payload shapes.',
  tokenStrategy: 'TODO: Confirm token or session strategy for native mobile clients.',
  googleSignIn: 'TODO: Define mobile-safe Google sign-in flow and backend exchange contract.',
  qrOnboarding: 'TODO: Define QR registration handoff from /register/scan into native mobile.',
  courseCatalog: 'TODO: Confirm course catalog filtering, pagination, and localization contract.',
  courseEnrollment: 'TODO: Confirm enrollment and learner library endpoints.',
  coursePlayer: 'TODO: Confirm chapters, lessons, assets, progress, and access control endpoints.',
  translationState: 'TODO: Confirm translation status values and partial content delivery shape.',
  ragSearch: 'TODO: Confirm search contract, response latency expectations, and fallbacks.',
  pushNotifications: 'TODO: Define device registration endpoint and notification event schema.',
  accountDeletion: 'TODO: Confirm learner account deletion endpoint and compliance flow.',
} as const;
