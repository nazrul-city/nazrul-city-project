'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deletePodcastAction, togglePodcastVisibilityAction } from '@/features/media/actions';
import { MAX_PUBLISHED_PODCASTS } from '@/features/media/constants/podcasts';
import type { TPodcast } from '@/features/media/types/podcast';
import { useMounted } from '@/hooks';
import { readYoutubeVideoId } from '@/utils/project-listing-fields';

type TPodcastAdminRowProps = {
  podcast: TPodcast;
  index: number;
  total: number;
  publishedCount: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (podcast: TPodcast) => void;
  onVisibilityToggle: (id: string, published: boolean) => void;
};

export function PodcastAdminRow({
  podcast,
  index,
  total,
  publishedCount,
  onMove,
  onDelete,
  onEdit,
  onVisibilityToggle,
}: Readonly<TPodcastAdminRowProps>) {
  const isMounted = useMounted();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const youtubeVideoId = readYoutubeVideoId(podcast.youtubeUrl);
  const safeYoutubeUrl = youtubeVideoId
    ? `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeVideoId)}`
    : null;

  async function handleToggleVisibility() {
    if (!podcast.published && publishedCount >= MAX_PUBLISHED_PODCASTS) {
      setShowLimitAlert(true);
      return;
    }

    setIsToggling(true);
    setErrorMessage(null);

    const nextState = !podcast.published;
    const result = await togglePodcastVisibilityAction(podcast.id, nextState);
    if (!result.ok) {
      setErrorMessage(result.message);
      setIsToggling(false);
      return;
    }

    setIsToggling(false);
    onVisibilityToggle(podcast.id, nextState);
  }

  async function handleDelete() {
    setIsDeleting(true);
    setErrorMessage(null);

    const result = await deletePodcastAction(podcast.id);
    if (!result.ok) {
      setErrorMessage(result.message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      return;
    }

    setShowDeleteConfirm(false);
    onDelete(podcast.id);
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Section: Reorder buttons + Thumbnail + Details */}
        <div className="flex items-start gap-3 overflow-hidden sm:items-center">
          {/* Reorder Buttons */}
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isFirst}
              onClick={() => onMove(index, index - 1)}
              aria-label="উপরে সরান"
              className="size-7 cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
            >
              <ArrowUp className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isLast}
              onClick={() => onMove(index, index + 1)}
              aria-label="নিচে সরান"
              className="size-7 cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
            >
              <ArrowDown className="size-3.5" />
            </Button>
          </div>

          {/* Thumbnail */}
          <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:w-32">
            <Image
              src={podcast.thumbnailUrl}
              alt={podcast.title}
              fill
              sizes="128px"
              className="object-cover"
            />
            <span className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
              {podcast.duration}
            </span>
          </div>

          {/* Details */}
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {podcast.published ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  দৃশ্যমান
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  <EyeOff className="size-3" />
                  লুকানো
                </span>
              )}

              {podcast.clientName ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                  <User className="size-3 text-muted-foreground" />
                  {podcast.clientName}
                </span>
              ) : null}

              {podcast.clientDesignation ? (
                <span className="text-xs text-muted-foreground">· {podcast.clientDesignation}</span>
              ) : null}

              {podcast.projectName ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {podcast.projectName}
                </span>
              ) : null}
            </div>

            <h3 className="truncate text-xs font-bold text-foreground sm:text-sm">
              {podcast.title}
            </h3>

            {safeYoutubeUrl ? (
              <a
                href={safeYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                ইউটিউব ভিডিও <ExternalLink className="size-3" />
              </a>
            ) : null}

            {errorMessage ? <p className="text-xs text-destructive">{errorMessage}</p> : null}
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-border pt-2 sm:border-t-0 sm:pt-0">
          {/* Visibility Quick Toggle */}
          <Button
            type="button"
            variant={podcast.published ? 'outline' : 'secondary'}
            size="sm"
            disabled={isToggling}
            onClick={handleToggleVisibility}
            className="cursor-pointer gap-1.5 text-xs font-semibold"
          >
            {podcast.published ? (
              <>
                <EyeOff className="size-3.5" />
                <span>লুকান</span>
              </>
            ) : (
              <>
                <Eye className="size-3.5" />
                <span>প্রকাশ করুন</span>
              </>
            )}
          </Button>

          {/* Edit Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onEdit(podcast)}
            aria-label="সম্পাদনা করুন"
            className="size-8 cursor-pointer rounded-xl text-muted-foreground hover:text-foreground"
          >
            <Pencil className="size-4" />
          </Button>

          {/* Delete Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isDeleting}
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="মুছে ফেলুন"
            className="size-8 cursor-pointer rounded-xl text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isMounted && showDeleteConfirm
        ? createPortal(
            <div
              role="alertdialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex animate-in items-center justify-center p-4 backdrop-blur-sm fade-in-0"
            >
              <button
                type="button"
                aria-label="বাতিল"
                onClick={() => setShowDeleteConfirm(false)}
                className="fixed inset-0 bg-background/80"
              />
              <div className="relative z-10 flex w-full max-w-sm animate-in flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl zoom-in-95">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-foreground">আপনি কি নিশ্চিত?</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    এই পডকাস্ট ভিডিওটি এবং এর থাম্বনেইল ছবি ক্লাউডিনারি ও ডাটাবেজ থেকে স্থায়ীভাবে
                    মুছে ফেলা হবে।
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="cursor-pointer"
                  >
                    বাতিল
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="cursor-pointer font-semibold"
                  >
                    {isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {/* Alert Dialog when attempting to publish beyond limit */}
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
                    (প্রকাশিত) রাখা সম্ভব। এই ভিডিওটি প্রকাশ করতে চাইলে প্রথমে পূর্বে প্রকাশিত
                    যেকোনো একটি ভিডিও লুকান।
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
