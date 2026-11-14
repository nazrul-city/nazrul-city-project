'use client';

import { useState } from 'react';
import { reorderTeamImagesAction } from '@/features/team-images/actions';
import { TeamImageList } from '@/features/team-images/components/team-image-list';
import { UploadTeamImageForm } from '@/features/team-images/components/upload-team-image-form';
import type { TTeamImage } from '@/features/team-images/types/team-image';

type TTeamAdminPanelProps = {
  images: readonly TTeamImage[];
};

export function TeamAdminPanel({ images: initialImages }: Readonly<TTeamAdminPanelProps>) {
  const [images, setImages] = useState<TTeamImage[]>([...initialImages]);
  const [reorderError, setReorderError] = useState<string | null>(null);

  function handleImageAdded(newImage: TTeamImage) {
    setImages((prev) => [...prev, newImage]);
  }

  function handleImageDeleted(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  async function handleMoveImage(fromIndex: number, toIndex: number) {
    const next = [...images];
    const itemA = next[fromIndex];
    const itemB = next[toIndex];

    if (!itemA || !itemB) {
      return;
    }

    next[fromIndex] = itemB;
    next[toIndex] = itemA;
    setImages(next);
    setReorderError(null);

    const result = await reorderTeamImagesAction(next.map((img) => img.id));
    if (!result.ok) {
      setReorderError(result.message);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <UploadTeamImageForm currentCount={images.length} onImageAdded={handleImageAdded} />

      {reorderError ? (
        <p role="alert" className="text-base text-destructive">
          {reorderError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Current photos ({images.length})</h2>
        <TeamImageList images={images} onMove={handleMoveImage} onDelete={handleImageDeleted} />
      </div>
    </div>
  );
}
