# GOLEARRN Mobile Release Readiness

Use this checklist before preparing production builds for Android and iOS.

## Expo And EAS Readiness

- [ ] Confirm Expo SDK version and React Native version are production-approved.
- [ ] Add `eas.json` with development, preview, and production profiles.
- [ ] Confirm EAS project setup and ownership.
- [ ] Verify the app runs cleanly in Expo Go and on local device builds.

## Android Package Name

- [ ] Choose and lock the final Android application ID.
- [ ] Add the package name to Expo config.
- [ ] Reserve any required signing configuration and Play Console setup.

## iOS Bundle Identifier

- [ ] Choose and lock the final iOS bundle identifier.
- [ ] Add the bundle identifier to Expo config.
- [ ] Prepare the Apple Developer app record and signing configuration.

## Environment Variables

- [ ] Define development, staging, and production API base URLs.
- [ ] Decide how Expo public env vars will be used.
- [ ] Confirm no secrets are embedded in the client app.

## App Icon And Splash Screen

- [ ] Replace scaffold icons with GOLEARRN production branding.
- [ ] Replace placeholder splash assets and confirm safe padding on both platforms.
- [ ] Test icon and splash rendering on multiple device sizes.

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

- [ ] Define custom scheme and universal/app link domains.
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
