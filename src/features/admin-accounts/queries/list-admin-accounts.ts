import 'server-only';

import type { TAdminAccount } from '@/features/admin-accounts/types/admin-account';
import { prisma } from '@/lib/prisma';

export async function listAdminAccounts(): Promise<TAdminAccount[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  return users;
}
