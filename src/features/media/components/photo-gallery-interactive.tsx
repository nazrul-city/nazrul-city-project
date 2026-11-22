'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GALLERY_CATEGORIES } from '../constants/gallery';
import type { TCategoryFilter, TGalleryPhoto } from '../types/gallery-photo';
import { PhotoCard } from './photo-card';
import { PhotoLightbox } from './photo-lightbox';

type TPhotoGalleryInteractiveProps = {
  photos: readonly TGalleryPhoto[];
};

export function PhotoGalleryInteractive({ photos }: Readonly<TPhotoGalleryInteractiveProps>) {
  const [selectedCategory, setSelectedCategory] = useState<TCategoryFilter>('ALL');
  const [activePhoto, setActivePhoto] = useState<TGalleryPhoto | null>(null);

  const filteredPhotos =
    selectedCategory === 'ALL'
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);

  function handleSelectPhoto(photo: TGalleryPhoto) {
    setActivePhoto(photo);
  }

  function handleCloseLightbox() {
    setActivePhoto(null);
  }

  function handleNavigateLightbox(nextPhoto: TGalleryPhoto) {
    setActivePhoto(nextPhoto);
  }

  function handleCategoryChange(value: unknown) {
    if (typeof value === 'string') {
      setSelectedCategory(value as TCategoryFilter);
    }
  }

  return (
    <>
      {/* Category Filter Select */}
      <div className="mb-6 flex items-center justify-start md:mb-8">
        <div className="w-full sm:w-72">
          <Select
            items={GALLERY_CATEGORIES}
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger aria-label="ক্যাটাগরি নির্বাচন করুন">
              <div className="flex items-center gap-2 truncate overflow-hidden">
                <SlidersHorizontal className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  ক্যাটাগরি:
                </span>
                <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন">
                  {(value) => (
                    <span className="font-semibold text-foreground">
                      {GALLERY_CATEGORIES.find((c) => c.value === value)?.label ??
                        String(value ?? '')}
                    </span>
                  )}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {GALLERY_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid of Photos */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
          <p className="text-sm md:text-base">এই ক্যাটাগরিতে এখনও কোনো ছবি যুক্ত করা হয়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {filteredPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onSelect={handleSelectPhoto} />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <PhotoLightbox
        photo={activePhoto}
        photos={filteredPhotos}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />
    </>
  );
}
