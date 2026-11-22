'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
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
import { deleteGalleryPhotoAction } from '@/features/media/actions';
import { GALLERY_CATEGORIES } from '@/features/media/constants/gallery';
import type { TGalleryPhoto } from '@/features/media/types/gallery-photo';

type TGalleryAdminRowProps = {
  photo: TGalleryPhoto;
  onDelete: (id: string) => void;
};

export function GalleryAdminRow({ photo, onDelete }: Readonly<TGalleryAdminRowProps>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoryLabel =
    GALLERY_CATEGORIES.find((c) => c.value === photo.category)?.label ?? photo.category;

  async function handleDelete() {
    setIsDeleting(true);
    setErrorMessage(null);

    const result = await deleteGalleryPhotoAction(photo.id);
    if (!result.ok) {
      setErrorMessage(result.message);
      setIsDeleting(false);
      return;
    }

    onDelete(photo.id);
  }

  const formattedDate =
    photo.dateTaken ||
    new Intl.DateTimeFormat('bn-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(photo.createdAt));

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Thumbnail Preview */}
        <div className="relative aspect-4/3 w-20 shrink-0 overflow-hidden rounded-lg border border-border/80 sm:w-24">
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 overflow-hidden">
          <p className="truncate text-xs font-semibold text-foreground sm:text-sm">{photo.title}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {categoryLabel}
            </span>
            <span>·</span>
            <span>{formattedDate}</span>
          </div>

          {errorMessage ? <p className="text-xs text-destructive">{errorMessage}</p> : null}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                aria-label="ছবি মুছুন"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              />
            }
          >
            <Trash2 className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">মুছুন</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ছবি মুছে ফেলতে চান?</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{photo.title}&quot; ছবিটি স্থায়ীভাবে গ্যালারি ও সার্ভার থেকে মুছে ফেলা হবে।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>বাতিল</AlertDialogCancel>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'মুছে ফেলা হচ্ছে…' : 'নিশ্চিত মুছুন'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
