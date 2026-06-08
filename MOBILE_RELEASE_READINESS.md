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
- [ ] Confirm category, content rating, and learner-facing support contact details.
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
- [ ] Confirm learner consent flow if required during registration.

## Account Deletion Support

- [ ] Implement in-app account deletion entry point.
- [ ] Confirm backend deletion endpoint and post-deletion UX.
- [ ] Ensure app store compliance for account deletion discoverability.

## Analytics And Crash Reporting

- [ ] Choose analytics tooling.
- [ ] Choose crash reporting tooling.
- [ ] Define event taxonomy for learner onboarding, catalog usage, and lesson engagement.

## Deep Links And Universal Links

- [x] Define custom scheme placeholder `golearrn`.
- [ ] Confirm universal/app link domains and association files.
- [ ] Map routes for auth, QR onboarding, courses, and player screens.
- [ ] Test cold-start and warm-start deep link behavior.

## Push Notifications

- [ ] Choose Expo Notifications or a native push strategy.
- [ ] Confirm backend device registration flow.
- [ ] Define notification categories and learner preference controls.

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
