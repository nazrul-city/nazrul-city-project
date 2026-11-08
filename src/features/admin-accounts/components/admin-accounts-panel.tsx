import { CreateAdminForm } from '@/features/admin-accounts/components/create-admin-form';
import { AdminAccountList } from '@/features/admin-accounts/components/admin-account-list';
import { listAdminAccounts } from '@/features/admin-accounts/queries/list-admin-accounts';

type TAdminAccountsPanelProps = {
  currentUserId: string;
};

export async function AdminAccountsPanel({ currentUserId }: Readonly<TAdminAccountsPanelProps>) {
  const accounts = await listAdminAccounts();

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <h1>Admins</h1>
      <CreateAdminForm />
      <AdminAccountList accounts={accounts} currentUserId={currentUserId} />
    </section>
  );
}
