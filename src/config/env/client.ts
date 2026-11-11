import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Client-safe environment variables (NEXT_PUBLIC_* only).
 * Safe to import from both server and client components.
 */
export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().min(1).optional(),
  },

  // Must explicitly destructure NEXT_PUBLIC_* vars for Next.js static replacement
  runtimeEnv: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  },

  emptyStringAsUndefined: true,
});
