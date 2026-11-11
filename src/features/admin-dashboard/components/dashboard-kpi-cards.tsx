import { ArrowRight, Building2, Map, Megaphone, Radio, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TDashboardKPIs } from '@/features/admin-dashboard/types/dashboard';

type TDashboardKPICardsProps = {
  kpis: TDashboardKPIs;
};

export function DashboardKPICards({ kpis }: Readonly<TDashboardKPICardsProps>) {
  const isNoticeLive = Boolean(kpis.activeNotice?.isEnabled);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Land Projects KPI */}
      <Card className="transition-all hover:border-foreground/20 hover:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Map aria-hidden="true" className="size-4.5" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">Land projects</span>
          </div>
          <Link
            href="/admin/land-projects"
            className="text-muted-foreground hover:text-foreground"
            aria-label="View all land projects"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold tracking-tight text-foreground">
              {kpis.publishedPlots}
            </span>
            <span className="text-sm text-muted-foreground">
              published / {kpis.totalPlots} total
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary/10 px-2 py-0.5 font-medium text-secondary">
              <span className="size-1.5 rounded-full bg-secondary" />
              {kpis.availablePlots} available
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
              {kpis.reservedPlots} reserved
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
              {kpis.soldPlots} sold
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Flat Projects KPI */}
      <Card className="transition-all hover:border-foreground/20 hover:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Building2 aria-hidden="true" className="size-4.5" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">Apartment flats</span>
          </div>
          <Link
            href="/admin/flat-projects"
            className="text-muted-foreground hover:text-foreground"
            aria-label="View all flat projects"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold tracking-tight text-foreground">
              {kpis.publishedFlats}
            </span>
            <span className="text-sm text-muted-foreground">
              published / {kpis.totalFlats} total
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary/10 px-2 py-0.5 font-medium text-secondary">
              {kpis.readyFlats} ready
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
              {kpis.underConstructionFlats} building
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
              {kpis.upcomingFlats} upcoming
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Hero Site Notice */}
      <Card className="transition-all hover:border-foreground/20 hover:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-lg',
                isNoticeLive ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'
              )}
            >
              <Megaphone aria-hidden="true" className="size-4.5" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">Homepage notice</span>
          </div>
          <Link
            href="/admin/site-notice"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Manage homepage notice"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                isNoticeLive ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'
              )}
            >
              <Radio aria-hidden="true" className={cn('size-3', isNoticeLive && 'animate-pulse')} />
              {isNoticeLive ? 'Live on homepage' : 'Inactive'}
            </span>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {kpis.activeNotice?.message
              ? `“${kpis.activeNotice.message}”`
              : 'No announcement notice is currently set.'}
          </p>
        </CardContent>
      </Card>

      {/* 4. Featured Listings */}
      <Card className="transition-all hover:border-foreground/20 hover:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles aria-hidden="true" className="size-4.5" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">Featured showcases</span>
          </div>
          <Link
            href="/admin/land-projects"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Manage featured projects"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-1.5 pt-1 text-xs">
          <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5">
            <span className="font-medium text-muted-foreground">Land:</span>
            <span className="max-w-[130px] truncate font-medium text-foreground">
              {kpis.featuredPlotName ?? 'None pinned'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="font-medium text-muted-foreground">Flat:</span>
            <span className="max-w-[130px] truncate font-medium text-foreground">
              {kpis.featuredFlatName ?? 'None pinned'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
