import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CircleDotIcon,
  CircleXIcon,
  CoinsIcon,
  MapIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TPublishedProjectCardProps = {
  href: string;
  name: string;
  shortIntro: string;
  status: string;
  statusLabel: string;
  district: string;
  price: string;
  imageUrl: string | null;
  badgeLabel: string;
  imagePriority?: boolean;
};

function readStatusTextClassName(status: string): string {
  if (status === 'AVAILABLE') {
    return 'text-foreground';
  }

  if (status === 'RESERVED') {
    return 'text-secondary';
  }

  if (status === 'SOLD') {
    return 'text-primary';
  }

  return 'text-muted-foreground';
}

function readStatusIcon(status: string): ReactNode {
  if (status === 'AVAILABLE') {
    return <BadgeCheckIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />;
  }

  if (status === 'RESERVED') {
    return <CircleDotIcon aria-hidden="true" className="size-5 shrink-0 text-secondary" />;
  }

  if (status === 'SOLD') {
    return <CircleXIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />;
  }

  return <BadgeCheckIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />;
}

export function PublishedProjectCard({
  href,
  name,
  shortIntro,
  status,
  statusLabel,
  district,
  price,
  imageUrl,
  badgeLabel,
  imagePriority = false,
}: Readonly<TPublishedProjectCardProps>) {
  return (
    <Link
      href={href}
      className="block rounded-xl transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20">
        <div className="relative aspect-video bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              priority={imagePriority}
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : null}
          <p className="pointer-events-none absolute top-3 left-3 rounded-full bg-primary/50 px-3 py-1 text-base font-medium text-primary-foreground backdrop-blur-sm">
            {badgeLabel}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="text-pretty">{name}</h3>
          {shortIntro ? <p className="text-base text-muted-foreground">{shortIntro}</p> : null}
          <p className={cn('flex items-center gap-2 text-base', readStatusTextClassName(status))}>
            {readStatusIcon(status)}
            {statusLabel}
          </p>
          <p className="flex items-center gap-2 text-base text-muted-foreground">
            <MapIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
            {district}
          </p>
          <p className="flex items-center gap-2 text-base">
            <CoinsIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
            {price}
          </p>
          <p className="mt-auto flex items-center justify-end gap-1.5 pt-2 text-base font-medium text-primary">
            বিস্তারিত দেখুন
            <ArrowRightIcon aria-hidden="true" className="size-4 shrink-0" />
          </p>
        </div>
      </article>
    </Link>
  );
}
