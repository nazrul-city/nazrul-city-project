'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Landmark } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { AdminNavItem } from '@/features/admin-shell/components/admin-nav-item';
import {
  ADMIN_NAV_ITEMS,
  ADMINS_NAV_ITEM,
  type TAdminRole,
} from '@/features/admin-shell/constants/nav';

type TAdminSidebarProps = {
  name: string;
  role: TAdminRole;
};

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ role }: Readonly<TAdminSidebarProps>) {
  const pathname = usePathname();
  const items = role === 'SUPER_ADMIN' ? [...ADMIN_NAV_ITEMS, ADMINS_NAV_ITEM] : ADMIN_NAV_ITEMS;

  return (
    <Sidebar collapsible="icon" className="overflow-hidden">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-11 md:h-8"
              tooltip="Nazrul City"
              render={<Link href="/admin" />}
            >
              <Landmark />
              <span className="font-semibold group-data-[collapsible=icon]:sr-only">
                Nazrul City Admin Panel
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <AdminNavItem
                  key={item.href}
                  item={item}
                  isActive={isNavItemActive(pathname, item.href)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
