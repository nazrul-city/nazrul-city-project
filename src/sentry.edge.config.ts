import * as Sentry from '@sentry/nextjs';
import { env } from '@/config/env';
import { redactSentryEvent } from '@/utils/redact-connection-url';

Sentry.init({
  dsn: env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment tag — keeps staging crashes out of production crash-free rates
  // release is intentionally omitted: withSentryConfig injects it from git HEAD
  environment: env.NODE_ENV,

  // Tracing: 100% in development for local verification, 10% in production
  tracesSampleRate: env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Enable Sentry Logs integration
  enableLogs: true,

  // Enable debug mode only when explicitly troubleshooting
  debug: false,

  beforeSend(event) {
    return redactSentryEvent(event);
  },
});
