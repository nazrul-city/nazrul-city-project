'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Play, Timer, User, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useMounted } from '@/hooks';
import { cn } from '@/lib/utils';
import { readYoutubeVideoId } from '@/utils/project-listing-fields';
import type { TPodcast } from '../types/podcast';

type TPodcastVideoModalProps = {
  podcast: TPodcast | null;
  onClose: () => void;
};

export function PodcastVideoModal({ podcast, onClose }: Readonly<TPodcastVideoModalProps>) {
  const isMounted = useMounted();

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!podcast) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [podcast, onClose]);

  if (!isMounted || !podcast) {
    return null;
  }

  const videoId = readYoutubeVideoId(podcast.youtubeUrl);
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`
    : podcast.youtubeUrl;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="podcast-modal-title"
      className="fixed inset-0 z-50 flex animate-in items-center justify-center overflow-y-auto p-3 backdrop-blur-sm fade-in-0 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="মোডাল বন্ধ করুন"
        onClick={onClose}
        className="fixed inset-0 bg-background/80"
      />

      {/* Modal Card — 16:9 optimized video dialog */}
      <div className="relative z-10 my-auto flex w-full max-w-4xl animate-in flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl zoom-in-95">
        {/* Header Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border p-3 sm:p-4">
          <div className="flex items-center gap-2.5 overflow-hidden pr-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Play className="size-4 fill-current" aria-hidden="true" />
            </span>
            <div className="flex flex-col overflow-hidden">
              <span
                id="podcast-modal-title"
                className="truncate text-sm font-bold text-foreground sm:text-base"
              >
                {podcast.title}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {podcast.clientName ? (
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <User className="size-3 text-muted-foreground" aria-hidden="true" />
                    {podcast.clientName}
                    {podcast.clientDesignation ? ` (${podcast.clientDesignation})` : ''}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 font-mono">
                  <Timer className="size-3 text-muted-foreground" aria-hidden="true" />
                  {podcast.duration}
                </span>
                {podcast.projectName ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {podcast.projectName}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="size-8 shrink-0 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:size-9"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Video Player Container — 16:9 on-demand YouTube Embed */}
        <div className="relative aspect-video w-full shrink bg-black">
          {videoId ? (
            <iframe
              src={embedUrl}
              title={podcast.title}
              className="size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex size-full items-center justify-center p-4 text-center text-muted-foreground">
              <p>ভিডিওটি লোড করা সম্ভব হচ্ছে না। সরাসরি ইউটিউবে দেখুন।</p>
            </div>
          )}
        </div>

        {/* Footer with External Link */}
        <div className="flex shrink-0 items-center justify-center border-t border-border bg-muted/40 p-3 sm:justify-between sm:px-4">
          <p className="hidden text-xs text-muted-foreground sm:block">
            নজরুল সিটি অফিসিয়াল পডকাস্ট ও গ্রাহক সাক্ষাৎকার
          </p>
          <a
            href={podcast.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }),
              'min-h-10 gap-2 text-xs font-semibold sm:min-h-9'
            )}
          >
            <span>ইউটিউবে দেখুন</span>
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
