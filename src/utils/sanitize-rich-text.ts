/**
 * Whitelist-based HTML sanitizer for Tiptap rich-text content.
 *
 * Security model:
 * - Only tags in ALLOWED_TAGS survive; everything else is removed.
 * - Only specific attributes per tag are allowed (href on <a>).
 * - Anchor hrefs must start with http:// or https://.
 * - In browser environments, HTML is parsed with DOMParser so the browser's
 *   own tokenizer handles malformed input, nested tags, attribute injection,
 *   etc. This eliminates the CodeQL "incomplete multi-character sanitization"
 *   warning.
 * - In server (Node.js) environments, a strict regex allowlist is used as
 *   DOMParser is unavailable. The output is stored to the database; it is
 *   re-sanitized client-side before being rendered as HTML.
 */

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

/** Serialize a DOM node back to an HTML string using the allowlist. */
function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml(node.textContent ?? '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tag)) {
    // Drop the element but keep its text children to avoid data loss.
    return serializeChildren(el);
  }

  if (tag === 'br') {
    return '<br>';
  }

  if (tag === 'a') {
    const href = el.getAttribute('href') ?? '';
    if (!/^https?:\/\//i.test(href)) {
      return serializeChildren(el);
    }
    const safeHref = escapeHtml(href);
    return `<a href="${safeHref}">${serializeChildren(el)}</a>`;
  }

  return `<${tag}>${serializeChildren(el)}</${tag}>`;
}

function serializeChildren(el: Element): string {
  let result = '';
  for (const child of el.childNodes) {
    result += serializeNode(child);
  }
  return result;
}

/** Browser-side sanitization using DOMParser (eliminates CodeQL warning). */
function sanitizeBrowser(source: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(source, 'text/html');
  return serializeChildren(doc.body);
}

/** Server-side sanitization using a strict regex allowlist. */
function sanitizeServer(source: string): string {
  // Apply all dangerous-content removals together in a fixed-point loop so
  // that nested/interleaved patterns such as <!-<!---->-> or
  // <scr<script>ipt> cannot survive any single replacement pass.
  // CodeQL "incomplete multi-character sanitization" mitigation.
  let withoutDangerousBlocks = source;
  let previous: string;
  do {
    previous = withoutDangerousBlocks;
    withoutDangerousBlocks = withoutDangerousBlocks
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<\s*(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
      .replace(/<\s*(script|style|iframe|object|embed)\b[^>]*\/?>/gi, '');
  } while (withoutDangerousBlocks !== previous);

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

export function sanitizeRichText(value: string): string {
  // If no HTML tags present, treat as plain text and wrap in paragraphs.
  const source = value.includes('<') ? value : plainTextToHtml(value);

  // Use DOMParser in browser environments (eliminates CodeQL false positive).
  // Fall back to the regex allowlist on the server (Node.js).
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    return sanitizeBrowser(source);
  }

  return sanitizeServer(source);
}
