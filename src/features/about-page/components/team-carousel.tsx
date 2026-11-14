'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import AutoplayPlugin from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import type { TTeamImage } from '@/features/team-images/types/team-image';

type TTeamCarouselProps = {
  images: readonly TTeamImage[];
};

export function TeamCarousel({ images }: Readonly<TTeamCarouselProps>) {
  const [api, setApi] = useState<CarouselApi>();
  const [plugins] = useState(() => [
    AutoplayPlugin({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  // Respect prefers-reduced-motion once Embla has initialized
  useEffect(() => {
    if (!api) {
      return undefined;
    }

    const autoplay = api.plugins().autoplay;
    if (!autoplay) {
      return undefined;
    }

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleMotionChange(event: MediaQueryListEvent | MediaQueryList) {
      if (event.matches) {
        autoplay.stop();
      } else {
        autoplay.play();
      }
    }

    if (mql.matches) {
      autoplay.stop();
    }

    mql.addEventListener('change', handleMotionChange);

    return () => {
      mql.removeEventListener('change', handleMotionChange);
    };
  }, [api]);

  const isSingle = images.length === 1;

  return (
    <div className="mt-8 md:mt-10">
      <Carousel
        aria-label="Team photos"
        opts={{ loop: true, align: 'center' }}
        plugins={plugins}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {images.map((image, index) => (
            <CarouselItem
              key={image.id}
              className={isSingle ? 'pl-3 md:pl-4' : 'basis-[85%] pl-3 md:basis-1/3 md:pl-4'}
            >
              <figure className="relative overflow-hidden rounded-xl">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={image.imageUrl}
                    alt={image.caption}
                    fill
                    priority={index === 0}
                    quality={90}
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 85vw"
                  />
                </div>
                {image.caption ? (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Nav buttons — centred below the track */}
        {!isSingle ? (
          <div className="mt-6 flex items-center justify-center gap-3">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        ) : null}
      </Carousel>
    </div>
  );
}
