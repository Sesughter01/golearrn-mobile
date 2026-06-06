# GOLEARRN Mobile Backend Contracts

This document captures the Laravel backend contracts that should be clarified before the GOLEARRN mobile app moves from MVP placeholders to production API integration.

## Authentication

- Confirm the learner-facing mobile login endpoint and whether the same contract used by web is safe for native mobile.
- Confirm whether mobile auth uses Laravel Sanctum, Passport, JWT, session cookies, or a custom token model.
- Confirm error payload format for invalid credentials, suspended learners, locked accounts, and rate limiting.

## Token Storage

- Confirm token lifetime, refresh strategy, logout behavior, and multi-device session rules.
- Confirm whether tokens are revocable per device.
- Confirm whether secure storage should hold a bearer token, refresh token, or opaque session artifact.

## Google Sign-In

- Confirm whether mobile uses native Google OAuth and exchanges an ID token with Laravel.
- Confirm domain restrictions and failure behavior for non-approved accounts.
- Confirm whether Google sign-in is learner-only for MVP.

## OTP

- Confirm whether registration or login requires email OTP for mobile.
- Confirm OTP resend rules, cooldown windows, expiration, and verification response shape.
- Confirm whether OTP is mandatory for all learner registrations or conditional.

## QR Onboarding

- Confirm what `/register/scan` encodes today and whether it can hand off into native deep links.
- Confirm whether QR onboarding creates invitations, campaign attribution, cohort assignment, or referral linkage.
- Confirm fallback behavior when the app is not installed.

## Course APIs

- Confirm course catalog endpoint, pagination, category filters, search filters, and localization fields.
- Confirm enrolled courses endpoint and expected learner progress summary payload.
- Confirm whether mobile can access public course previews without authentication.

## Lesson And Player APIs

- Confirm course detail, chapter, and lesson endpoints.
- Confirm media delivery format for video, reading content, downloadable assets, and access control.
- Confirm progress tracking, lesson completion, resume position, and offline support expectations.

## Quiz APIs

- Confirm quiz launch endpoint, submission contract, attempt limits, timer rules, and grading response.
- Confirm whether quiz state can be resumed on mobile.
- Confirm whether quizzes are embedded in the lesson player response or fetched separately.

## Translation States

- Confirm canonical translation state values: original, pending, partial, translated, or other variants.
- Confirm whether course, chapter, and lesson items can each have separate translation states.
- Confirm whether mobile should poll for translation completion or rely on manual refresh.

## RAG Search

- Confirm whether mobile MVP should expose standard search only or backend-backed semantic search.
- Confirm latency expectations, request payload, result shape, and fallback behavior when AI search is unavailable.
- Confirm whether learner prompts are logged or retained.

## Purchases And Web Checkout Handoff

- Confirm whether purchases happen only on web for MVP.
- Confirm how mobile should hand users off to web checkout without violating app store policies.
- Confirm how completed purchases sync back into the learner library.

## Push Notifications

- Confirm device registration endpoint, expected push token format, and notification topic model.
- Confirm notification types for reminders, new lessons, quiz due dates, and translation completion.
- Confirm notification opt-in storage and unsubscribe behavior.

## Account Deletion

- Confirm learner account deletion endpoint and required verification steps.
- Confirm whether deletion is immediate, queued, or review-based.
- Confirm post-deletion sign-out, data export, and support escalation behavior.

## Policy URLs

- Confirm the production privacy policy URL.
- Confirm the production terms of service URL.
- Confirm whether additional learner consent or regional policy links are required.
