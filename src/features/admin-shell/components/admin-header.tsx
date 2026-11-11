'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { signOut } from '@/features/admin-login/actions/sign-out';
import { ADMIN_NAV_ITEMS, ADMINS_NAV_ITEM } from '@/features/admin-shell/constants/nav';

const NAV_LABELS = [...ADMIN_NAV_ITEMS, ADMINS_NAV_ITEM];

function readCurrentLabel(pathname: string): string {
  const match = NAV_LABELS.find((item) => {
    if (item.href === '/admin') {
      return pathname === '/admin';
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
  return match?.label ?? 'Admin';
}

export function AdminHeader() {
  const pathname = usePathname();
  const currentLabel = readCurrentLabel(pathname);
  const isDashboard = pathname === '/admin';

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="min-h-11 min-w-11" />
      <Separator orientation="vertical" className="h-4" />
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList>
          {isDashboard ? (
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/admin" />}>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <ThemeToggle className="min-h-11 min-w-11" />
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </header>
  );
}
