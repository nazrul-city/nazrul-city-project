import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminAccountsPanel } from '@/features/admin-accounts/components/admin-accounts-panel';
import { readActiveAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admins',
  description: 'Admin accounts for Nazrul City.',
  robots: { index: false, follow: false },
};

export default async function AdminsPage() {
  const admin = await readActiveAdmin();

  if (!admin || admin.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  return <AdminAccountsPanel currentUserId={admin.id} />;
}
