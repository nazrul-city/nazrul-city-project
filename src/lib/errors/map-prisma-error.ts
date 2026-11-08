import { Prisma } from '@/generated/prisma/client';
import { AppError, DuplicateError, NotFoundError } from './app-error';

const INTERNAL_SERVER_MESSAGE = 'Something went wrong';

function formatMetaTarget(target: unknown): string {
  if (typeof target === 'string' && target.length > 0) {
    return target;
  }

  if (Array.isArray(target) && target.length > 0) {
    return target.map(String).join(', ');
  }

  return 'field';
}

function formatNullableConstraintField(meta: Record<string, unknown> | undefined): string {
  const constraint = meta?.constraint;
  if (typeof constraint === 'string' && constraint.length > 0) {
    return constraint;
  }

  const target = meta?.target;
  if (typeof target === 'string' && target.length > 0) {
    return target;
  }

  return 'field';
}

function createInternalPrismaError(logDetail: string): AppError {
  // Non-operational: client gets a generic 500; real detail stays in logs.
  const error = new AppError(INTERNAL_SERVER_MESSAGE, 500, { isOperational: false });
  error.cause = logDetail;
  return error;
}

function mapKnownRequestError(error: Prisma.PrismaClientKnownRequestError): AppError {
  const meta = error.meta as Record<string, unknown> | undefined;

  switch (error.code) {
    case 'P2002': {
      const target = formatMetaTarget(meta?.target);
      return new DuplicateError(`Duplicate value for: ${target}`);
    }
    case 'P2025':
    case 'P2001':
      return new NotFoundError('Record not found');
    case 'P2015':
      return new NotFoundError('Related record not found');
    case 'P2018':
      return new NotFoundError('Required connected records not found');
    case 'P2003':
      return new AppError('Related record not found', 400);
    case 'P2014':
      return new AppError('Invalid relation for this operation', 400);
    case 'P2011': {
      const field = formatNullableConstraintField(meta);
      return new AppError(`Required field cannot be null: ${field}`, 400);
    }
    case 'P2012':
      return new AppError('Missing required value', 400);
    case 'P2021':
    case 'P2022':
      return createInternalPrismaError(`prisma ${error.code}: ${error.message}`);
    default:
      return createInternalPrismaError(`prisma ${error.code}: ${error.message}`);
  }
}

/**
 * Maps any Prisma client error class to an AppError.
 * Returns `null` when the value is not a Prisma error.
 */
export function mapPrismaError(error: unknown): AppError | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return mapKnownRequestError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError('Invalid database query input', 400);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return createInternalPrismaError(`prisma init: ${error.message}`);
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return createInternalPrismaError(`prisma unknown: ${error.message}`);
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return createInternalPrismaError(`prisma panic: ${error.message}`);
  }

  return null;
}
