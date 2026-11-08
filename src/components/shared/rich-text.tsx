'use client';

import { sanitizeRichText } from '@/utils/sanitize-rich-text';

type TRichTextProps = {
  html: string;
};

export function RichText({ html }: Readonly<TRichTextProps>) {
  const safeHtml = sanitizeRichText(html);
  const text = safeHtml.replace(/<[^>]+>/g, '').trim();

  if (!text) {
    return null;
  }

  return (
    <div
      className="rich-text max-w-4xl text-base text-foreground"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
