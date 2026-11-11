'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/components/ui/carousel';

type TProjectCarouselImage = {
  id: string;
  imageUrl: string;
};

type TProjectImageCarouselProps = {
  title: string;
  images: readonly TProjectCarouselImage[];
};

function ProjectCarouselStatus({ total }: Readonly<{ total: number }>) {
  const { api } = useCarousel();
  const [index, setIndex] = useState(0);
  const selectedIndex = api?.selectedScrollSnap() ?? 0;

  if (index !== selectedIndex) {
    setIndex(selectedIndex);
  }

  useEffect(() => {
    if (!api) {
      return undefined;
    }

    const carouselApi = api;

    function handleSelect() {
      setIndex(carouselApi.selectedScrollSnap());
    }

    carouselApi.on('select', handleSelect);

    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [api]);

  return (
    <p className="mt-3 text-center text-base text-muted-foreground" aria-live="polite">
      {index + 1} of {total}
    </p>
  );
}

export function ProjectImageCarousel({ title, images }: Readonly<TProjectImageCarouselProps>) {
  if (images.length === 0) {
    return null;
  }

  const hasManyImages = images.length > 1;

  return (
    <Carousel aria-label={`${title} photos`} className="w-full" opts={{ align: 'start' }}>
      <div className="relative">
        <CarouselContent className="ml-0">
          {images.map((image, index) => (
            <CarouselItem key={image.id} className="pl-0">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <Image
                  src={image.imageUrl}
                  alt={`${title}, photo ${index + 1} of ${images.length}`}
                  fill
                  priority={index === 0}
                  quality={90}
                  className="object-cover"
                  sizes="(min-width: 768px) 72rem, 100vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasManyImages ? (
          <>
            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </>
        ) : null}
      </div>
      {hasManyImages ? <ProjectCarouselStatus total={images.length} /> : null}
    </Carousel>
  );
}
