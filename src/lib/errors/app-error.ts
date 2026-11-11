import type { TErrorSource } from '@/types/api-error';

type TAppErrorOptions = {
  errors?: TErrorSource[];
  isOperational?: boolean;
};

/**
 * Operational (expected) API error. Throw from Route Handlers;
 * `catchAsync` + `globalErrorHandler` turn it into a JSON response.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly errors: TErrorSource[] | undefined;

  constructor(message: string, statusCode: number, options: TAppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = options.isOperational ?? true;
    this.errors = options.errors;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

/** Invalid id / type that cannot be cast to the expected shape (HTTP 400). */
export class CastError extends AppError {
  constructor(message = 'Invalid value') {
    super(message, 400);
    this.name = 'CastError';
  }
}

/** Unique constraint conflict (HTTP 409). Also produced from Prisma P2002. */
export class DuplicateError extends AppError {
  constructor(message = 'Duplicate value') {
    super(message, 409);
    this.name = 'DuplicateError';
  }
}

/** Resource missing (HTTP 404). Also produced from Prisma P2025 / related codes. */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/** Domain validation failure that is not a Zod schema error (HTTP 400). */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors?: TErrorSource[]) {
    super(message, 400, { errors });
    this.name = 'ValidationError';
  }
}
