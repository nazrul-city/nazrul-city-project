'use client';

import type { TGalleryPhoto } from '@/features/media/types/gallery-photo';
import { GalleryAdminRow } from './gallery-admin-row';

type TGalleryAdminListProps = {
  photos: readonly TGalleryPhoto[];
  onDelete: (id: string) => void;
};

export function GalleryAdminList({ photos, onDelete }: Readonly<TGalleryAdminListProps>) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
        <p className="text-sm md:text-base">এখনও কোনো ছবি যোগ করা হয়নি।</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {photos.map((photo) => (
        <GalleryAdminRow key={photo.id} photo={photo} onDelete={onDelete} />
      ))}
    </ul>
  );
}
