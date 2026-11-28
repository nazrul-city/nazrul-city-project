'use client';

import { useState } from 'react';
import { Marquee } from '@/components/shared/marquee';
import type { TPodcast } from '../types/podcast';
import { PodcastCard } from './podcast-card';
import { PodcastVideoModal } from './podcast-video-modal';

type TPodcastMarqueeInteractiveProps = {
  podcasts: readonly TPodcast[];
};

export function PodcastMarqueeInteractive({ podcasts }: Readonly<TPodcastMarqueeInteractiveProps>) {
  const [selectedPodcast, setSelectedPodcast] = useState<TPodcast | null>(null);

  if (podcasts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative w-full overflow-hidden">
        {/* Subtle fade edges on desktop for premium look */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-linear-to-r from-background to-transparent md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-linear-to-l from-background to-transparent md:block"
        />

        <Marquee speed={40} gap={24} pauseOnHover repeat={4} className="py-2">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} onSelect={setSelectedPodcast} />
          ))}
        </Marquee>
      </div>

      <PodcastVideoModal podcast={selectedPodcast} onClose={() => setSelectedPodcast(null)} />
    </>
  );
}
