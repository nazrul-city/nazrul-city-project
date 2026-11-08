import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { env } from '@/config/env';
import type { UserRole } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export type TActiveAdmin = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const sessionPayloadSchema = z.object({
  userId: z.string().min(1),
  exp: z.number().int(),
});

function sign(payload: string): string {
  return createHmac('sha256', env.AUTH_SECRET).update(payload).digest('base64url');
}

function signaturesMatch(actual: string, expected: string): boolean {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);

  if (actualBytes.length !== expectedBytes.length) {
    return false;
  }

  return timingSafeEqual(actualBytes, expectedBytes);
}

function readPayload(token: string): z.infer<typeof sessionPayloadSchema> | null {
  const separatorIndex = token.indexOf('.');

  if (separatorIndex <= 0) {
    return null;
  }

  const payload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);

  if (!payload || !signature || !signaturesMatch(signature, sign(payload))) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }

    throw error;
  }

  const result = sessionPayloadSchema.safeParse(parsed);

  if (!result.success || result.data.exp <= Date.now()) {
    return null;
  }

  return result.data;
}

export async function createAdminSession(userId: string): Promise<void> {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    })
  ).toString('base64url');
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function readAdminSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return readPayload(token)?.userId ?? null;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function readActiveAdmin(): Promise<TActiveAdmin | null> {
  const userId = await readAdminSessionUserId();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
