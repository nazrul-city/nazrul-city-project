import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminDashboardView, readDashboardData } from '@/features/admin-dashboard';
import { readActiveAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Nazrul City admin dashboard.',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [admin, dashboardData] = await Promise.all([readActiveAdmin(), readDashboardData()]);

  if (!admin) {
    redirect('/admin/login');
  }

  return <AdminDashboardView adminName={admin.name} adminRole={admin.role} data={dashboardData} />;
}
