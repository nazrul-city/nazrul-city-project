const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'b', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'a']);

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function plainTextToHtml(value: string): string {
  return value
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`)
    .join('');
}

function readAnchorHref(attributes: string): string | null {
  const hrefMatch = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(attributes);
  const href = hrefMatch?.[1] ?? hrefMatch?.[2] ?? '';

  if (!/^https?:\/\//i.test(href)) {
    return null;
  }

  return href;
}

export function sanitizeRichText(value: string): string {
  const source = value.includes('<') ? value : plainTextToHtml(value);
  const withoutDangerousBlocks = source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed)\b[^>]*\/?\s*>/gi, '');

  return withoutDangerousBlocks.replace(
    /<\/?([a-zA-Z0-9]+)([^>]*)>/g,
    (match, rawTag: string, rawAttributes: string) => {
      const tag = rawTag.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        return '';
      }

      if (match.startsWith('</')) {
        return tag === 'br' ? '' : `</${tag}>`;
      }

      if (tag === 'br') {
        return '<br>';
      }

      if (tag !== 'a') {
        return `<${tag}>`;
      }

      const href = readAnchorHref(rawAttributes);

      if (!href) {
        return '';
      }

      return `<a href="${escapeHtml(href)}">`;
    }
  );
}
