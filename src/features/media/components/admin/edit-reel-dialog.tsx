'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateFacebookReelAction } from '@/features/media/actions';
import {
  editReelFormSchema,
  type TEditReelFormValues,
} from '@/features/media/schemas/facebook-reel-schema';
import type { TFacebookReel } from '@/features/media/types/facebook-reel';
import { uploadReelThumbnailToCloudinary } from '@/features/media/utils/upload-reel-thumbnail';
import { useMounted } from '@/hooks';
import { isProjectImageFile } from '@/utils/project-image-url';

type TEditReelDialogProps = {
  reel: TFacebookReel;
  onClose: () => void;
  onReelUpdated: (updated: TFacebookReel) => void;
};

export function EditReelDialog({ reel, onClose, onReelUpdated }: Readonly<TEditReelDialogProps>) {
  const isMounted = useMounted();
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TEditReelFormValues>({
    resolver: zodResolver(editReelFormSchema),
    defaultValues: {
      videoUrl: reel.videoUrl,
      caption: reel.caption || '',
      views: reel.views,
      duration: reel.duration,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  if (!isMounted) {
    return null;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setNewThumbnailFile(null);
      return;
    }

    if (!isProjectImageFile(file)) {
      setThumbnailError('JPEG, PNG অথবা WebP ফরম্যাটের ৫ MB-র নিচের ছবি দিন।');
      setNewThumbnailFile(null);
      return;
    }

    setThumbnailError(null);
    setNewThumbnailFile(file);
  }

  async function onSubmit(values: TEditReelFormValues) {
    if (!reel) {
      return;
    }

    setServerError(null);

    try {
      let finalThumbnailUrl = reel.thumbnailUrl;

      // If new thumbnail selected, upload to Cloudinary
      if (newThumbnailFile) {
        finalThumbnailUrl = await uploadReelThumbnailToCloudinary(newThumbnailFile);
      }

      const result = await updateFacebookReelAction({
        id: reel.id,
        videoUrl: values.videoUrl,
        caption: values.caption ?? '',
        views: values.views,
        duration: values.duration,
        thumbnailUrl: finalThumbnailUrl,
      });

      if (!result.ok) {
        setServerError(result.message);
        if (result.fieldErrors) {
          for (const [key, msg] of Object.entries(result.fieldErrors)) {
            if (msg) {
              setError(key as keyof TEditReelFormValues, { message: msg });
            }
          }
        }
        return;
      }

      onReelUpdated({
        ...reel,
        videoUrl: values.videoUrl,
        caption: values.caption ?? '',
        views: values.views,
        duration: values.duration,
        thumbnailUrl: finalThumbnailUrl,
        updatedAt: new Date(),
      });

      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'আপডেট করতে ব্যর্থ হয়েছে।';
      setServerError(message);
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-reel-title"
      className="fixed inset-0 z-50 flex animate-in items-center justify-center p-4 backdrop-blur-sm fade-in-0"
    >
      <button
        type="button"
        aria-label="বন্ধ করুন"
        onClick={onClose}
        className="fixed inset-0 bg-background/80"
      />

      <div className="relative z-10 flex w-full max-w-lg animate-in flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl zoom-in-95 sm:p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 id="edit-reel-title" className="text-lg font-semibold text-foreground">
            ফেসবুক রিলস সম্পাদনা করুন
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="size-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-4 flex flex-col gap-4">
          {/* Reel URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-reel-url" className="text-sm font-medium text-foreground">
              ফেসবুক রিলস লিংক (URL)
            </label>
            <Input
              id="edit-reel-url"
              disabled={isSubmitting}
              className="h-11 text-base md:text-sm"
              aria-invalid={errors.videoUrl ? true : undefined}
              {...register('videoUrl')}
            />
            {errors.videoUrl ? (
              <p className="text-xs text-destructive">{errors.videoUrl.message}</p>
            ) : null}
          </div>

          {/* Reel Caption */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-reel-caption" className="text-sm font-medium text-foreground">
              ক্যাপশন
            </label>
            <Input
              id="edit-reel-caption"
              maxLength={200}
              placeholder="যেমন: প্রকল্পের অন্যতম দৃশ্য"
              disabled={isSubmitting}
              className="h-11 text-base md:text-sm"
              aria-invalid={errors.caption ? true : undefined}
              {...register('caption')}
            />
            {errors.caption ? (
              <p className="text-xs text-destructive">{errors.caption.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Views */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-reel-views" className="text-sm font-medium text-foreground">
                ভিউ সংখ্যা (সর্বোচ্চ ৬ অক্ষর)
              </label>
              <Input
                id="edit-reel-views"
                maxLength={6}
                disabled={isSubmitting}
                className="h-11 text-base md:text-sm"
                aria-invalid={errors.views ? true : undefined}
                {...register('views')}
              />
              {errors.views ? (
                <p className="text-xs text-destructive">{errors.views.message}</p>
              ) : null}
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-reel-duration" className="text-sm font-medium text-foreground">
                ভিডিওর সময় (min:sec)
              </label>
              <Input
                id="edit-reel-duration"
                maxLength={10}
                disabled={isSubmitting}
                className="h-11 font-mono text-base md:text-sm"
                aria-invalid={errors.duration ? true : undefined}
                {...register('duration')}
              />
              {errors.duration ? (
                <p className="text-xs text-destructive">{errors.duration.message}</p>
              ) : null}
            </div>
          </div>

          {/* Current Thumbnail & Replacement */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">বর্তমান থাম্বনেইল</span>
            <div className="relative aspect-[9/16] w-24 overflow-hidden rounded-lg border border-border">
              <Image
                src={reel.thumbnailUrl}
                alt="Current thumbnail"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <label htmlFor="edit-reel-thumbnail" className="text-xs text-muted-foreground">
              নতুন ছবি আপলোড করতে চাইলে নির্বাচন করুন (ঐচ্ছিক):
            </label>
            <input
              ref={fileInputRef}
              id="edit-reel-thumbnail"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isSubmitting}
              onChange={handleFileChange}
              className="text-xs file:mr-2 file:min-h-9 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:font-medium file:text-secondary-foreground"
            />
            {thumbnailError ? <p className="text-xs text-destructive">{thumbnailError}</p> : null}
          </div>

          {serverError ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {serverError}
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              বাতিল
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'সংরক্ষণ হচ্ছে…' : 'সংরক্ষণ করুন'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
