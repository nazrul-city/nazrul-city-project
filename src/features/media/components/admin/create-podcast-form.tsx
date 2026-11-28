'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ImagePlus, Loader2 } from 'lucide-react';
import { useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPodcastAction } from '@/features/media/actions';
import { MAX_PUBLISHED_PODCASTS } from '@/features/media/constants/podcasts';
import {
  podcastFormSchema,
  type TPodcastFormValues,
} from '@/features/media/schemas/podcast-schema';
import type { TPodcast } from '@/features/media/types/podcast';
import { uploadPodcastThumbnailToCloudinary } from '@/features/media/utils/upload-podcast-thumbnail';
import { useMounted } from '@/hooks';
import { cn } from '@/lib/utils';
import { canUploadProjectImages, isProjectImageFile } from '@/utils/project-image-url';

function getSafeThumbnailSrc(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);

    if (parsed.protocol === 'https:') {
      return `https://${parsed.host}${parsed.pathname}${parsed.search}`;
    }

    if (parsed.protocol === 'blob:' && parsed.origin !== 'null') {
      return `blob:${parsed.origin}${parsed.pathname}`;
    }

    return null;
  } catch {
    return null;
  }
}

type TPodcastFormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  registration: UseFormRegisterReturn;
};

function PodcastFormField({
  id,
  label,
  required = false,
  placeholder,
  error,
  className,
  registration,
}: Readonly<TPodcastFormFieldProps>) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-xs font-semibold text-foreground sm:text-sm">
        {label}
        {required ? (
          <>
            {' '}
            <span className="text-destructive">*</span>
          </>
        ) : null}
      </label>
      <Input id={id} placeholder={placeholder} aria-invalid={Boolean(error)} {...registration} />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

type TCreatePodcastFormProps = {
  publishedCount: number;
  onPodcastAdded: (podcast: TPodcast) => void;
};

const DEFAULT_VALUES: TPodcastFormValues = {
  title: '',
  youtubeUrl: '',
  duration: '',
  published: true,
  clientName: '',
  clientDesignation: '',
  projectName: '',
};

