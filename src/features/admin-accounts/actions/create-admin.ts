'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@/generated/prisma/client';
import {
  readCreateFieldErrors,
  requireSuperAdmin,
  ADMIN_ACCESS_DENIED_MESSAGE,
} from '@/features/admin-accounts/actions/require-super-admin';
import {
  createAdminSchema,
  type TCreateAdminValues,
} from '@/features/admin-accounts/components/admin-account-schema';
import type { TCreateAdminResult } from '@/features/admin-accounts/types/admin-account';
import { logger } from '@/lib/logger';
import { hashPassword } from '@/lib/password';
import { prisma } from '@/lib/prisma';

function isUniqueEmailConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

export async function createAdmin(values: TCreateAdminValues): Promise<TCreateAdminResult> {
  const admin = await requireSuperAdmin();

  if (!admin.ok) {
    return { ok: false, message: ADMIN_ACCESS_DENIED_MESSAGE };
  }

  const parsed = createAdminSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readCreateFieldErrors(parsed.error) };
  }

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: await hashPassword(parsed.data.password),
        role: 'ADMIN',
        isActive: true,
      },
    });
  } catch (error) {
    if (isUniqueEmailConflict(error)) {
      return {
        ok: false,
        fieldErrors: { email: 'An account with this email already exists.' },
      };
    }

    throw error;
  }

  logger.info('admin account created');
  revalidatePath('/admin/admins');
  return { ok: true };
}
