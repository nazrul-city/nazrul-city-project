'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePodcastAction } from '@/features/media/actions';
import { MAX_PUBLISHED_PODCASTS } from '@/features/media/constants/podcasts';
import {
  podcastFormSchema,
  type TPodcastFormValues,
} from '@/features/media/schemas/podcast-schema';
import type { TPodcast } from '@/features/media/types/podcast';
import { uploadPodcastThumbnailToCloudinary } from '@/features/media/utils/upload-podcast-thumbnail';
import { useMounted } from '@/hooks';
import { canUploadProjectImages, isProjectImageFile } from '@/utils/project-image-url';

type TEditPodcastDialogProps = {
  podcast: TPodcast;
  publishedCount: number;
  onClose: () => void;
  onPodcastUpdated: (podcast: TPodcast) => void;
};

export function EditPodcastDialog({
  podcast,
  publishedCount,
  onClose,
  onPodcastUpdated,
}: Readonly<TEditPodcastDialogProps>) {
  const isMounted = useMounted();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAtPublishedLimit = publishedCount >= MAX_PUBLISHED_PODCASTS && !podcast.published;
  const uploadReady = canUploadProjectImages();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TPodcastFormValues>({
    resolver: zodResolver(podcastFormSchema),
    defaultValues: {
      title: podcast.title,
      youtubeUrl: podcast.youtubeUrl,
      duration: podcast.duration,
      published: podcast.published,
      clientName: podcast.clientName ?? '',
      clientDesignation: podcast.clientDesignation ?? '',
      projectName: podcast.projectName ?? '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const isPublishedChecked = useWatch({
    control,
    name: 'published',
    defaultValue: podcast.published,
  });

  if (!isMounted) {
    return null;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }

    if (!isProjectImageFile(file)) {
      setThumbnailError('শুধুমাত্র ছবি ফাইল নির্বাচন করুন (সর্বোচ্চ 10MB)।');
      setThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }

    setThumbnailError(null);
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function handlePublishedCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked;
    if (checked && isAtPublishedLimit) {
      setShowLimitAlert(true);
      setValue('published', false);
      return;
    }
    setValue('published', checked);
  }

  async function onSubmit(data: TPodcastFormValues) {
    if (data.published && isAtPublishedLimit) {
      setShowLimitAlert(true);
      return;
    }

    setServerError(null);
    setThumbnailError(null);

    try {
      let finalThumbnailUrl = podcast.thumbnailUrl;

      // If user uploaded a new image, upload to Cloudinary
      if (thumbnailFile) {
        finalThumbnailUrl = await uploadPodcastThumbnailToCloudinary(thumbnailFile);
      }

      const result = await updatePodcastAction({
        id: podcast.id,
        title: data.title,
        youtubeUrl: data.youtubeUrl,
        duration: data.duration,
        published: data.published,
        clientName: data.clientName ?? '',
        clientDesignation: data.clientDesignation ?? '',
        projectName: data.projectName ?? '',
        thumbnailUrl: finalThumbnailUrl,
      });

      if (!result.ok) {
        if ('fieldErrors' in result && result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            if (message) {
              setError(field as keyof TPodcastFormValues, { message });
            }
          }
        }
        setServerError(result.message);
        return;
      }

      onPodcastUpdated({
        ...podcast,
        title: data.title,
        youtubeUrl: data.youtubeUrl,
        thumbnailUrl: finalThumbnailUrl,
        duration: data.duration,
        published: data.published,
        clientName: data.clientName ?? '',
        clientDesignation: data.clientDesignation ?? '',
        projectName: data.projectName ?? '',
        updatedAt: new Date(),
      });

      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'পডকাস্ট আপডেট করার সময় ত্রুটি হয়েছে।';
      setServerError(message);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-podcast-title"
      className="fixed inset-0 z-50 flex animate-in items-center justify-center p-3 backdrop-blur-sm fade-in-0 sm:p-4"
    >
      <button
        type="button"
        aria-label="বন্ধ করুন"
        onClick={onClose}
        className="fixed inset-0 bg-background/80"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl zoom-in-95">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border p-4 sm:p-5">
          <h2 id="edit-podcast-title" className="text-base font-bold text-foreground sm:text-lg">
            পডকাস্ট সম্পাদনা করুন
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="size-8 rounded-full"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-4 sm:p-6">
          {isAtPublishedLimit ? (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p>সর্বোচ্চ ১০টি ভিডিও দৃশ্যমান রাখার সীমা পূর্ণ হওয়ায় এটি প্রকাশ করা যাবে না।</p>
            </div>
          ) : null}

          {serverError ? (
            <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive sm:text-sm">
              {serverError}
            </div>
          ) : null}

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Title */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground sm:text-sm">
                  শিরোনাম <span className="text-destructive">*</span>
                </label>
                <Input aria-invalid={Boolean(errors.title)} {...register('title')} />
                {errors.title?.message ? (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                ) : null}
              </div>

              {/* YouTube URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground sm:text-sm">
                  ইউটিউব লিংক <span className="text-destructive">*</span>
                </label>
                <Input aria-invalid={Boolean(errors.youtubeUrl)} {...register('youtubeUrl')} />
                {errors.youtubeUrl?.message ? (
                  <p className="text-xs text-destructive">{errors.youtubeUrl.message}</p>
                ) : null}
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground sm:text-sm">
                  সময়কাল (min:sec) <span className="text-destructive">*</span>
                </label>
                <Input aria-invalid={Boolean(errors.duration)} {...register('duration')} />
                {errors.duration?.message ? (
                  <p className="text-xs text-destructive">{errors.duration.message}</p>
                ) : null}
              </div>

              {/* Client Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground sm:text-sm">
                  ক্লায়েন্টের নাম (ঐচ্ছিক)
                </label>
                <Input {...register('clientName')} />
              </div>

              {/* Client Designation */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground sm:text-sm">
                  পদবী / পেশা (ঐচ্ছিক)
                </label>
                <Input {...register('clientDesignation')} />
              </div>

              {/* Project Name */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground sm:text-sm">
                  প্রকল্পের নাম (ঐচ্ছিক)
                </label>
                <Input {...register('projectName')} />
              </div>

              {/* Thumbnail Replacement */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground sm:text-sm">
                  থাম্বনেইল ছবি (পরিবর্তন করতে চাইলে নির্বাচন করুন)
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="file:mr-4 file:rounded-xl file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
                  />
                  <div className="relative aspect-video w-32 overflow-hidden rounded-xl border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailPreview || podcast.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="size-full object-cover"
                    />
                  </div>
                </div>
                {thumbnailError ? (
                  <p className="text-xs text-destructive">{thumbnailError}</p>
                ) : null}
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center gap-2.5 sm:col-span-2">
                <input
                  type="checkbox"
                  id="edit-podcast-published"
                  checked={isPublishedChecked}
                  onChange={handlePublishedCheckboxChange}
                  className="size-4 rounded border-border text-primary focus:ring-ring"
                />
                <label
                  htmlFor="edit-podcast-published"
                  className="cursor-pointer text-xs font-medium text-foreground sm:text-sm"
                >
                  ওয়েবসাইটে দৃশ্যমান রাখুন (প্রকাশিত)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
                বাতিল
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !uploadReady}
                className="cursor-pointer gap-2 font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>আপডেট হচ্ছে...</span>
                  </>
                ) : (
                  <span>সংরক্ষণ করুন</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Alert Dialog for Limit Reached */}
      {showLimitAlert ? (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex animate-in items-center justify-center p-4 backdrop-blur-sm fade-in-0"
        >
          <button
            type="button"
            aria-label="বন্ধ করুন"
            onClick={() => setShowLimitAlert(false)}
            className="fixed inset-0 bg-background/80"
          />
          <div className="relative z-10 flex w-full max-w-sm animate-in flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 text-center shadow-2xl zoom-in-95">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-bold text-foreground">সর্বোচ্চ সীমা পূর্ণ হয়েছে!</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                সর্বোচ্চ {MAX_PUBLISHED_PODCASTS}টি পডকাস্ট ভিডিও একসাথে ওয়েবসাইটে দৃশ্যমান
                (প্রকাশিত) রাখা সম্ভব। এটি দৃশ্যমান করতে চাইলে প্রথমে পূর্বে প্রকাশিত যেকোনো একটি
                ভিডিও লুকান।
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setShowLimitAlert(false)}
              className="w-full cursor-pointer font-semibold"
            >
              বুঝেছি
            </Button>
          </div>
        </div>
      ) : null}
    </div>,
    document.body
  );
}
