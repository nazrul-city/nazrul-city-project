import Link from 'next/link';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { TAdminNavItem } from '@/features/admin-shell/constants/nav';

type TAdminNavItemProps = {
  item: TAdminNavItem;
  isActive: boolean;
};

export function AdminNavItem({ item, isActive }: Readonly<TAdminNavItemProps>) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.label}
        className="h-11 md:h-8"
        render={<Link href={item.href} />}
      >
        <Icon />
        <span className="group-data-[collapsible=icon]:sr-only">{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
