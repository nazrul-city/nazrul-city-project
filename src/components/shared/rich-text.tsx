'use client';

import { sanitizeRichText } from '@/utils/sanitize-rich-text';

type TRichTextProps = {
  html: string;
};

export function RichText({ html }: Readonly<TRichTextProps>) {
  const safeHtml = sanitizeRichText(html);

  // After sanitization only allowlisted tags remain, so stripping them with a
  // simple regex to check for text content is safe and works in both browser
  // and SSR (Node.js) environments. DOMParser is not available server-side.
  const plain = safeHtml.replace(/<[^>]+>/g, '').trim();

  if (!plain) {
    return null;
  }

  return (
    <div
      className="rich-text max-w-4xl text-base text-foreground"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
