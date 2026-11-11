# Design tokens

Colors, type, radius, and shadow are defined once. A component uses the Tailwind name. It does not hard-code a color or a heading size.

**Tokens:** [`src/app/globals.css`](../src/app/globals.css)  
**Fonts:** [`src/lib/fonts.ts`](../src/lib/fonts.ts)

See also: [Coding patterns](./coding-patterns.md)

---

## Goals

- Changing the brand color, a heading size, or the radius is a one-line edit.
- Light and dark stay in sync.
- This file names the token to edit. The values stay in CSS.

---

## Colors

Light values live in `:root`. Dark values live in `.dark`. Both blocks define the same names.

`@theme inline` maps those names onto Tailwind. Use the class, not the raw variable, in JSX:

| Token                  | Class examples                       |
| ---------------------- | ------------------------------------ |
| `--primary`            | `bg-primary`, `text-primary`         |
| `--primary-foreground` | `text-primary-foreground`            |
| `--muted-foreground`   | `text-muted-foreground`              |
| `--card`               | `bg-card`                            |
| `--destructive`        | `bg-destructive`, `text-destructive` |

To change the brand color, edit `--primary` in `:root` and again in `.dark`. Do the same for any color token. A component must not add `dark:bg-red-500` or `bg-[#333]` to paper over a missing dark value.

Sidebar and chart tokens exist for those components. Use `bg-sidebar` or `bg-chart-1` there. This guide does not list every one of them.

---

## Headings

`h1` through `h6` take their size from `--heading-1` through `--heading-6` in `:root`. The base layer in `globals.css` applies those variables.

Pick the heading by meaning (`h1`, then `h2`, then `h3`). Do not also put `text-3xl`, `text-5xl`, or `md:text-6xl` on that element. To make every `h1` larger, change `--heading-1`.

---

## Radius and shadow

`--radius` in `:root` drives the scale: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl`.

Shadows are `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, and `shadow-2xl`. Light and dark each set the shadow values.

Do not write `rounded-[10px]` or `shadow-[0_4px_20px_rgba(0,0,0,0.1)]`. If a new elevation is required, add a named shadow in both themes, map it in `@theme`, then use that class.

---

## Fonts

Loaded in [`src/lib/fonts.ts`](../src/lib/fonts.ts) and exposed as CSS variables.

| Role     | Families                      | Class          |
| -------- | ----------------------------- | -------------- |
| Body     | Inter, then Noto Sans Bengali | `font-sans`    |
| Headings | Manrope, then Hind Siliguri   | `font-heading` |

`html` and `body` already use `font-sans`. Headings already use `font-heading`. Change a weight or a family in `fonts.ts`, not with an inline font stack in a component.

---

## Adding a token

Use an existing name when it fits. When it does not:

1. Add the variable in `:root` and in `.dark`.
2. Map it in the `@theme inline` block, for example `--color-brand-soft: var(--brand-soft)`.
3. Use the Tailwind class (`bg-brand-soft`) in components.

Record why the existing tokens were not enough. Do not rename or delete a token that components already use.

---

## Related files

- [`src/app/globals.css`](../src/app/globals.css)
- [`src/lib/fonts.ts`](../src/lib/fonts.ts)
- [`src/lib/utils.ts`](../src/lib/utils.ts)
