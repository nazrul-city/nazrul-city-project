'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, ExternalLink, Eye, Pencil, Timer, Trash2 } from 'lucide-react';
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
import { deleteFacebookReelAction } from '@/features/media/actions';
import type { TFacebookReel } from '@/features/media/types/facebook-reel';

type TReelAdminRowProps = {
  reel: TFacebookReel;
  index: number;
  total: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (reel: TFacebookReel) => void;
};

export function ReelAdminRow({
  reel,
  index,
  total,
  onMove,
  onDelete,
  onEdit,
}: Readonly<TReelAdminRowProps>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  async function handleDelete() {
    setIsDeleting(true);
    setErrorMessage(null);

    const result = await deleteFacebookReelAction(reel.id);
    if (!result.ok) {
      setErrorMessage(result.message);
      setIsDeleting(false);
      return;
    }

    onDelete(reel.id);
  }

  function handleMoveUp() {
    onMove(index, index - 1);
  }

  function handleMoveDown() {
    onMove(index, index + 1);
  }

  function handleEditClick() {
    onEdit(reel);
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex items-center gap-3">
        {/* Priority Badge */}
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-foreground">
          #{index + 1}
        </span>

        {/* Thumbnail Preview */}
        <div className="relative aspect-[9/16] w-14 shrink-0 overflow-hidden rounded-lg border border-border/80 sm:w-16">
          <Image
            src={reel.thumbnailUrl}
            alt="Reel thumbnail"
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 overflow-hidden">
          {reel.caption ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="h-3 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                {reel.caption}
              </p>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              <Eye className="size-3" aria-hidden="true" />
              {reel.views}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
              <Timer className="size-3 text-muted-foreground" aria-hidden="true" />
              {reel.duration}
            </span>
          </div>

          <a
            href={reel.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-[200px] items-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground sm:max-w-xs"
          >
            <span className="truncate">{reel.videoUrl}</span>
            <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
          </a>

          {errorMessage ? <p className="text-xs text-destructive">{errorMessage}</p> : null}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-end gap-1.5 pt-2 sm:pt-0">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={isFirst}
          onClick={handleMoveUp}
          aria-label="উপরে নিন"
          title="উপরে নিন"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={isLast}
          onClick={handleMoveDown}
          aria-label="নিচে নিন"
          title="নিচে নিন"
        >
          <ArrowDown className="size-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={handleEditClick}
          aria-label="সম্পাদনা করুন"
          title="সম্পাদনা করুন"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </Button>

        {/* Delete Dialog */}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                disabled={isDeleting}
                aria-label="মুছুন"
                title="মুছুন"
              />
            }
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>এই রিলসটি মুছতে চান?</AlertDialogTitle>
              <AlertDialogDescription>
                এটি মুছে ফেললে স্থায়ীভাবে ডাটাবেস এবং ক্লাউডিনারি থেকে থাম্বনেইল মুছে যাবে।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>বাতিল</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'মুছছে…' : 'মুছে ফেলুন'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
