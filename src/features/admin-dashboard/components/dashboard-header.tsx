import { ExternalLink, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/generated/prisma/client';

type TDashboardHeaderProps = {
  adminName: string;
  adminRole: UserRole;
  totalAdmins: number;
};

export function DashboardHeader({
  adminName,
  adminRole,
  totalAdmins,
}: Readonly<TDashboardHeaderProps>) {
  const isSuperAdmin = adminRole === 'SUPER_ADMIN';

  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1>Dashboard</h1>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
              isSuperAdmin ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
            )}
          >
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </span>
        </div>
        <p className="text-base text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{adminName}</span>. Here is
          what is happening with your listings today.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-xs">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-secondary" />
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <Users aria-hidden="true" className="size-3.5" />
            {totalAdmins} active Admin
          </span>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          View live site
          <ExternalLink aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </header>
  );
}
