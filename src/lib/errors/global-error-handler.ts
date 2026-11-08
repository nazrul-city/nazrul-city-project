import 'server-only';

import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import { getRequestLogContext, logger } from '@/lib/logger';
import type { TApiErrorBody } from '@/types/api-error';
import { redactConnectionUrls } from '@/utils/redact-connection-url';
import { AppError } from './app-error';
import { mapPrismaError } from './map-prisma-error';
import { isZodError, mapZodError } from './map-zod-error';

const INTERNAL_SERVER_MESSAGE = 'Something went wrong';

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isZodError(error)) {
    return mapZodError(error);
  }

  const prismaError = mapPrismaError(error);
  if (prismaError) {
    return prismaError;
  }

  if (error instanceof Error) {
    const message =
      env.NODE_ENV === 'development'
        ? redactConnectionUrls(error.message)
        : INTERNAL_SERVER_MESSAGE;

    return new AppError(message, 500, { isOperational: false });
  }

  return new AppError(INTERNAL_SERVER_MESSAGE, 500, { isOperational: false });
}

function buildErrorBody(appError: AppError, originalError: unknown): TApiErrorBody {
  const body: TApiErrorBody = {
    success: false,
    statusCode: appError.statusCode,
    message: appError.message,
    errorSources: appError.errors ?? [],
  };

  if (env.NODE_ENV === 'development') {
    const stack =
      originalError instanceof Error && originalError.stack ? originalError.stack : appError.stack;

    if (stack) {
      body.stack = redactConnectionUrls(stack);
    }
  }

  return body;
}

function logAndReport(appError: AppError, originalError: unknown): void {
  const isServerFailure = appError.statusCode >= 500 || !appError.isOperational;

  if (isServerFailure) {
    const detail =
      originalError instanceof Error
        ? originalError.message
        : typeof appError.cause === 'string'
          ? appError.cause
          : appError.message;

    logger.error(`api error ${appError.statusCode}: ${detail}`);

    const requestContext = getRequestLogContext();
    Sentry.withScope((scope) => {
      if (requestContext?.requestId) {
        scope.setTag('requestId', requestContext.requestId);
      }

      Sentry.captureException(originalError instanceof Error ? originalError : appError);
    });
    return;
  }

  logger.warn(`api fail ${appError.statusCode}: ${appError.message}`);
}

/**
 * Turns any thrown value into a consistent JSON API error response.
 * Used by `catchAsync` — do not call from every route by hand.
 */
export function globalErrorHandler(error: unknown): NextResponse<TApiErrorBody> {
  const appError = toAppError(error);
  logAndReport(appError, error);

  return NextResponse.json(buildErrorBody(appError, error), {
    status: appError.statusCode,
  });
}
