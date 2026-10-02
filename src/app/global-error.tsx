'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import '@/app/globals.css';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    // Forward unhandled root-level error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center bg-background px-4 text-foreground">
        <main className="flex max-w-md flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
            <svg
              className="size-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1>Critical application error</h1>
          <p className="mt-2 text-muted-foreground">
            An unexpected error occurred. Our engineering team has been automatically notified via
            Sentry.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-muted-foreground">Error Digest: {error.digest}</p>
          )}
          <button type="button" onClick={() => reset()} className={cn(buttonVariants(), 'mt-6')}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
