'use server';

import { Prisma } from '@/generated/prisma/client';
import { redirect } from 'next/navigation';
import type { ZodError } from 'zod';
import { env } from '@/config/env';
import {
  INVALID_LOGIN_MESSAGE,
  loginFormSchema,
  type TLoginFormValues,
} from '@/features/admin-login/components/login-form-schema';
import { createAdminSession } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { hashPassword, verifyPassword } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp, resetRateLimit } from '@/lib/rate-limit';

const SUPER_ADMIN_NAME = 'Super Admin';
const MAX_LOGIN_ATTEMPTS = 7;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type TLoginFieldErrors = {
  email?: string;
  password?: string;
};

export type TLoginResult =
  { ok: false; message: string } | { ok: false; fieldErrors: TLoginFieldErrors };

function readFieldErrors(error: ZodError): TLoginFieldErrors {
  const fieldErrors: TLoginFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if ((field === 'email' || field === 'password') && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

function isUniqueEmailConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

async function ensureFirstSuperAdmin(): Promise<void> {
  const adminCount = await prisma.user.count();

  if (adminCount > 0) {
    return;
  }

  try {
    await prisma.user.create({
      data: {
        name: SUPER_ADMIN_NAME,
        email: env.ADMIN_EMAIL.toLowerCase(),
        password: await hashPassword(env.ADMIN_PASSWORD),
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
  } catch (error) {
    if (isUniqueEmailConflict(error)) {
      return;
    }

    throw error;
  }

  logger.info('created first super admin');
}

export async function login(values: TLoginFormValues): Promise<TLoginResult> {
  const parsed = loginFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readFieldErrors(parsed.error) };
  }

  const clientIp = await getClientIp();
  const rateLimitKey = `admin-login:${clientIp}`;

  const rateCheck = checkRateLimit({
    key: rateLimitKey,
    limit: MAX_LOGIN_ATTEMPTS,
    windowMs: LOGIN_WINDOW_MS,
  });

  if (!rateCheck.allowed) {
    const minutes = Math.max(1, Math.ceil(rateCheck.retryAfterMs / 60000));
    logger.warn(`admin login rate limited for IP: ${clientIp}`);
    return {
      ok: false,
      message: `Too many login attempts. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`,
    };
  }

  await ensureFirstSuperAdmin();

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user || !user.isActive) {
    await hashPassword(parsed.data.password);
    logger.warn('admin login failed');
    return { ok: false, message: INVALID_LOGIN_MESSAGE };
  }

  const passwordMatches = await verifyPassword(parsed.data.password, user.password);

  if (!passwordMatches) {
    logger.warn('admin login failed');
    return { ok: false, message: INVALID_LOGIN_MESSAGE };
  }

  resetRateLimit(rateLimitKey);
  await createAdminSession(user.id);
  logger.info('admin login ok');
  redirect('/admin');
}
