# Rich text

Listing descriptions are HTML. The same sanitizer runs on save and on the public page.

**Editor:** [`src/components/shared/rich-text-editor.tsx`](../src/components/shared/rich-text-editor.tsx)  
**Sanitizer:** [`src/utils/sanitize-rich-text.ts`](../src/utils/sanitize-rich-text.ts)  
**Public render:** [`src/components/shared/rich-text.tsx`](../src/components/shared/rich-text.tsx)

See also: [Listings](./listings.md)

---

## Goals

- Staff can write a short formatted description.
- Stored HTML cannot carry a script, a style block, or an unexpected attribute.
- Plain text that was saved before the editor still renders as paragraphs.

---

## Editor

The field is a TipTap editor with `StarterKit` and the link extension. The toolbar offers bold, italic, heading 2, heading 3, lists, and a link. Plot and flat forms both use this component.

The editor can produce tags the allowlist does not keep. Those tags are removed on save. Change the allowlist and the toolbar together when a new mark should survive.

---

## Sanitizer

`sanitizeRichText` in `src/utils/sanitize-rich-text.ts` is the allowlist.

Allowed tags: `p`, `br`, `strong`, `b`, `em`, `ul`, `ol`, `li`, `h2`, `h3`, `a`.

Other tags are dropped. Comments are dropped. `script`, `style`, `iframe`, `object`, and `embed` blocks are removed, including their contents.

An anchor keeps `href` only when the value starts with `http://` or `https://`. Any other attribute on any tag is removed. The kept href is escaped.

Text with no `<` is split on blank lines and wrapped in `<p>`. A single newline inside a paragraph becomes `<br>`.

---

## Where it runs

The plot and flat save actions set `description` to `sanitizeRichText(values.description)` before Prisma writes the row.

The public detail page renders [`RichText`](../src/components/shared/rich-text.tsx). That component sanitizes again, then sets the HTML with `dangerouslySetInnerHTML`. If the sanitized text is empty, it renders nothing.

Sanitize on the way in and on the way out. A row edited outside the form still has to pass the allowlist before it is shown.

---

## Related files

- [`src/components/shared/rich-text-editor.tsx`](../src/components/shared/rich-text-editor.tsx)
- [`src/components/shared/rich-text.tsx`](../src/components/shared/rich-text.tsx)
- [`src/utils/sanitize-rich-text.ts`](../src/utils/sanitize-rich-text.ts)
- [`src/features/land-projects/actions.ts`](../src/features/land-projects/actions.ts)
- [`src/features/flat-projects/actions.ts`](../src/features/flat-projects/actions.ts)
