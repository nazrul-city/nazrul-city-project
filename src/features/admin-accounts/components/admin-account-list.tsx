import { AdminAccountRow } from '@/features/admin-accounts/components/admin-account-row';
import type { TAdminAccount } from '@/features/admin-accounts/types/admin-account';

type TAdminAccountListProps = {
  accounts: readonly TAdminAccount[];
  currentUserId: string;
};

export function AdminAccountList({ accounts, currentUserId }: Readonly<TAdminAccountListProps>) {
  return (
    <section className="flex flex-col gap-3">
      <h2>Accounts</h2>
      <ul className="flex flex-col gap-3">
        {accounts.map((account) => (
          <AdminAccountRow
            key={account.id}
            account={account}
            isCurrentUser={account.id === currentUserId}
          />
        ))}
      </ul>
    </section>
  );
}
