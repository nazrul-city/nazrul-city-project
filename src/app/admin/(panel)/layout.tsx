import { redirect } from 'next/navigation';
import { AdminShell } from '@/features/admin-shell';
import { readActiveAdmin } from '@/lib/auth';

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await readActiveAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <AdminShell name={admin.name} role={admin.role}>
      {children}
    </AdminShell>
  );
}
