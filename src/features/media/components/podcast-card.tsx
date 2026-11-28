'use client';

import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';
import { SocialIcon } from '@/components/shared/social-icon';
import type { TPodcast } from '../types/podcast';

type TPodcastCardProps = {
  podcast: TPodcast;
  onSelect: (podcast: TPodcast) => void;
};

export function PodcastCard({ podcast, onSelect }: Readonly<TPodcastCardProps>) {
  const metaItems = [podcast.clientName, podcast.clientDesignation, podcast.projectName]
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));

  const primaryMeta = metaItems[0] ?? 'নজরুল সিটি পডকাস্ট';
  const secondaryMeta = metaItems.slice(1).join(' · ');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(podcast);
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(podcast)}
      onKeyDown={handleKeyDown}
      className="group/card relative flex h-[280px] w-[290px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:h-[312px] md:w-[340px]"
    >
      {/* 16:9  Thumbnail Container */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
        <Image
          src={podcast.thumbnailUrl}
          alt={podcast.title}
          fill
          sizes="(max-width: 767px) 290px, 340px"
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />

        {/*  Glassmorphic Play Button  */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/80 text-white shadow-md transition-all duration-300 group-hover/card:scale-110 group-hover/card:border-primary group-hover/card:bg-primary sm:size-13">
            <Play className="size-4.5 translate-x-0.5 fill-current sm:size-5" aria-hidden="true" />
          </span>
        </div>

        {/* Bottom Left: YouTube Icon Badge */}
        <div
          aria-hidden="true"
          className="absolute bottom-1 left-2.5 z-10 inline-flex items-center justify-center rounded-md text-primary select-none"
        >
          <SocialIcon name="youtube" className="size-8" />
        </div>

        {/* Video Duration Pill Badge */}
        <div className="absolute right-2.5 bottom-2.5 z-10 rounded-md bg-black/80 px-2 py-0.5 font-mono text-xs font-semibold text-white backdrop-blur-xs select-none">
          {podcast.duration}
        </div>
      </div>

      {/* Card Content Footer — Title on top, 2-line metadata anchored at bottom */}
      <div className="flex flex-1 flex-col justify-between gap-2 p-3.5">
        {/* Title (max 2 lines) */}
        <h3 className="line-clamp-2 text-xs leading-snug font-bold text-foreground transition-colors group-hover/card:text-primary md:text-sm">
          {podcast.title}
        </h3>

        {/* Bottom Footer: fixed min-height so the top divider aligns across 1-line and 2-line cards */}
        <div className="flex min-h-10 items-center justify-between gap-2 border-t border-border/60 pt-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs leading-4 font-semibold text-foreground">
              {primaryMeta}
            </p>
            {secondaryMeta ? (
              <p className="truncate text-[11px] leading-4 font-medium text-muted-foreground">
                {secondaryMeta}
              </p>
            ) : null}
          </div>
          <ArrowUpRight
            className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/card:text-primary"
            aria-hidden="true"
          />
        </div>
      </div>
    </button>
  );
}
