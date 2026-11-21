'use client';

import Image from 'next/image';
import { Eye, Play } from 'lucide-react';
import type { TFacebookReel } from '../types/facebook-reel';

type TReelCardProps = {
  reel: TFacebookReel;
  onSelect: (reel: TFacebookReel) => void;
};

export function ReelCard({ reel, onSelect }: Readonly<TReelCardProps>) {
  function handleClick() {
    onSelect(reel);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`রিলস দেখুন: ${reel.caption || 'ভিডিও'} (${reel.views} ভিউ, সময়: ${reel.duration})`}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all duration-300 hover:border-primary/60 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {/* 9:16 Portrait Video Thumbnail */}
      <div className="relative aspect-9/16 w-full overflow-hidden bg-muted/40">
        <Image
          src={reel.thumbnailUrl}
          alt={`ফেসবুক রিলস থাম্বনেইল - ${reel.caption || reel.views}`}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Center: Glassmorphic Play Button */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="flex size-11 items-center justify-center rounded-full border border-white/60 bg-black/20 text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary sm:size-13">
            <Play className="size-4.5 translate-x-0.5 fill-current sm:size-5" aria-hidden="true" />
          </span>
        </div>

        {/* Bottom Bar inside Video: Views (Left) & Duration (Right) */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-linear-to-t from-black/80 via-black/40 to-transparent px-2.5 pt-6 pb-2 sm:px-3 sm:pb-2.5"
          aria-hidden="true"
        >
          {/* Bottom Left: Views Badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-xs select-none">
            <Eye className="size-3 text-white/90" />
            <span>{reel.views}</span>
          </span>

          {/* Bottom Right: Duration Badge (min:sec) */}
          <span className="inline-flex items-center rounded-md bg-black/60 px-1.5 py-0.5 font-mono text-xs font-medium text-white backdrop-blur-xs select-none">
            {reel.duration}
          </span>
        </div>
      </div>

      {/* Caption Section Below Video with Red Bar Indicator */}
      {/* <div className="flex w-full items-center gap-2 border-t border-border/60 bg-muted/60 p-2.5 sm:p-3">
        <span className="h-3.5 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        <p className="line-clamp-1 text-xs font-medium text-foreground sm:text-sm">
          {reel.caption || 'নজরুল সিটি রিলস'}
        </p>
      </div> */}
    </button>
  );
}
