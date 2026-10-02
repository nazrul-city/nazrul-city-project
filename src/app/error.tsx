'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RouteError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    // Log route-level error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
        <svg
          className="size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2>Something went wrong</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        We encountered an error loading this section. The issue has been recorded.
      </p>
      {error.digest && <p className="mt-2 text-xs text-muted-foreground">Digest: {error.digest}</p>}
      <button type="button" onClick={() => reset()} className={cn(buttonVariants(), 'mt-5')}>
        Try again
      </button>
    </section>
  );
}
