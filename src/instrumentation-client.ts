import * as Sentry from '@sentry/nextjs';
import { env } from '@/config/env';
import { redactSentryEvent } from '@/utils/redact-connection-url';

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN || undefined,

  // Environment tag — keeps staging crashes out of production crash-free rates
  // release is intentionally omitted: withSentryConfig injects it from git HEAD
  environment: env.NODE_ENV,

  // Tracing: 100% in development for local verification, 10% in production
  tracesSampleRate: env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Session Replay: 10% of regular sessions in prod, 100% of sessions with unhandled errors
  replaysSessionSampleRate: env.NODE_ENV === 'development' ? 0 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Enable Sentry Logs integration + auto-capture warn/error console calls
  enableLogs: true,

  integrations: [
    Sentry.replayIntegration({
      // Privacy-first defaults: mask sensitive text and media
      maskAllText: true,
      blockAllMedia: true,
    }),
    // Forward browser console.warn and console.error calls to Sentry Logs
    Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
  ],

  // Drop browser-extension errors to avoid quota noise
  beforeSend(event) {
    const frames = event.exception?.values?.[0]?.stacktrace?.frames;
    if (
      frames?.some(
        (f) =>
          f.filename?.startsWith('chrome-extension://') ||
          f.filename?.startsWith('moz-extension://')
      )
    ) {
      return null;
    }
    return redactSentryEvent(event);
  },
});

// Hook into Next.js App Router navigation transitions to record client routing spans
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
