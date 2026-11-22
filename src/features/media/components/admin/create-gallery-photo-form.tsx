'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { addGalleryPhotoAction } from '@/features/media/actions';
import { ADMIN_GALLERY_CATEGORIES } from '@/features/media/constants/gallery';
import {
  createGalleryPhotoFormSchema,
  type TCreateGalleryPhotoFormValues,
} from '@/features/media/schemas/gallery-photo-schema';
import type { TGalleryPhoto } from '@/features/media/types/gallery-photo';
import { uploadGalleryPhotoToCloudinary } from '@/features/media/utils/upload-gallery-photo';
import { canUploadProjectImages, isProjectImageFile } from '@/utils/project-image-url';

type TCreateGalleryPhotoFormProps = {
  onPhotoAdded: (photo: TGalleryPhoto) => void;
};

const DEFAULT_VALUES: TCreateGalleryPhotoFormValues = {
  title: '',
  dateTaken: '',
  category: 'PROJECT_VISIT',
};

export function CreateGalleryPhotoForm({ onPhotoAdded }: Readonly<TCreateGalleryPhotoFormProps>) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TCreateGalleryPhotoFormValues>({
    resolver: zodResolver(createGalleryPhotoFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const uploadReady = canUploadProjectImages();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      return;
    }

    if (!isProjectImageFile(file)) {
      setFileError('JPEG, PNG অথবা WebP ফরম্যাটের ৫ MB-র নিচের ছবি নির্বাচন করুন।');
      setPhotoFile(null);
      return;
    }

    setFileError(null);
    setPhotoFile(file);
  }

  async function onSubmit(values: TCreateGalleryPhotoFormValues) {
    setServerError(null);

    if (!photoFile) {
      setFileError('ছবি নির্বাচন করুন।');
      return;
    }

    try {
      // 1. Upload to Cloudinary
      const uploadedImageUrl = await uploadGalleryPhotoToCloudinary(photoFile);

      // 2. Call server action to store in DB
      const result = await addGalleryPhotoAction({
        title: values.title,
        dateTaken: values.dateTaken,
        category: values.category,
        imageUrl: uploadedImageUrl,
      });

      if (!result.ok) {
        setServerError(result.message);
        if (result.fieldErrors) {
          for (const [key, msg] of Object.entries(result.fieldErrors)) {
            if (msg) {
              setError(key as keyof TCreateGalleryPhotoFormValues, { message: msg });
            }
          }
        }
        return;
      }

      onPhotoAdded({
        id: crypto.randomUUID(),
        title: values.title,
        dateTaken: values.dateTaken,
        category: values.category,
        imageUrl: uploadedImageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Reset form
      reset(DEFAULT_VALUES);
      setPhotoFile(null);
      setFileError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ছবি আপলোড করতে ব্যর্থ হয়েছে।';
      setServerError(message);
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">নতুন ছবি যুক্ত করুন</h2>
        <p className="text-sm text-muted-foreground">
          গ্যালারির জন্য ছবি আপলোড করুন ও সঠিক ক্যাটাগরি নির্বাচন করুন।
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        {/* Photo Title / Caption */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="photo-title" className="text-sm font-medium text-foreground">
            ছবির বিবরণ বা শিরোনাম <span className="text-destructive">*</span>
          </label>
          <Input
            id="photo-title"
            maxLength={200}
            placeholder="যেমন: নজরুল সিটির গ্রাহকদের সাথে দলিল হস্তান্তর মুহূর্ত"
            disabled={isSubmitting}
            className="h-11 text-base md:text-sm"
            aria-invalid={errors.title ? true : undefined}
            {...register('title')}
          />
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">সর্বোচ্চ ২০০ অক্ষর।</p>
          )}
        </div>

        {/* Date Taken (Bengali formatted) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="photo-date" className="text-sm font-medium text-foreground">
            ছবির তারিখ <span className="text-destructive">*</span>
          </label>
          <Input
            id="photo-date"
            maxLength={50}
            placeholder="যেমন: ১৭ জুন ২০২৬"
            disabled={isSubmitting}
            className="h-11 text-base md:text-sm"
            aria-invalid={errors.dateTaken ? true : undefined}
            {...register('dateTaken')}
          />
          {errors.dateTaken ? (
            <p className="text-xs text-destructive">{errors.dateTaken.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              বাংলায় তারিখ লিখুন (যেমন: ১৭ জুন ২০২৬)।
            </p>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="photo-category" className="text-sm font-medium text-foreground">
            ক্যাটাগরি <span className="text-destructive">*</span>
          </label>
          <NativeSelect
            id="photo-category"
            disabled={isSubmitting}
            className="h-11 text-base md:text-sm"
            aria-invalid={errors.category ? true : undefined}
            {...register('category')}
          >
            {ADMIN_GALLERY_CATEGORIES.map((cat) => (
              <NativeSelectOption key={cat.value} value={cat.value}>
                {cat.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.category ? (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          ) : null}
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="photo-file" className="text-sm font-medium text-foreground">
            ছবি ফাইল <span className="text-destructive">*</span>
          </label>
          <input
            ref={fileInputRef}
            id="photo-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isSubmitting || !uploadReady}
            onChange={handleFileChange}
            className="text-sm file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:font-semibold file:text-secondary-foreground"
          />
          {fileError ? (
            <p className="text-xs text-destructive">{fileError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              JPEG, PNG অথবা WebP ফরম্যাটের ছবি (সর্বোচ্চ ৫ MB)।
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
          disabled={isSubmitting || !uploadReady}
          className="min-h-11 w-full self-start font-semibold sm:w-auto"
        >
          {isSubmitting ? 'আপলোড হচ্ছে…' : 'ছবি যুক্ত করুন'}
        </Button>
      </form>
    </div>
  );
}
