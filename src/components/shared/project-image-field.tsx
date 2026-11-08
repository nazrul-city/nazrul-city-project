'use client';

import { useImperativeHandle, useRef, useState, type ChangeEvent, type RefObject } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { deleteProjectImageAction } from '@/actions/delete-project-image';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { clientEnv } from '@/config/env/client';
import {
  MAX_PROJECT_IMAGES,
  canUploadProjectImages,
  isAllowedProjectImageUrl,
  isProjectImageFile,
} from '@/utils/project-image-url';

const uploadResponseSchema = z.object({
  secure_url: z.string().url(),
});

export function readImageError(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  if ('message' in error && typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }

  if (
    'root' in error &&
    error.root &&
    typeof error.root === 'object' &&
    'message' in error.root &&
    typeof error.root.message === 'string' &&
    error.root.message.length > 0
  ) {
    return error.root.message;
  }

  return undefined;
}

export type TProjectImageUploader = {
  waitForUploads: () => Promise<readonly string[] | null>;
};

type TProjectImageFieldProps = {
  images: readonly string[];
  disabled?: boolean;
  errorMessage?: string;
  onImagesChange: (images: string[]) => void;
  uploaderRef: RefObject<TProjectImageUploader | null>;
};

type TProjectImageItemProps = {
  imageUrl: string;
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled: boolean;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (index: number) => void;
};

function ProjectImageItem({
  imageUrl,
  index,
  canMoveUp,
  canMoveDown,
  disabled,
  onMove,
  onRemove,
}: Readonly<TProjectImageItemProps>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleMoveUp() {
    onMove(index, index - 1);
  }

  function handleMoveDown() {
    onMove(index, index + 1);
  }

  function handleOpenChange(open: boolean) {
    if (isDeleting) {
      return;
    }

    setIsDialogOpen(open);

    if (!open) {
      setDeleteError(null);
    }
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteProjectImageAction(imageUrl);
    setIsDeleting(false);

    if (!result.ok) {
      setDeleteError(result.message ?? 'Could not delete the photo from Cloudinary.');
      return;
    }

    setIsDialogOpen(false);
    onRemove(index);
  }

  function handleForceRemove() {
    setIsDialogOpen(false);
    onRemove(index);
  }

  return (
    <li className="flex flex-col gap-2 rounded-xl bg-card p-3 ring-1 ring-foreground/10 md:flex-row md:items-center">
      <div className="relative h-24 w-full overflow-hidden rounded-lg md:w-32">
        <Image src={imageUrl} alt="" fill className="object-cover" sizes="128px" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !canMoveUp}
          onClick={handleMoveUp}
        >
          Move up
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !canMoveDown}
          onClick={handleMoveDown}
        >
          Move down
        </Button>
        <AlertDialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger
            render={
              <Button type="button" variant="destructive" disabled={disabled || isDeleting}>
                Remove
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this photo from Cloudinary CDN. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {deleteError ? (
              <div className="flex flex-col gap-1.5">
                <p role="alert" className="text-base text-destructive">
                  {deleteError}
                </p>
                <p className="text-sm text-muted-foreground">
                  You can still remove it from this listing form without deleting it from
                  Cloudinary.
                </p>
              </div>
            ) : null}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              {deleteError ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting}
                  onClick={handleForceRemove}
                >
                  Remove from listing only
                </Button>
              ) : null}
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
              >
                {isDeleting ? 'Deleting photo…' : 'Delete photo'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}

async function uploadProjectImage(file: File): Promise<string> {
  const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = clientEnv.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Image upload is not set up yet.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new Error('The image could not be uploaded.');
  }

  const payload: unknown = await response.json();
  const parsed = uploadResponseSchema.safeParse(payload);

  if (!parsed.success || !isAllowedProjectImageUrl(parsed.data.secure_url)) {
    throw new Error('The image could not be uploaded.');
  }

  return parsed.data.secure_url;
}

export function ProjectImageField({
  images,
  disabled = false,
  errorMessage,
  onImagesChange,
  uploaderRef,
}: Readonly<TProjectImageFieldProps>) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imagesRef = useRef<readonly string[]>(images);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingRef = useRef(0);
  const failedRef = useRef(false);
  const uploadReady = canUploadProjectImages();

  function publishImages(nextImages: string[]) {
    imagesRef.current = nextImages;
    onImagesChange(nextImages);
  }

  useImperativeHandle(uploaderRef, () => ({
    waitForUploads: async () => {
      await queueRef.current;

      if (failedRef.current) {
        return null;
      }

      return imagesRef.current;
    },
  }));

  function handleMove(fromIndex: number, toIndex: number) {
    const next = [...images];
    const moving = next[fromIndex];
    const target = next[toIndex];

    if (!moving || !target) {
      return;
    }

    next[fromIndex] = target;
    next[toIndex] = moving;
    publishImages(next);
  }

  function handleRemove(index: number) {
    publishImages(images.filter((_, imageIndex) => imageIndex !== index));
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    if (imagesRef.current.length + files.length > MAX_PROJECT_IMAGES) {
      setUploadError('Add no more than 15 images.');
      return;
    }

    if (files.some((file) => !isProjectImageFile(file))) {
      setUploadError('Use a JPEG, PNG, or WebP image under 5 MB.');
      return;
    }

    pendingRef.current += 1;
    setIsUploading(true);
    setUploadError(null);
    failedRef.current = false;

    queueRef.current = queueRef.current.then(async () => {
      try {
        const uploaded: string[] = [];

        for (const file of files) {
          uploaded.push(await uploadProjectImage(file));
        }

        publishImages([...imagesRef.current, ...uploaded]);
      } catch (error) {
        failedRef.current = true;
        const message = error instanceof Error ? error.message : 'The image could not be uploaded.';
        setUploadError(message);
      } finally {
        pendingRef.current -= 1;

        if (pendingRef.current === 0) {
          setIsUploading(false);
        }
      }
    });
  }

  const message = errorMessage ?? uploadError;

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="project-images" className="text-base font-medium text-foreground">
        Images
      </label>
      <p className="text-base text-muted-foreground">
        Choose up to 15 JPEG, PNG, or WebP images, then click Save. Each file must be 5 MB or
        smaller. The photo is stored only after it appears below and you save.
      </p>
      {uploadReady ? null : (
        <p className="text-base text-muted-foreground">
          Add the Cloudinary settings before uploading images.
        </p>
      )}
      <input
        id="project-images"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled || isUploading || !uploadReady || images.length >= MAX_PROJECT_IMAGES}
        className="text-base file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:font-semibold file:text-background"
        onChange={handleFileChange}
      />
      {isUploading ? <p className="text-base text-muted-foreground">Uploading…</p> : null}
      {message ? (
        <p role="alert" className="text-base text-destructive">
          {message}
        </p>
      ) : null}
      {images.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {images.map((imageUrl, index) => (
            <ProjectImageItem
              key={imageUrl}
              imageUrl={imageUrl}
              index={index}
              canMoveUp={index > 0}
              canMoveDown={index < images.length - 1}
              disabled={disabled || isUploading}
              onMove={handleMove}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
