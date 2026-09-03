# Pilot readiness and go/no-go

## Automated release gates

- Prisma validate/generate and additive schema sync against an ephemeral PostgreSQL database.
- ESLint (zero errors), TypeScript, production build, Jest and Playwright E2E.
- Dependency audit blocks unapproved high/critical findings.
- E2E verifies one-attempt Admin and Student login, Admin category access and Student RBAC denial.

## Pilot UAT

1. Admin creates, edits, orders and archives a main/subcategory, then assigns it to a course.
2. Student enrolls, resumes video, passes required quizzes/final exam and reaches exactly 100%.
3. Repeated completion requests yield one digitally signed certificate.
4. Stripe test payment is retried and webhook is replayed; balance/enrollment/ledger appear once.
5. Analytics totals and category conversion are reconciled to database samples.
6. Backup checksum/archive verification passes and a restore drill succeeds in an isolated `*_restore` database.

## Go/no-go

Go only when CI is green, production secrets/webhook URL are configured, HTTPS is enforced, a restore drill has evidence, monitoring alerts have an owner, and all UAT checks are signed off. No-go on any payment mismatch, duplicate certificate, RBAC escape, failed restore, missing rollback owner, or unresolved critical vulnerability.

Known temporary gate: Next.js 15.5.25 carries the documented PostCSS advisory exception in `scripts/security-audit.cjs`, expiring 2026-10-01. Upgrade planning is required before expiry.
