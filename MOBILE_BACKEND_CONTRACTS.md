# GOLEARRN Mobile Backend Contracts

This document captures the Laravel backend contracts that are already live for GOLEARRN mobile and the ones that still need clarification before production hardening.

## Live Today

- `GET /app/config`
- `GET /dashboard`
- `GET /courses`
- `GET /courses/enrolled`
- `GET /courses/{slug}`
- `GET /search/courses`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/forgot-password`

## Authentication

- Live: student email/password login and registration endpoints exist and return Sanctum bearer tokens.
- Live: `/auth/me` works with `Authorization: Bearer TOKEN`.
- Live: `/auth/logout` revokes the token and invalid tokens return `401`.
- Live: forgot password is available through `/auth/forgot-password`.
- Confirm error payload format for invalid credentials, suspended students, locked accounts, validation failures, and rate limiting.
- Confirm whether a dedicated student demo or staging auth mode should exist for product review and QA.

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
- Confirm whether Google sign-in is student-only for MVP.

## OTP

- Pending: mobile OTP auth is not implemented yet and the UI remains hidden even if backend flags mention OTP.
- Confirm OTP resend rules, cooldown windows, expiration, and verification response shape.
- Confirm whether OTP is mandatory for all student registrations or conditional.

## QR Onboarding

- Live: `/qr/resolve` exists, but native QR onboarding is not implemented yet.
- Confirm what `/register/scan` encodes today and whether it can hand off into native deep links.
- Confirm whether QR onboarding creates invitations, campaign attribution, cohort assignment, or referral linkage.
- Confirm fallback behavior when the app is not installed.

## Course APIs

- Live: public course catalog and course detail endpoints are available to the mobile app.
- Live: course search endpoint exists.
- Mobile search UX now uses the semantic search contract:
  - Endpoint: `GET /search/courses`
  - Required parameter: `q`
  - Optional parameter: `limit`
  - Example: `/search/courses?q=product%20design&limit=12`
- Live: search responses currently return:
  - `data.query`
  - `data.results`
  - `data.search_meta.status`
  - `data.search_meta.fallback_mode`
  - `data.search_meta.match_references`
- Mobile ignores rich RAG metadata for rendering except for fallback-mode messaging and result ordering.
- Confirm pagination, category filters, search parameter names, and localization fields.
- Live: student dashboard summary endpoint exists.
- Live: enrolled courses endpoint exists.
- Confirm whether mobile can access public course previews without authentication in every environment.
- Confirm whether list responses should consistently include course level, student progress, language, and translation status in one payload.
- Confirm how unenrolled courses should expose a compliant web enrollment or checkout handoff target.

## Next Recommended Backend Milestone

- Highest-value next contract after dashboard and enrolled courses: player/bootstrap plus student progress write-back.
- Reason:
  - auth, catalog, detail, forgot-password, and search are already live
  - the mobile app now consumes real student dashboard and enrolled-library data
  - the biggest remaining authenticated student gap is lesson playback bootstrap and progress synchronization
  - this unlocks a real authenticated student experience without expanding into payments, OTP, Google login, or quiz scope

### Live Endpoint Snapshot: `GET /dashboard`

- Auth: required
- Purpose: return the student's home/dashboard payload in one response

Suggested response:

```json
{
  "success": true,
  "message": "Student dashboard loaded successfully.",
  "data": {
    "user": {
      "id": 123,
      "name": "Charles-Clement Avul",
      "email": "student@example.com"
    },
    "continue_learning": [
      {
        "id": 12,
        "slug": "product-design-for-newbies",
        "title": "Product Design for Newbies",
        "short_description": "Transform ideas into impactful digital experiences.",
        "thumbnail_url": "https://golearrn.com/storage/courses/design.png",
        "instructor": {
          "name": "GOLEARRN Instructor"
        },
        "language": {
          "name": "English"
        },
        "translation": {
          "state": "translated"
        },
        "progress_percent": 42,
        "last_lesson": {
          "id": 301,
          "title": "Introduction to Product Thinking"
        },
        "last_accessed_at": "2026-06-11T08:40:00Z"
      }
    ],
    "recommended_courses": [
      {
        "id": 44,
        "slug": "excel-for-beginners",
        "title": "Excel for Beginners",
        "short_description": "Build confidence with spreadsheets and formulas.",
        "thumbnail_url": "https://golearrn.com/storage/courses/excel.png",
        "instructor": {
          "name": "GOLEARRN Instructor"
        },
        "language": {
          "name": "English"
        },
        "translation": {
          "state": "original"
        }
      }
    ],
    "stats": {
      "enrolled_courses": 4,
      "in_progress_courses": 2,
      "completed_courses": 1
    }
  }
}
```

Notes:
- `continue_learning` should drive the top dashboard section directly.
- `recommended_courses` can remain optional if recommendation logic is not ready.
- `stats` may be omitted initially if the backend wants a smaller first milestone.

### Live Endpoint Snapshot: `GET /courses/enrolled`

- Auth: required
- Purpose: return the student's enrolled library in a dedicated list endpoint

Suggested response:

```json
{
  "success": true,
  "message": "Enrolled courses loaded successfully.",
  "data": [
    {
      "id": 12,
      "slug": "product-design-for-newbies",
      "title": "Product Design for Newbies",
      "short_description": "Transform ideas into impactful digital experiences.",
      "thumbnail_url": "https://golearrn.com/storage/courses/design.png",
      "instructor": {
        "name": "GOLEARRN Instructor"
      },
      "language": {
        "name": "English"
      },
      "translation": {
        "state": "translated"
      },
      "progress_percent": 42,
      "lesson_count": 18,
      "chapter_count": 6,
      "last_lesson": {
        "id": 301,
        "title": "Introduction to Product Thinking"
      },
      "last_accessed_at": "2026-06-11T08:40:00Z",
      "enrollment_status": "enrolled"
    }
  ]
}
```

Notes:
- This endpoint now replaces the old mobile fallback in `fetchEnrolledCourses()`.
- `progress_percent` is the minimum field needed to make the student dashboard feel real.
- `last_lesson` is strongly recommended so “Continue Learning” can route intelligently later.

## Lesson And Player APIs

- Live: `GET /courses/{slug}/player` is now available for authenticated student playback bootstrap.
- Live: `POST /courses/{slug}/lessons/{lesson}/progress` is now available for authenticated progress write-back.
- Live: basic course detail remains available for course overview use cases.
- Confirm media delivery format for video, reading content, downloadable assets, and access control.
- Confirm progress tracking, lesson completion, resume position, and offline support expectations.
- Confirm the stable response shape for:
  - `course`
  - `access`
  - `progress`
  - `current_lesson`
  - `navigation`
  - `chapters`
  - `playback`
- Confirm the accepted progress event values and whether `progress` and `completed` are the canonical event names.
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
- Confirm whether student prompts are logged or retained.

## Purchases And Web Checkout Handoff

- Confirm whether purchases happen only on web for MVP.
- Confirm how mobile should hand users off to web checkout without violating app store policies.
- Confirm how completed purchases sync back into the student library.

## Push Notifications

- Pending: push notification device registration API is not implemented yet.
- Confirm device registration endpoint, expected push token format, and notification topic model.
- Confirm notification types for reminders, new lessons, quiz due dates, and translation completion.
- Confirm notification opt-in storage and unsubscribe behavior.

## Account Deletion

- Pending: account deletion endpoint is not implemented yet.
- Confirm student account deletion endpoint and required verification steps.
- Confirm whether deletion is immediate, queued, or review-based.
- Confirm post-deletion sign-out, data export, and support escalation behavior.

## Policy URLs

- Confirm the production privacy policy URL.
- Confirm the production terms of service URL.
- Confirm whether additional student consent or regional policy links are required.
