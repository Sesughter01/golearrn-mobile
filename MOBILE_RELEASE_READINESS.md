# GOLEARRN Mobile Release Readiness

Use this checklist before preparing production builds for Android and iOS.

## Expo And EAS Readiness

- [ ] Confirm Expo SDK version and React Native version are production-approved.
- [x] Add `eas.json` with preview APK and production AAB profiles.
- [ ] Confirm EAS project setup and ownership.
- [ ] Verify the app runs cleanly in Expo Go and on local device builds.

## Android Package Name

- [x] Add placeholder Android package name `com.golearrn.mobile` to Expo config.
- [ ] Confirm the final Android application ID for production release.
- [ ] Reserve any required signing configuration and Play Console setup.

## iOS Bundle Identifier

- [x] Add placeholder iOS bundle identifier `com.golearrn.mobile` to Expo config.
- [ ] Confirm the final iOS bundle identifier for production release.
- [ ] Prepare the Apple Developer app record and signing configuration.

## Environment Variables

- [ ] Define development, staging, and production API base URLs.
- [ ] Decide how Expo public env vars will be used.
- [ ] Confirm no secrets are embedded in the client app.
- [x] Confirm no Expo access token is committed in the client app or workflow files.

## App Icon And Splash Screen

- [x] Replace scaffold icons with GOLEARRN production branding.
- [x] Replace placeholder splash assets and confirm safe padding on both platforms.
- [ ] Test icon and splash rendering on multiple device sizes.

## GOLEARRN Branded Assets

- App assets now live under `assets/app/`:
  `icon.png`, `adaptive-icon.png`, `splash.png`, `favicon.png`
- Logo assets now live under `assets/logo/`
- Background and hero artwork now live under `assets/backgrounds/` and `assets/branding/`
- Placeholder assets now live under `assets/placeholders/`
- `app.json` now points to:
  - `./assets/app/icon.png`
  - `./assets/app/splash.png`
  - `./assets/app/adaptive-icon.png`
  - `./assets/app/favicon.png`
- A new EAS build is required before icon and splash changes appear in a generated APK.

## Google Play Store Assets

- [ ] Prepare Play Store icon, feature graphic, screenshots, and listing copy.
- [ ] Confirm category, content rating, and student-facing support contact details.
- [ ] Review store policy impact if any external checkout handoff exists.

## Apple App Store Assets

- [ ] Prepare App Store screenshots, promotional text, and listing copy.
- [ ] Confirm Sign in with Apple requirements if social sign-in expands beyond current scope.
- [ ] Review guideline impact of any web checkout or account flows.

## Privacy Policy

- [ ] Publish a production privacy policy URL.
- [ ] Surface the privacy policy inside the app and store listings.
- [ ] Confirm policy language covers analytics, notifications, and AI-assisted features.

## Terms

- [ ] Publish a production terms URL.
- [ ] Surface the terms inside the app and store listings.
- [ ] Confirm student consent flow if required during registration.

## Account Deletion Support

- [ ] Implement in-app account deletion entry point.
- [ ] Confirm backend deletion endpoint and post-deletion UX.
- [ ] Ensure app store compliance for account deletion discoverability.

## Analytics And Crash Reporting

- [ ] Choose analytics tooling.
- [ ] Choose crash reporting tooling.
- [ ] Define event taxonomy for student onboarding, catalog usage, and lesson engagement.

## Deep Links And Universal Links

- [x] Define custom scheme placeholder `golearrn`.
- [ ] Confirm universal/app link domains and association files.
- [ ] Map routes for auth, QR onboarding, courses, and player screens.
- [ ] Test cold-start and warm-start deep link behavior.

## Push Notifications

- [ ] Choose Expo Notifications or a native push strategy.
- [ ] Confirm backend device registration flow.
- [ ] Define notification categories and student preference controls.

## Payment Policy Review

- [ ] Confirm whether purchases stay on web for MVP.
- [ ] Review Google Play and Apple external payment policy implications.
- [ ] Define a compliant purchase handoff and post-purchase return flow.

## Auth Storage

- [x] `expo-secure-store` is installed and used for bearer token persistence.
- [ ] Validate token restore behavior on physical devices after full app restarts.

## GitHub Actions And Secrets

- [x] Add GitHub Actions workflow for manual Android preview APK builds through EAS.
- [x] Use `${{ secrets.EXPO_TOKEN }}` in GitHub Actions.
- [ ] Add `EXPO_TOKEN` in GitHub repository secrets:
  GitHub -> Repo -> Settings -> Secrets and variables -> Actions -> New repository secret -> `EXPO_TOKEN`
- [x] Confirm no access token is committed to the repository.

## First Internal APK Build Checklist

- [ ] Add `EXPO_TOKEN` to GitHub repository secrets.
- [ ] Run `npx tsc --noEmit`.
- [ ] Test login, restart, `/auth/me` restore, and logout on a physical Android device through Expo Go.
- [ ] Confirm the token is never displayed in UI and never written to logs during the physical-device auth pass.
- [ ] Push the current branch to GitHub.
- [ ] Manually trigger `.github/workflows/android-apk-release.yml`.
- [ ] Open the EAS build link from the workflow output.
- [ ] Download the generated APK from EAS.
- [ ] Install the APK on a test Android phone.

