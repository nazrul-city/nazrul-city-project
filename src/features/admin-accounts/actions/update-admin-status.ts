'use server';

import { revalidatePath } from 'next/cache';
import {
  ADMIN_ACCESS_DENIED_MESSAGE,
  requireSuperAdmin,
} from '@/features/admin-accounts/actions/require-super-admin';
import { updateAdminStatusSchema } from '@/features/admin-accounts/components/admin-account-schema';
import type { TAdminActionResult } from '@/features/admin-accounts/types/admin-account';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function updateAdminStatus(input: {
  userId: string;
  isActive: boolean;
}): Promise<TAdminActionResult> {
  const admin = await requireSuperAdmin();

  if (!admin.ok) {
    return { ok: false, message: ADMIN_ACCESS_DENIED_MESSAGE };
  }

  const parsed = updateAdminStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: 'That account could not be updated.' };
  }

  if (parsed.data.userId === admin.userId) {
    return { ok: false, message: 'You cannot change your own status.' };
  }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { role: true },
  });

  if (!target) {
    return { ok: false, message: 'That account was not found.' };
  }

  if (target.role !== 'ADMIN') {
    return { ok: false, message: 'Only an admin account can be changed.' };
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { isActive: parsed.data.isActive },
  });

  logger.info('admin account status updated');
  revalidatePath('/admin/admins');
  return { ok: true };
}
