import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminHeader } from '@/features/admin-shell/components/admin-header';
import { AdminSidebar } from '@/features/admin-shell/components/admin-sidebar';
import type { TAdminRole } from '@/features/admin-shell/constants/nav';

type TAdminShellProps = {
  name: string;
  role: TAdminRole;
  children: React.ReactNode;
};

export function AdminShell({ name, role, children }: Readonly<TAdminShellProps>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar name={name} role={role} />
        <SidebarInset>
          <AdminHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
