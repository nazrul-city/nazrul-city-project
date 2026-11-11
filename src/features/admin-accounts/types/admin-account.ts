import type { TAdminRole } from '@/features/admin-shell';

export type TAdminAccount = {
  id: string;
  name: string;
  email: string;
  role: TAdminRole;
  isActive: boolean;
};

export type TCreateAdminFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export type TCreateAdminResult =
  | { ok: true }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: TCreateAdminFieldErrors };

export type TAdminActionResult = { ok: true } | { ok: false; message: string };

export const ADMIN_ACCOUNT_ROLE_LABELS = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super admin',
} as const satisfies Record<TAdminRole, string>;
