'use client';

import { useState } from 'react';
import type { TFacebookReel } from '../types/facebook-reel';
import { ReelCard } from './reel-card';
import { ReelVideoModal } from './reel-video-modal';

type TReelsInteractiveGridProps = {
  reels: readonly TFacebookReel[];
};

export function ReelsInteractiveGrid({ reels }: Readonly<TReelsInteractiveGridProps>) {
  const [selectedReel, setSelectedReel] = useState<TFacebookReel | null>(null);

  function handleSelectReel(reel: TFacebookReel) {
    setSelectedReel(reel);
  }

  function handleCloseModal() {
    setSelectedReel(null);
  }

  return (
    <>
      {/* group/reels lets siblings dim when any one card is hovered.
          [@media(hover:hover)] ensures the effect only fires on pointer devices — never on touch. */}
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

      {/* Interactive Video Playback Modal */}
      <ReelVideoModal reel={selectedReel} onClose={handleCloseModal} />
    </>
  );
}
