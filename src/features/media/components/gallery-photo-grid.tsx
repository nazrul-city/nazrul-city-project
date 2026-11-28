'use client';

import { useState } from 'react';
import type { TGalleryPhoto } from '../types/gallery-photo';
import { PhotoCard } from './photo-card';
import { PhotoLightbox } from './photo-lightbox';

type TGalleryPhotoGridProps = {
  photos: readonly TGalleryPhoto[];
};

export function GalleryPhotoGrid({ photos }: Readonly<TGalleryPhotoGridProps>) {
  const [activePhoto, setActivePhoto] = useState<TGalleryPhoto | null>(null);

  function handleSelectPhoto(photo: TGalleryPhoto) {
    setActivePhoto(photo);
  }

  function handleCloseLightbox() {
    setActivePhoto(null);
  }

  function handleNavigateLightbox(nextPhoto: TGalleryPhoto) {
    setActivePhoto(nextPhoto);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onSelect={handleSelectPhoto} />
        ))}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photo={activePhoto}
        photos={photos}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />
    </>
  );
}
