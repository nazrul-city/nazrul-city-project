'use client';

import { MessageCircleIcon, PhoneIcon, Share2Icon } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buildWhatsAppHref } from '@/utils/whatsapp-href';

type TProjectCtaBarActionsProps = {
  name: string;
  phone: string;
  whatsapp: string;
};

const ACTION_CLASS_NAME =
  'h-auto min-h-10 w-full flex-col gap-1 px-2 pt-1 text-xs md:min-h-11 md:flex-row md:gap-1.5 md:pt-0 md:text-base';

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function ProjectCtaBarActions({
  name,
  phone,
  whatsapp,
}: Readonly<TProjectCtaBarActionsProps>) {
  const [isCopied, setIsCopied] = useState(false);
  const callHref = `tel:${phone}`;
  const whatsappHref = buildWhatsAppHref(whatsapp);

  function handleWhatsAppClick(event: MouseEvent<HTMLAnchorElement>) {
    const message = `আসসালামু আলাইকুম। আমি নাজরুল সিটির ওয়েবসাইট থেকে ${name} প্রকল্পটি দেখছি। এই প্রকল্প সম্পর্কে জানতে চাই।\n${window.location.href}`;
    event.currentTarget.href = buildWhatsAppHref(whatsapp, message);
  }

  async function handleShare() {
    const pageUrl = window.location.href;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ text: pageUrl });
        return;
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(pageUrl);
      setIsCopied(true);
    } catch (error) {
      console.error('The project link could not be copied.', error);
    }
  }

  return (
    <section
      aria-label="প্রকল্পের যোগাযোগ"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 py-2 md:static md:z-auto md:border-0 md:bg-transparent md:px-0 md:py-0"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2">
        <button
          type="button"
          className={buttonVariants({
            variant: 'outline',
            className: cn(ACTION_CLASS_NAME, 'bg-muted'),
          })}
          onClick={handleShare}
        >
          <Share2Icon aria-hidden="true" className="size-4 md:size-5" />
          {isCopied ? 'কপি হয়েছে' : 'শেয়ার'}
        </button>
        <a
          href={callHref}
          className={buttonVariants({ variant: 'default', className: ACTION_CLASS_NAME })}
        >
          <PhoneIcon aria-hidden="true" className="size-4 md:size-5" />
          কল
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'secondary', className: ACTION_CLASS_NAME })}
          onClick={handleWhatsAppClick}
        >
          <MessageCircleIcon aria-hidden="true" className="size-4 md:size-5" />
          হোয়াটসঅ্যাপ
        </a>
      </div>
    </section>
  );
}
