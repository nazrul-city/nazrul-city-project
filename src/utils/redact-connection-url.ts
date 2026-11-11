export function redactConnectionUrls(value: string): string {
  return value.replace(
    /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s'"]+/gi,
    '[Redacted]'
  );
}

type TSentryEventWithMessages = {
  message?: string;
  exception?: {
    values?: Array<{ value?: string }>;
  };
};

/**
 * Scrub connection URLs on a Sentry event before it leaves the process.
 * Mutates the event, which is what Sentry's `beforeSend` expects.
 */
export function redactSentryEvent<TEvent extends TSentryEventWithMessages>(event: TEvent): TEvent {
  if (event.message) {
    event.message = redactConnectionUrls(event.message);
  }

  const exceptions = event.exception?.values;
  if (!exceptions) {
    return event;
  }

  for (const exception of exceptions) {
    if (exception.value) {
      exception.value = redactConnectionUrls(exception.value);
    }
  }

  return event;
}