export function CreatePodcastForm({
  publishedCount,
  onPodcastAdded,
}: Readonly<TCreatePodcastFormProps>) {
  const isMounted = useMounted();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAtPublishedLimit = publishedCount >= MAX_PUBLISHED_PODCASTS;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TPodcastFormValues>({
    resolver: zodResolver(podcastFormSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      published: !isAtPublishedLimit,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const isPublishedChecked = useWatch({
    control,
    name: 'published',
    defaultValue: !isAtPublishedLimit,
  });
  const uploadReady = canUploadProjectImages();
  const safeThumbnailPreview = thumbnailPreview ? getSafeThumbnailSrc(thumbnailPreview) : null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }

    if (!isProjectImageFile(file)) {
      setThumbnailError('শুধুমাত্র ছবি ফাইল (JPEG, PNG, WebP) নির্বাচন করুন (সর্বোচ্চ 10MB)।');
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
    if (!thumbnailFile) {
      setThumbnailError('থাম্বনেইল ছবি নির্বাচন করুন।');
      return;
    }

    if (data.published && isAtPublishedLimit) {
      setShowLimitAlert(true);
      return;
    }

    setServerError(null);
    setThumbnailError(null);

    try {
      const uploadedUrl = await uploadPodcastThumbnailToCloudinary(thumbnailFile);

      const result = await createPodcastAction({
        title: data.title,
        youtubeUrl: data.youtubeUrl,
        duration: data.duration,
        published: data.published,
        clientName: data.clientName ?? '',
        clientDesignation: data.clientDesignation ?? '',
        projectName: data.projectName ?? '',
        thumbnailUrl: uploadedUrl,
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

      reset({
        ...DEFAULT_VALUES,
        published: publishedCount + (data.published ? 1 : 0) < MAX_PUBLISHED_PODCASTS,
      });
      setThumbnailFile(null);
      setThumbnailPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onPodcastAdded({
        id: crypto.randomUUID(),
        title: data.title,
        youtubeUrl: data.youtubeUrl,
        thumbnailUrl: uploadedUrl,
        duration: data.duration,
        published: data.published,
        clientName: data.clientName ?? '',
        clientDesignation: data.clientDesignation ?? '',
        projectName: data.projectName ?? '',
        orderPos: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'পডকাস্ট যোগ করার সময় ত্রুটি হয়েছে।';
      setServerError(message);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">
            নতুন পডকাস্ট বা সাক্ষাৎকার যুক্ত করুন
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            ইউটিউব লিংক, থাম্বনেইল ছবি এবং সংশ্লিষ্ট তথ্য পূরণ করুন।
          </p>
        </div>

        {isAtPublishedLimit ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 sm:text-sm dark:text-amber-200">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold">সর্বোচ্চ ১০টি ভিডিও দৃশ্যমান রাখার সীমা পূর্ণ হয়েছে।</p>
              <p className="mt-0.5 text-xs opacity-90">
                নতুন ভিডিওটি লুকানো (ড্রাফট) হিসেবে সংরক্ষিত হবে। এটি প্রকাশ্যে দেখাতে চাইলে আগের
                যেকোনো একটি ভিডিওর দৃশ্যমানতা বন্ধ করুন।
              </p>
            </div>
          </div>
        ) : null}

        {serverError ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive sm:text-sm"
          >
            {serverError}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <PodcastFormField
            id="podcast-title"
            label="শিরোনাম"
            required
            placeholder="যেমন: কেন নজরুল সিটিতে প্লট কিনলাম? — মো: রফিকুল ইসলাম"
            error={errors.title?.message}
            className="sm:col-span-2"
            registration={register('title')}
          />

          <PodcastFormField
            id="podcast-youtube-url"
            label="ইউটিউব লিংক"
            required
            placeholder="https://www.youtube.com/watch?v=..."
            error={errors.youtubeUrl?.message}
            registration={register('youtubeUrl')}
          />

          <PodcastFormField
            id="podcast-duration"
            label="সময়কাল (min:sec)"
            required
            placeholder="যেমন: 12:45 বা 1:10:20"
            error={errors.duration?.message}
            registration={register('duration')}
          />

          <PodcastFormField
            id="podcast-client-name"
            label="ক্লায়েন্ট / অতিথির নাম (ঐচ্ছিক)"
            placeholder="যেমন: প্রকৌশলী মো: রফিকুল ইসলাম"
            registration={register('clientName')}
          />

          <PodcastFormField
            id="podcast-client-role"
            label="পদবী / পেশা (ঐচ্ছিক)"
            placeholder="যেমন: প্রবাসী বিনিয়োগকারী"
            registration={register('clientDesignation')}
          />

          <PodcastFormField
            id="podcast-project-name"
            label="প্রকল্পের নাম (ঐচ্ছিক)"
            placeholder="যেমন: নজরুল সিটি ১"
            className="sm:col-span-2"
            registration={register('projectName')}
          />

          {/* Thumbnail File Upload */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label
              htmlFor="podcast-thumbnail"
              className="text-xs font-semibold text-foreground sm:text-sm"
            >
              ভিডিও থাম্বনেইল ছবি (16:9 অনুপাত) <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                id="podcast-thumbnail"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="file:mr-4 file:rounded-xl file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
              />
              {safeThumbnailPreview ? (
                <div className="relative aspect-video w-36 overflow-hidden rounded-xl border border-border bg-muted">
                  <Image
                    src={safeThumbnailPreview}
                    alt="Preview"
                    fill
                    unoptimized
                    sizes="144px"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
            {thumbnailError ? <p className="text-xs text-destructive">{thumbnailError}</p> : null}
            {!uploadReady ? (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ক্লাউডিনারি ক্রেডেনশিয়াল প্রস্তুত নয়।
              </p>
            ) : null}
          </div>

          {/* Visibility Checkbox */}
          <div className="flex items-center gap-2.5 sm:col-span-2">
            <input
              type="checkbox"
              id="podcast-published"
              checked={isPublishedChecked}
              onChange={handlePublishedCheckboxChange}
              className="size-4 rounded border-border text-primary focus:ring-ring"
            />
            <label
              htmlFor="podcast-published"
              className="cursor-pointer text-xs font-medium text-foreground sm:text-sm"
            >
              ওয়েবসাইটে দৃশ্যমান রাখুন (প্রকাশিত)
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !uploadReady}
            className="min-h-11 cursor-pointer gap-2 px-6 font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>সংরক্ষণ করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                <span>পডকাস্ট যুক্ত করুন</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Alert Modal for Limit Reached */}
      {isMounted && showLimitAlert
        ? createPortal(
            <div
              role="alertdialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex animate-in items-center justify-center p-4 backdrop-blur-sm fade-in-0"
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
                  <h3 className="text-base font-bold text-foreground">
                    সর্বোচ্চ সীমা পূর্ণ হয়েছে!
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    সর্বোচ্চ {MAX_PUBLISHED_PODCASTS}টি পডকাস্ট ভিডিও একসাথে ওয়েবসাইটে দৃশ্যমান
                    (প্রকাশিত) রাখা সম্ভব। নতুন কোনো ভিডিও দৃশ্যমান করতে চাইলে প্রথমে আগের যেকোনো
                    একটি ভিডিওর দৃশ্যমানতা বন্ধ করুন।
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
            </div>,
            document.body
          )
        : null}
    </>
  );
}
