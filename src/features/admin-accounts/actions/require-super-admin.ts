import 'server-only';

import type { ZodError } from 'zod';
import { readActiveAdmin } from '@/lib/auth';
import type { TCreateAdminFieldErrors } from '@/features/admin-accounts/types/admin-account';

export const ADMIN_ACCESS_DENIED_MESSAGE = 'You do not have access to admin accounts.';

export async function requireSuperAdmin(): Promise<{ ok: true; userId: string } | { ok: false }> {
  const admin = await readActiveAdmin();

  if (!admin || admin.role !== 'SUPER_ADMIN') {
    return { ok: false };
  }

  return { ok: true, userId: admin.id };
}

export function readCreateFieldErrors(error: ZodError): TCreateAdminFieldErrors {
  const fieldErrors: TCreateAdminFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if ((field === 'name' || field === 'email' || field === 'password') && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
