# GOLEARRN Mobile Backend Contracts

This document captures the Laravel backend contracts that are already live for GOLEARRN mobile and the ones that still need clarification before production hardening.

## Live Today

- `GET /app/config`
- `GET /courses`
- `GET /courses/{slug}`
- `GET /search/courses`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/forgot-password`

## Authentication

- Live: learner email/password login and registration endpoints exist and return Sanctum bearer tokens.
- Live: `/auth/me` works with `Authorization: Bearer TOKEN`.
- Live: `/auth/logout` revokes the token and invalid tokens return `401`.
- Live: forgot password is available through `/auth/forgot-password`.
- Confirm error payload format for invalid credentials, suspended learners, locked accounts, validation failures, and rate limiting.
- Confirm whether a dedicated learner demo or staging auth mode should exist for product review and QA.

## Token Storage

- Live: SecureStore is now the app’s official token storage mechanism.
- Confirm token lifetime, refresh strategy, logout behavior, and multi-device session rules.
- Confirm whether tokens are revocable per device.
- Confirm whether secure storage should hold a bearer token, refresh token, or opaque session artifact.

## Google Sign-In

- Pending: native Google mobile sign-in is not implemented yet.
- Existing web accounts created through Google may need password reset before they can sign in on mobile with email/password.
- Confirm whether mobile uses native Google OAuth and exchanges an ID token with Laravel.
- Confirm domain restrictions and failure behavior for non-approved accounts.
- Confirm whether Google sign-in is learner-only for MVP.

## OTP

- Pending: mobile OTP auth is not implemented yet and the UI remains hidden even if backend flags mention OTP.
- Confirm OTP resend rules, cooldown windows, expiration, and verification response shape.
- Confirm whether OTP is mandatory for all learner registrations or conditional.

## QR Onboarding

- Live: `/qr/resolve` exists, but native QR onboarding is not implemented yet.
- Confirm what `/register/scan` encodes today and whether it can hand off into native deep links.
- Confirm whether QR onboarding creates invitations, campaign attribution, cohort assignment, or referral linkage.
- Confirm fallback behavior when the app is not installed.

## Course APIs

- Live: public course catalog and course detail endpoints are available to the mobile app.
- Live: course search endpoint exists.
- Confirm pagination, category filters, search parameter names, and localization fields.
- Pending: enrolled courses endpoint and learner dashboard summary payload.
- Confirm whether mobile can access public course previews without authentication in every environment.
- Confirm whether list responses should consistently include course level, learner progress, language, and translation status in one payload.
- Confirm how unenrolled courses should expose a compliant web enrollment or checkout handoff target.

## Lesson And Player APIs

- Live: basic course detail is available, but player/bootstrap contracts are still incomplete for mobile playback.
- Confirm media delivery format for video, reading content, downloadable assets, and access control.
- Confirm progress tracking, lesson completion, resume position, and offline support expectations.
- Confirm whether the player bootstrap response should include current lesson, next lesson, and chapter summaries together.

## Quiz APIs

- Confirm quiz launch endpoint, submission contract, attempt limits, timer rules, and grading response.
- Confirm whether quiz state can be resumed on mobile.
- Confirm whether quizzes are embedded in the lesson player response or fetched separately.

## Translation States

- Pending: translation status API is not finalized for mobile.
- Confirm canonical translation state values: original, pending, partial, translated, or other variants.
- Confirm whether course, chapter, and lesson items can each have separate translation states.
- Confirm whether mobile should poll for translation completion or rely on manual refresh.
- Confirm whether `failed` is a supported translation state that mobile should render explicitly.

## RAG Search

- Confirm whether mobile MVP should expose standard search only or backend-backed semantic search.
- Confirm latency expectations, request payload, result shape, and fallback behavior when AI search is unavailable.
- Confirm whether learner prompts are logged or retained.

## Purchases And Web Checkout Handoff

- Confirm whether purchases happen only on web for MVP.
- Confirm how mobile should hand users off to web checkout without violating app store policies.
- Confirm how completed purchases sync back into the learner library.

## Push Notifications

- Pending: push notification device registration API is not implemented yet.
- Confirm device registration endpoint, expected push token format, and notification topic model.
- Confirm notification types for reminders, new lessons, quiz due dates, and translation completion.
- Confirm notification opt-in storage and unsubscribe behavior.

## Account Deletion

- Pending: account deletion endpoint is not implemented yet.
- Confirm learner account deletion endpoint and required verification steps.
- Confirm whether deletion is immediate, queued, or review-based.
- Confirm post-deletion sign-out, data export, and support escalation behavior.

## Policy URLs

- Confirm the production privacy policy URL.
- Confirm the production terms of service URL.
- Confirm whether additional learner consent or regional policy links are required.
