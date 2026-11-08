import { DashboardHeader } from '@/features/admin-dashboard/components/dashboard-header';
import { DashboardKPICards } from '@/features/admin-dashboard/components/dashboard-kpi-cards';
import { DashboardQuickActions } from '@/features/admin-dashboard/components/dashboard-quick-actions';
import { DashboardRecentActivity } from '@/features/admin-dashboard/components/dashboard-recent-activity';
import type { TAdminDashboardViewProps } from '@/features/admin-dashboard/types/dashboard';

export function AdminDashboardView({
  adminName,
  adminRole,
  data,
}: Readonly<TAdminDashboardViewProps>) {
  return (
    <section className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <DashboardHeader
        adminName={adminName}
        adminRole={adminRole}
        totalAdmins={data.kpis.totalAdmins}
      />

      <DashboardKPICards kpis={data.kpis} />

      <DashboardQuickActions />

      <DashboardRecentActivity projects={data.recentProjects} />
    </section>
  );
}
