'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { addTeamImageAction } from '@/features/team-images/actions';
import { MAX_TEAM_IMAGES } from '@/features/team-images/constants';
import type { TTeamImage } from '@/features/team-images/types/team-image';
import { uploadTeamImageToCloudinary } from '@/features/team-images/utils/upload-team-image';
import { canUploadProjectImages, isProjectImageFile } from '@/utils/project-image-url';

type TUploadTeamImageFormProps = {
  currentCount: number;
  onImageAdded: (image: TTeamImage) => void;
};

export function UploadTeamImageForm({
  currentCount,
  onImageAdded,
}: Readonly<TUploadTeamImageFormProps>) {
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadReady = canUploadProjectImages();
  const atMax = currentCount >= MAX_TEAM_IMAGES;
  const remainingSlots = MAX_TEAM_IMAGES - currentCount;

  function handleCaptionChange(event: ChangeEvent<HTMLInputElement>) {
    setCaption(event.target.value);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setErrorMessage(null);

    if (!isProjectImageFile(file)) {
      setErrorMessage('Use a JPEG, PNG, or WebP image under 5 MB.');
      return;
    }

    const trimmedCaption = caption.trim();
    if (trimmedCaption.length === 0) {
      setErrorMessage('Enter a caption before uploading.');
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadTeamImageToCloudinary(file);
      const result = await addTeamImageAction({ caption: trimmedCaption, imageUrl });

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      onImageAdded({
        id: imageUrl,
        caption: trimmedCaption,
        imageUrl,
        orderPos: currentCount,
        createdAt: new Date(),
      });
      setCaption('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The image could not be uploaded.';
      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-caption" className="text-base font-medium text-foreground">
          Caption
        </label>
        <Input
          id="team-caption"
          value={caption}
          onChange={handleCaptionChange}
          placeholder="e.g. Office gathering 2024"
          disabled={isUploading || atMax}
          className="h-11 text-base md:text-base"
          maxLength={200}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-photo" className="text-base font-medium text-foreground">
          Photo
        </label>
        <p className="text-sm text-muted-foreground">
          JPEG, PNG, or WebP, max 5 MB. Enter a caption first, then pick a file — it uploads
          immediately.{' '}
          {atMax
            ? `Maximum of ${MAX_TEAM_IMAGES.toString()} photos reached.`
            : `${remainingSlots.toString()} slot${remainingSlots === 1 ? '' : 's'} remaining.`}
        </p>

        {uploadReady ? null : (
          <p className="text-sm text-muted-foreground">Add Cloudinary settings before uploading.</p>
        )}

        <input
          ref={fileInputRef}
          id="team-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isUploading || atMax || !uploadReady}
          className="text-base file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:font-semibold file:text-background"
          onChange={handleFileChange}
        />
      </div>

      {isUploading ? <p className="text-sm text-muted-foreground">Uploading…</p> : null}

      {errorMessage ? (
        <p role="alert" className="text-base text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