## v0.1.4 Physical Device QA Checklist

### Passed Checks

- [x] Splash screen code path now renders one GOLEARRN logo asset only, with one tagline and one loading indicator.
- [x] SecureStore token persistence remains isolated to `src/services/auth/tokenStorage.ts`.
- [x] Login, register, forgot-password, `/auth/me` bootstrap, and logout flows are wired to live Laravel mobile endpoints.
- [x] Logout clears local session state and returns the app to the guest flow in code.
- [x] Course catalog and course detail screens are wired to the live course APIs.
- [x] Course detail text is sanitized before rendering so raw HTML tags/entities are not shown in the UI.
- [x] Course thumbnail placeholder fallback is present for missing or failed course images.
- [x] No bearer token logging was found in the app code during the QA readiness audit.
- [x] `npx tsc --noEmit` passes on the current codebase.

### Pending Checks

- [ ] Confirm splash layout on a physical Android device after cold start.
- [ ] Confirm login works with a real student account on device.
- [ ] Confirm register works with a real student account on device.
- [ ] Confirm forgot-password submission works end-to-end on device.
- [ ] Confirm app restart restores the authenticated session through `/auth/me` on device.
- [ ] Confirm logout clears SecureStore on device and returns to the guest flow cleanly.
- [ ] Confirm course catalog loads successfully from the live API on device.
- [ ] Confirm course detail loads successfully from the live API on device.
- [ ] Confirm user-facing API/network errors remain readable during real network failure testing.
- [ ] Confirm the token never appears in device logs during a physical-device auth pass.

### Known Limitations

- quiz API is not implemented yet
- Google mobile login is pending
- OTP mobile auth is pending
- payment remains web handoff only

### Backend Dependencies Still Missing

- quiz API
- native Google mobile sign-in exchange
- OTP mobile auth flow
- push notification registration API
- account deletion endpoint
- completed QR onboarding/native handoff contract

## Post-v0.1.4 Search UX Readiness

- Dedicated live search screen is now part of the mobile flow and uses `GET /search/courses`.
- Catalog remains stable and still supports local filtering on already loaded results.
- Physical-device checks should now include:
  - Splash
  - Welcome
  - Login
  - Search
  - Catalog
  - Course Detail
  - Profile
  - Token restore after app restart
  - Logout
- Verify live search on device with:
  - a successful query returning real results
  - an empty-result query showing the branded empty-search state
  - a temporary offline/network-failure case showing the retry-friendly error state

## Physical Android Validation Checklist

- Verify splash shows one GOLEARRN logo, one tagline, and one loading indicator.
- Verify login succeeds with a real student account.
- Verify register succeeds with a new student account.
- Verify forgot-password submission shows the neutral success message.
- Verify app restart restores the student session through `/auth/me`.
- Verify logout clears local session state and returns to the guest flow.
- Verify catalog loads from the live API and retry works after a temporary network interruption.
- Verify live search returns real results, empty results, and a retry-friendly error state when offline.
- Verify course detail loads from the live API, does not show raw HTML, and supports retry after a failed request.
- Verify profile reflects the restored authenticated session after app restart.

## Network Failure Test Checklist

- Put the Android device briefly offline before login and confirm the app shows a connection-focused error message.
- Repeat with register and forgot-password flows.
- Interrupt connectivity during catalog loading and confirm retry works.
- Interrupt connectivity during live search and confirm retry works.
- Interrupt connectivity during course detail loading and confirm retry works.
- Simulate a slow connection and confirm timeout messaging is understandable.
- Confirm no token or password appears in visible error messages or development logs.

## Dashboard Integration Readiness Notes

- The dashboard now consumes `GET /dashboard` for student identity, continue-learning content, and stats.
- `fetchEnrolledCourses()` now consumes `GET /courses/enrolled` and no longer falls back to the public catalog.
- `recommended_courses` may legitimately be empty, so the UI should continue treating recommendations as optional.
- Player/progress endpoints are now available, so the next dashboard-facing backend additions should focus on reliable progress refresh behavior, playback resume depth, and reminder-style summaries.

## QA Findings Resolved After v0.1.4

- Semantic search contract mismatch fixed:
  - mobile now sends `GET /search/courses?q=...`
  - mobile now reads `data.results` instead of assuming the response data is a flat array
- Restored session hydration fixed:
  - `/auth/me` returns `data.user`
  - mobile now unwraps the nested user correctly so the dashboard can display the student name after restart
- Forgot-password timeout handling improved:
  - mobile now allows a longer timeout window for reset-email requests
  - successful reset-link requests should no longer be mislabeled as timeouts during normal slow email delivery
- Semantic search fallback messaging added:
  - when backend reports fallback mode, mobile now shows a friendly keyword-search note instead of exposing raw API behavior
- Student dashboard integration updated:
  - mobile dashboard now consumes `GET /dashboard`
  - mobile enrolled library now consumes `GET /courses/enrolled`
  - the old public-course fallback for student dashboard data has been removed
