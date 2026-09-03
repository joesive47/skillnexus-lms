# LMS business rules

These rules are release gates, not UI conventions.

## Identity and access

- Progress can be written only by the authenticated learner who owns it.
- Lesson and quiz access requires an enrollment in the lesson's course.
- Administrator authorization is refreshed from the database, not trusted only from an old JWT.

## Progress and completion

- Video completion requires a configured positive duration and completion threshold (1–100%). Client-reported time is bounded by elapsed server time.
- Quiz lessons complete only from a server-scored, passed quiz attempt. SCORM lessons complete only from accepted SCORM completion evidence.
- Course completion requires at least one lesson, every lesson complete, every final-exam lesson complete, and every course quiz passed.
- `getCourseProgress` in `src/lib/learning-evidence.ts` is the canonical calculation for APIs and certificate eligibility.

## Certificates

- The digitally signed `Certificate` record is the canonical issued credential.
- Issuance requires canonical course completion and is unique per learner/course.
- A database learner lock makes repeated or concurrent issuance return the existing certificate.
- Revoked or expired certificates must never verify as active.

## Payments

- The server reads the price from the course; client amounts are ignored.
- Only a signed Stripe event can settle a payment.
- Settlement verifies provider payment ID, amount, currency, learner and course.
- Payment transition, enrollment and ledger effects are one transaction and idempotent.
