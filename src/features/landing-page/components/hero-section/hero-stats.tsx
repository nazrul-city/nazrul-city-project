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
    label: 'বিক্রিত প্লট',
    value: '২৫০+',
    icon: Home,
  },
  {
    id: 'happy-clients',
    label: 'সন্তুষ্ট গ্রাহক',
    value: '৯৮০+',
    icon: Users,
  },
  {
    id: 'properties-listed',
    label: 'তালিকাভুক্ত সম্পত্তি',
    value: '৮৫০+',
    icon: Building2,
  },
  {
    id: 'experiences',
    label: 'বছর অভিজ্ঞতা',
    value: '৫+',
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
                  'grid grid-cols-[auto_minmax(0,1fr)] grid-rows-2 items-center gap-x-3 md:gap-x-4',
                  index > 0 && 'md:pl-6 lg:pl-8',
                  index < stats.length - 1 && 'md:pr-6 lg:pr-8'
                )}
              >
                <dt className="col-start-2 row-start-2 truncate text-xs font-medium text-muted-foreground md:text-sm">
                  {stat.label}
                </dt>
                <dd aria-hidden="true" className="col-start-1 row-span-2 row-start-1 self-center">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary md:size-11">
                    <Icon className="size-5" />
                  </span>
                </dd>
                <dd className="col-start-2 row-start-1 font-heading text-xl font-extrabold tracking-tight text-foreground md:text-2xl lg:text-3xl">
                  {stat.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </aside>
  );
}
