import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Server environment variables.
 * `NODE_ENV` is shared so the browser can read it too. Next.js inlines that
 * one access. The other keys stay server-only.
 */
export const serverEnv = createEnv({
  server: {
    NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),
    CI: z.string().optional(),
    SENTRY_ORG: z.string().min(1),
    SENTRY_PROJECT: z.string().min(1),
    SENTRY_AUTH_TOKEN: z.string().min(1),
    SENTRY_DSN: z.string().url().optional(),
  },

  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },

  // Next.js >= 13.4.4: pass full process.env for server-side vars.
  // The direct NODE_ENV read is what the browser bundle actually receives.
  experimental__runtimeEnv: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV,
  },

  emptyStringAsUndefined: true,
});
