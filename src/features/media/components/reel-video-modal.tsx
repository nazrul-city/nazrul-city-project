'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Eye, Play, Timer, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useMounted } from '@/hooks';
import { cn } from '@/lib/utils';
import type { TFacebookReel } from '../types/facebook-reel';

type TReelVideoModalProps = {
  reel: TFacebookReel | null;
  onClose: () => void;
};

export function ReelVideoModal({ reel, onClose }: Readonly<TReelVideoModalProps>) {
  const isMounted = useMounted();

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!reel) {
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
  }, [reel, onClose]);

  if (!isMounted || !reel) {
    return null;
  }

  const encodedUrl = encodeURIComponent(reel.videoUrl);
  const fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&t=0`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reel-modal-title"
      className="fixed inset-0 z-50 flex animate-in items-center justify-center overflow-y-auto p-3 backdrop-blur-sm fade-in-0 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 bg-background/80"
      />

      {/* Modal Card — perfectly centered HR & VR with guaranteed top/bottom spacing */}
      <div className="relative z-10 my-auto flex w-full max-w-[min(92vw,380px,calc((86dvh-120px)*9/16))] animate-in flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl zoom-in-95">
        {/* Header Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border p-3 sm:p-3.5">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Play className="size-3.5 fill-current" aria-hidden="true" />
            </span>
            <div className="flex flex-col overflow-hidden">
              {reel.caption ? (
                <span
                  id="reel-modal-title"
                  className="truncate text-xs font-semibold text-foreground sm:text-sm"
                >
                  {reel.caption}
                </span>
              ) : null}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <Eye className="size-3 text-muted-foreground" aria-hidden="true" />
                  {reel.views}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono">
                  <Timer className="size-3 text-muted-foreground" aria-hidden="true" />
                  {reel.duration}
                </span>
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

        {/* Video Player Container */}
        <div className="relative aspect-9/16 w-full shrink bg-black">
          <iframe
            src={fbEmbedUrl}
            title={reel.caption || 'Facebook Reel Video'}
            className="size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer with External Link */}
        <div className="shrink-0 border-t border-border bg-muted/40 p-2.5 sm:p-3">
          <a
            href={reel.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'default', size: 'default' }),
              'min-h-11 w-full justify-center gap-2 text-sm font-semibold'
            )}
          >
            <span>ফেসবুকে দেখুন</span>
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
