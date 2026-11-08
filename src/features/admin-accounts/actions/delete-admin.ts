'use server';

import { revalidatePath } from 'next/cache';
import {
  ADMIN_ACCESS_DENIED_MESSAGE,
  requireSuperAdmin,
} from '@/features/admin-accounts/actions/require-super-admin';
import { deleteAdminSchema } from '@/features/admin-accounts/components/admin-account-schema';
import type { TAdminActionResult } from '@/features/admin-accounts/types/admin-account';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function deleteAdmin(userId: string): Promise<TAdminActionResult> {
  const admin = await requireSuperAdmin();

  if (!admin.ok) {
    return { ok: false, message: ADMIN_ACCESS_DENIED_MESSAGE };
  }

  const parsed = deleteAdminSchema.safeParse({ userId });

  if (!parsed.success) {
    return { ok: false, message: 'That account could not be deleted.' };
  }

  if (parsed.data.userId === admin.userId) {
    return { ok: false, message: 'You cannot delete your own account.' };
  }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { role: true },
  });

  if (!target) {
    return { ok: false, message: 'That account was not found.' };
  }

  if (target.role !== 'ADMIN') {
    return { ok: false, message: 'Only an admin account can be deleted.' };
  }

  await prisma.user.delete({
    where: { id: parsed.data.userId },
  });

  logger.info('admin account deleted');
  revalidatePath('/admin/admins');
  return { ok: true };
}
