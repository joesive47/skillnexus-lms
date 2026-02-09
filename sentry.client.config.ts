import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  // Integrations are automatically included in Sentry Next.js SDK v8+
  // No need to manually add browserTracingIntegration or replayIntegration
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
