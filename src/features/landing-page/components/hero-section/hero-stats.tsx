import type { LucideIcon } from 'lucide-react';
import { Award, Building2, Home, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type THeroStatItem = {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
};

export type THeroStatsProps = {
  stats?: readonly THeroStatItem[];
  className?: string;
};

export const DEFAULT_HERO_STATS: readonly THeroStatItem[] = [
  {
    id: 'plots-sold',
    label: 'Plots Sold',
    value: '250+',
    icon: Home,
  },
  {
    id: 'happy-clients',
    label: 'Happy Clients',
    value: '980+',
    icon: Users,
  },
  {
    id: 'properties-listed',
    label: 'Properties Listed',
    value: '850+',
    icon: Building2,
  },
  {
    id: 'experiences',
    label: 'Experiences',
    value: '5+',
    icon: Award,
  },
] as const;

export function HeroStats({ stats = DEFAULT_HERO_STATS, className }: Readonly<THeroStatsProps>) {
  return (
    <aside aria-label="Company Statistics" className={cn('w-full', className)}>
      <div className="rounded-2xl border border-border/80 bg-card/95 p-4 shadow-xl backdrop-blur-md md:p-6 lg:p-7 dark:bg-card/90">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0 md:divide-x md:divide-border/60">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={cn(
                  'flex items-center gap-3 md:gap-3.5',
                  index > 0 && 'md:pl-6 lg:pl-8',
                  index < stats.length - 1 && 'md:pr-6 lg:pr-8'
                )}
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary md:size-11"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <dd className="font-heading text-xl font-extrabold tracking-tight text-foreground md:text-2xl lg:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="truncate text-xs font-medium text-muted-foreground md:text-sm">
                    {stat.label}
                  </dt>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </aside>
  );
}
