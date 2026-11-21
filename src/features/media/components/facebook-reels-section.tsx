'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionLayout } from '@/components/layout/section-layout';
import { FACEBOOK_REELS_PAGE_URL } from '../constants';
import type { TFacebookReel } from '../types/facebook-reel';
import { ReelCard } from './reel-card';
import { ReelVideoModal } from './reel-video-modal';

type TFacebookReelsSectionProps = {
  reels: readonly TFacebookReel[];
};

export function FacebookReelsSection({ reels }: Readonly<TFacebookReelsSectionProps>) {
  const [selectedReel, setSelectedReel] = useState<TFacebookReel | null>(null);

  function handleSelectReel(reel: TFacebookReel) {
    setSelectedReel(reel);
  }

  function handleCloseModal() {
    setSelectedReel(null);
  }

  return (
    <SectionLayout
      id="facebook-reels"
      aria-labelledby="reels-heading"
      needTopPadding
      className="bg-muted/40"
    >
      {/* Section Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-1 rounded-full bg-primary md:h-7 md:w-1.5" aria-hidden="true" />
          <h2 id="reels-heading" className="font-extrabold tracking-tight text-foreground">
            শীর্ষ ৫টি ফেসবুক রিলস
          </h2>
        </div>
        <p className="mt-1 text-sm font-medium text-muted-foreground md:text-base">
          আমাদের সর্বাধিক দেখা ৫টি রিলস
        </p>
      </div>

      {/* Grid of Reels */}
      {reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
          <p className="text-sm md:text-base">শীঘ্রই আমাদের জনপ্রিয় রিলস যুক্ত করা হবে।</p>
        </div>
      ) : (
        // group/reels lets siblings dim when any one card is hovered.
        // [@media(hover:hover)] ensures the effect only fires on pointer devices — never on touch.
        <div className="group/reels grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-5">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="transition-opacity duration-300 [@media(hover:hover)]:group-hover/reels:opacity-30 [@media(hover:hover)]:hover:opacity-100!"
            >
              <ReelCard reel={reel} onSelect={handleSelectReel} />
            </div>
          ))}
        </div>
      )}

      {/* "সব রিলস দেখুন" — appears after all cards so user sees it once they've browsed */}
      <div className="mt-6 flex justify-center md:mt-8">
        <a
          href={FACEBOOK_REELS_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          সব রিলস দেখুন
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </a>
      </div>

      {/* Interactive Video Playback Modal */}
      <ReelVideoModal reel={selectedReel} onClose={handleCloseModal} />
    </SectionLayout>
  );
}
