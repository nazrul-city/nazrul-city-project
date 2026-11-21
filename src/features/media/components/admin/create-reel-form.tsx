'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addFacebookReelAction } from '@/features/media/actions';
import { MAX_FACEBOOK_REELS } from '@/features/media/constants';
import {
  createReelFormSchema,
  type TCreateReelFormValues,
} from '@/features/media/schemas/facebook-reel-schema';
import type { TFacebookReel } from '@/features/media/types/facebook-reel';
import { uploadReelThumbnailToCloudinary } from '@/features/media/utils/upload-reel-thumbnail';
import { canUploadProjectImages, isProjectImageFile } from '@/utils/project-image-url';

type TCreateReelFormProps = {
  currentCount: number;
  onReelAdded: (reel: TFacebookReel) => void;
};

const DEFAULT_VALUES: TCreateReelFormValues = {
  videoUrl: '',
  caption: '',
  views: '',
  duration: '',
};

export function CreateReelForm({ currentCount, onReelAdded }: Readonly<TCreateReelFormProps>) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TCreateReelFormValues>({
    resolver: zodResolver(createReelFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const uploadReady = canUploadProjectImages();
  const atMax = currentCount >= MAX_FACEBOOK_REELS;
  const remainingSlots = MAX_FACEBOOK_REELS - currentCount;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setThumbnailFile(null);
      return;
    }

    if (!isProjectImageFile(file)) {
      setThumbnailError('JPEG, PNG অথবা WebP ফরম্যাটের ৫ MB-র নিচের ছবি নির্বাচন করুন।');
      setThumbnailFile(null);
      return;
    }

    setThumbnailError(null);
    setThumbnailFile(file);
  }

  async function onSubmit(values: TCreateReelFormValues) {
    setServerError(null);

    if (!thumbnailFile) {
      setThumbnailError('থাম্বনেইল ছবি নির্বাচন করুন।');
      return;
    }

    if (atMax) {
      setServerError(`সর্বোচ্চ ${MAX_FACEBOOK_REELS}টি রিলস যোগ করা সম্ভব।`);
      return;
    }

    try {
      // 1. Upload thumbnail to Cloudinary
      const uploadedThumbnailUrl = await uploadReelThumbnailToCloudinary(thumbnailFile);

      // 2. Call server action to save in DB
      const result = await addFacebookReelAction({
        videoUrl: values.videoUrl,
        caption: values.caption ?? '',
        views: values.views,
        duration: values.duration,
        thumbnailUrl: uploadedThumbnailUrl,
      });

      if (!result.ok) {
        setServerError(result.message);
        if (result.fieldErrors) {
          for (const [key, msg] of Object.entries(result.fieldErrors)) {
            if (msg) {
              setError(key as keyof TCreateReelFormValues, { message: msg });
            }
          }
        }
        return;
      }

      onReelAdded({
        id: crypto.randomUUID(),
        videoUrl: values.videoUrl,
        caption: values.caption ?? '',
        views: values.views,
        duration: values.duration,
        thumbnailUrl: uploadedThumbnailUrl,
        priority: currentCount,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Reset form
      reset(DEFAULT_VALUES);
      setThumbnailFile(null);
      setThumbnailError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'রিলস যোগ করা যায়নি।';
      setServerError(message);
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">নতুন ফেসবুক রিলস যুক্ত করুন</h2>
        <p className="text-sm text-muted-foreground">
          {atMax
            ? `সর্বোচ্চ ${MAX_FACEBOOK_REELS}টি রিলসের কোটা পূর্ণ হয়েছে। নতুন যোগ করতে আগের কোনোটি মুছুন।`
            : `${remainingSlots}টি রিলস যোগ করার সুযোগ বাকি আছে (সর্বোচ্চ ${MAX_FACEBOOK_REELS}টি)।`}
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        {/* Facebook Reel URL */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reel-url" className="text-sm font-medium text-foreground">
            ফেসবুক রিলস লিংক (URL) <span className="text-destructive">*</span>
          </label>
          <Input
            id="reel-url"
            placeholder="https://www.facebook.com/reel/1234567890"
            disabled={isSubmitting || atMax}
            className="h-11 text-base md:text-sm"
            aria-invalid={errors.videoUrl ? true : undefined}
            {...register('videoUrl')}
          />
          {errors.videoUrl ? (
            <p className="text-xs text-destructive">{errors.videoUrl.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              শুধুমাত্র ফেসবুক রিলসের লিংক গ্রহণ করা হবে।
            </p>
          )}
        </div>

        {/* Reel Caption */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reel-caption" className="text-sm font-medium text-foreground">
            ক্যাপশন (কার্ডের নিচে প্রদর্শিত হবে)
          </label>
          <Input
            id="reel-caption"
            maxLength={200}
            placeholder="যেমন: প্রকল্পের অন্যতম দৃশ্য"
            disabled={isSubmitting || atMax}
            className="h-11 text-base md:text-sm"
            aria-invalid={errors.caption ? true : undefined}
            {...register('caption')}
          />
          {errors.caption ? (
            <p className="text-xs text-destructive">{errors.caption.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">সর্বোচ্চ ২০০ অক্ষর।</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Views (Max 6 chars) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reel-views" className="text-sm font-medium text-foreground">
              ভিউ সংখ্যা (সর্বোচ্চ ৬ অক্ষর) <span className="text-destructive">*</span>
            </label>
            <Input
              id="reel-views"
              maxLength={6}
              placeholder="e.g. 245K"
              disabled={isSubmitting || atMax}
              className="h-11 text-base md:text-sm"
              aria-invalid={errors.views ? true : undefined}
              {...register('views')}
            />
            {errors.views ? (
              <p className="text-xs text-destructive">{errors.views.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">যেমন: 245K, 98K, 1.2M</p>
            )}
          </div>

          {/* Duration (min:sec) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reel-duration" className="text-sm font-medium text-foreground">
              ভিডিওর সময় (min:sec) <span className="text-destructive">*</span>
            </label>
            <Input
              id="reel-duration"
              maxLength={10}
              placeholder="e.g. 0:56"
              disabled={isSubmitting || atMax}
              className="h-11 font-mono text-base md:text-sm"
              aria-invalid={errors.duration ? true : undefined}
              {...register('duration')}
            />
            {errors.duration ? (
              <p className="text-xs text-destructive">{errors.duration.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">যেমন: 0:56, 1:20</p>
            )}
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reel-thumbnail" className="text-sm font-medium text-foreground">
            থাম্বনেইল ছবি <span className="text-destructive">*</span>
          </label>
          <input
            ref={fileInputRef}
            id="reel-thumbnail"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isSubmitting || atMax || !uploadReady}
            onChange={handleFileChange}
            className="text-sm file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:font-semibold file:text-secondary-foreground"
          />
          {thumbnailError ? (
            <p className="text-xs text-destructive">{thumbnailError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              JPEG, PNG অথবা WebP ফরম্যাটের ছবি (সর্বোচ্চ ৫ MB)। এটি ক্লাউডিনারিতে আপলোড হবে।
            </p>
          )}
        </div>

        {serverError ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting || atMax || !uploadReady}
          className="min-h-11 w-full self-start font-semibold sm:w-auto"
        >
          {isSubmitting ? 'আপলোড হচ্ছে…' : 'রিলস যুক্ত করুন'}
        </Button>
      </form>
    </div>
  );
}
