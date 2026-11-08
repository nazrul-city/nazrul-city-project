import { BarChart3, Building2, MapPinPlus, Megaphone, Phone } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DashboardQuickActions() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold tracking-wide text-foreground uppercase">
          Quick actions
        </h2>
        <span className="text-xs text-muted-foreground">Shortcuts for frequent tasks</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Link
          href="/admin/land-projects/new"
          className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'gap-1.5')}
        >
          <MapPinPlus aria-hidden="true" className="size-4" />
          Add Land Project
        </Link>

        <Link
          href="/admin/flat-projects/new"
          className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'gap-1.5')}
        >
          <Building2 aria-hidden="true" className="size-4" />
          Add Flat Project
        </Link>

        <Link
          href="/admin/site-notice"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          <Megaphone aria-hidden="true" className="size-4" />
          Manage Notice
        </Link>

        <Link
          href="/admin/hero-stats"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          <BarChart3 aria-hidden="true" className="size-4" />
          Hero Stats
        </Link>

        <Link
          href="/admin/contact"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          <Phone aria-hidden="true" className="size-4" />
          Website Contact
        </Link>
      </div>
    </div>
  );
}
