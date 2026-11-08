import Link from 'next/link';
import { ArrowUpRight, Building2Icon, LandPlotIcon, MapPinIcon, SparklesIcon } from 'lucide-react';

export type TFeaturedHeroCardProps = {
  kind: 'plot' | 'flat';
  tag: string;
  title: string;
  location: string;
  highlight: string;
  href: string;
};

export function FeaturedHeroCard({
  kind,
  tag,
  title,
  location,
  highlight,
  href,
}: Readonly<TFeaturedHeroCardProps>) {
  const KindIcon = kind === 'plot' ? LandPlotIcon : Building2Icon;

  return (
    <aside
      aria-label="Featured Property Highlight"
      className="relative w-full overflow-hidden rounded-xl bg-card text-card-foreground shadow-md ring-1 ring-foreground/10 md:max-w-xs md:shrink-0"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden="true" />

      <Link
        href={href}
        className="group flex min-h-11 flex-col gap-3 p-4 pl-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <SparklesIcon aria-hidden="true" className="size-3.5 shrink-0" />
            {tag}
          </span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
            <KindIcon aria-hidden="true" className="size-5" />
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="font-heading text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
            {title}
          </p>
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPinIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>{location}</span>
          </p>
        </div>

        <p className="line-clamp-3 text-xs leading-relaxed text-foreground/80">{highlight}</p>

        <span className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs font-semibold text-primary">
          বিস্তারিত দেখুন
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </Link>
    </aside>
  );
}
