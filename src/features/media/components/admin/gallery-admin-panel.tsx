'use client';

import { useState } from 'react';
import type { TGalleryPhoto } from '@/features/media/types/gallery-photo';
import { CreateGalleryPhotoForm } from './create-gallery-photo-form';
import { GalleryAdminList } from './gallery-admin-list';

type TGalleryAdminPanelProps = {
  photos: readonly TGalleryPhoto[];
};

export function GalleryAdminPanel({ photos: initialPhotos }: Readonly<TGalleryAdminPanelProps>) {
  const [photos, setPhotos] = useState<TGalleryPhoto[]>([...initialPhotos]);

  function handlePhotoAdded(newPhoto: TGalleryPhoto) {
    setPhotos((prev) => [newPhoto, ...prev]);
  }

  function handlePhotoDeleted(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-foreground">ফটোগ্যালারি ব্যবস্থাপনা</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          মিডিয়া পেজ ও ডেডিকেটেড গ্যালারি পেজের জন্য ছবি আপলোড ও পরিচালনা করুন।
        </p>
      </div>

      <CreateGalleryPhotoForm onPhotoAdded={handlePhotoAdded} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground">বর্তমান ছবিসমূহ ({photos.length}টি)</h2>
          <span className="text-xs text-muted-foreground">নতুন ছবি সবার উপরে থাকবে</span>
        </div>

        <GalleryAdminList photos={photos} onDelete={handlePhotoDeleted} />
      </div>
    </div>
  );
}
