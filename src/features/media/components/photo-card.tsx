'use client';

import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { GALLERY_CATEGORIES } from '../constants/gallery';
import type { TGalleryPhoto } from '../types/gallery-photo';

type TPhotoCardProps = {
  photo: TGalleryPhoto;
  onSelect: (photo: TGalleryPhoto) => void;
};

export function PhotoCard({ photo, onSelect }: Readonly<TPhotoCardProps>) {
  function handleClick() {
    onSelect(photo);
  }

  const categoryLabel =
    GALLERY_CATEGORIES.find((c) => c.value === photo.category)?.label ?? photo.category;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`ছবি বড় করে দেখুন: ${photo.title} (${categoryLabel})`}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border-border bg-card text-left shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {/* 4:3 Aspect Ratio Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted/40">
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover / Focus Overlay with subtle gradient */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 opacity-90 transition-opacity duration-300 sm:p-2.5 md:p-3 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          {/* Top Row: Category Badge & Zoom Icon */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <span className="inline-flex max-w-[calc(100%-1.75rem)] min-w-0 items-center truncate rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground backdrop-blur-xs select-none sm:max-w-[calc(100%-2.25rem)] sm:px-2.5 sm:text-xs">
              <span className="truncate">{categoryLabel}</span>
            </span>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs sm:size-7">
              <Maximize2 className="size-3 sm:size-3.5" />
            </span>
          </div>

          {/* Bottom Date or Title */}
          <p className="line-clamp-2 text-[11px] font-medium text-white sm:text-xs md:text-sm">
            {photo.dateTaken || photo.title}
          </p>
        </div>
      </div>
    </button>
  );
}
