'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateAdminStatus } from '@/features/admin-accounts/actions/update-admin-status';
import { DeleteAdminDialog } from '@/features/admin-accounts/components/delete-admin-dialog';
import {
  ADMIN_ACCOUNT_ROLE_LABELS,
  type TAdminAccount,
} from '@/features/admin-accounts/types/admin-account';

type TAdminAccountRowProps = {
  account: TAdminAccount;
  isCurrentUser: boolean;
};

export function AdminAccountRow({ account, isCurrentUser }: Readonly<TAdminAccountRowProps>) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const canManage = account.role === 'ADMIN' && !isCurrentUser;
  const statusLabel = account.isActive ? 'Active' : 'Inactive';

  async function handleToggleStatus() {
    setIsUpdating(true);
    setErrorMessage(null);

    const result = await updateAdminStatus({
      userId: account.id,
      isActive: !account.isActive,
    });

    setIsUpdating(false);

    if (!result.ok) {
      setErrorMessage(result.message);
    }
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="truncate text-base font-medium">{account.name}</p>
        <p className="truncate text-base text-muted-foreground">{account.email}</p>
        <p className="text-base text-muted-foreground">
          {ADMIN_ACCOUNT_ROLE_LABELS[account.role]} · {statusLabel}
          {isCurrentUser ? ' · Your account' : ''}
        </p>
        {errorMessage ? (
          <p role="alert" className="text-base text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </div>
      {canManage ? (
        <div className="flex flex-col gap-2 md:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={isUpdating}
            onClick={handleToggleStatus}
          >
            {isUpdating ? 'Saving…' : account.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <DeleteAdminDialog account={account} />
        </div>
      ) : null}
    </li>
  );
}
