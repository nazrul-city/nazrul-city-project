'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GALLERY_CATEGORIES } from '../constants/gallery';
import type { TGalleryPhoto } from '../types/gallery-photo';

type TPhotoLightboxProps = {
  photo: TGalleryPhoto | null;
  photos: readonly TGalleryPhoto[];
  onClose: () => void;
  onNavigate: (photo: TGalleryPhoto) => void;
};

export function PhotoLightbox({
  photo,
  photos,
  onClose,
  onNavigate,
}: Readonly<TPhotoLightboxProps>) {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const previousPhoto = currentIndex > 0 ? photos[currentIndex - 1] : undefined;
  const nextPhoto =
    currentIndex >= 0 && currentIndex < photos.length - 1 ? photos[currentIndex + 1] : undefined;

  function handlePrevious() {
    if (previousPhoto) {
      onNavigate(previousPhoto);
    }
  }

  function handleNext() {
    if (nextPhoto) {
      onNavigate(nextPhoto);
    }
  }

  useEffect(() => {
    if (!photo) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft' && previousPhoto) {
        onNavigate(previousPhoto);
      } else if (event.key === 'ArrowRight' && nextPhoto) {
        onNavigate(nextPhoto);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photo, onClose, previousPhoto, nextPhoto, onNavigate]);

  if (!photo) {
    return null;
  }

  const categoryLabel =
    GALLERY_CATEGORIES.find((c) => c.value === photo.category)?.label ?? photo.category;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex animate-in items-center justify-center p-3 backdrop-blur-md fade-in-0 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="গ্যালারি বন্ধ করুন"
        onClick={onClose}
        className="fixed inset-0 cursor-pointer bg-background/90"
      />

      {/* Lightbox Container */}
      <div className="relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl animate-in flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl zoom-in-95">
        {/* Header Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border p-3 sm:p-4">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {categoryLabel}
            </span>
            {photo.dateTaken ? (
              <time
                id="lightbox-title"
                className="truncate text-xs font-semibold text-foreground sm:text-sm"
              >
                {photo.dateTaken}
              </time>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:size-9"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Image Display Area */}
        <div className="relative flex max-h-[70vh] min-h-64 flex-1 items-center justify-center overflow-hidden bg-black/95 sm:min-h-96">
          <div className="relative size-full min-h-[50vh]">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              fill
              sizes="(min-width: 1280px) 1024px, 100vw"
              priority
              className="object-contain p-2"
            />
          </div>

          {/* Previous Button */}
          {previousPhoto ? (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={handlePrevious}
              aria-label="আগের ছবি"
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full shadow-lg"
            >
              <ChevronLeft className="size-5" />
            </Button>
          ) : null}

          {/* Next Button */}
          {nextPhoto ? (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={handleNext}
              aria-label="পরের ছবি"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full shadow-lg"
            >
              <ChevronRight className="size-5" />
            </Button>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/40 p-2.5 text-xs text-muted-foreground sm:p-3 sm:text-sm">
          <span className="font-medium text-foreground">{photo.title}</span>
          <span className="shrink-0 font-mono">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
