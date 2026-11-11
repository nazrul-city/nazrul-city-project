import { ZodError } from 'zod';
import type { TErrorSource } from '@/types/api-error';
import { AppError } from './app-error';

function formatIssuePath(path: ReadonlyArray<PropertyKey>): string {
  if (path.length === 0) {
    return '';
  }

  return path.map(String).join('.');
}

/**
 * Maps a Zod validation failure to an operational 400 AppError
 * with field-level `errors` for the client envelope.
 */
export function mapZodError(error: ZodError): AppError {
  const errors: TErrorSource[] = error.issues.map((issue) => ({
    path: formatIssuePath(issue.path),
    message: issue.message,
  }));

  return new AppError('Validation failed', 400, { errors });
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}
