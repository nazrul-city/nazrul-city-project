# Architecture

Where code lives in the Nazrul City Next.js App Router app.

**Routes:** [`src/app/`](../src/app/)  
**Features:** [`src/features/`](../src/features/)  
**Shared UI:** [`src/components/`](../src/components/)

See also: [Coding patterns](./coding-patterns.md), [root README](../README.md)

---

## Goals

- A route file composes a screen. It does not hold the business rules.
- A change to one product area stays inside that feature.
- Public chrome and admin chrome do not share a layout.

---

## Folders

| Path                    | What belongs there                            |
| ----------------------- | --------------------------------------------- |
| `src/app`               | Routes, layouts, and metadata                 |
| `src/features/<name>`   | UI, server actions, and queries for one area  |
| `src/components/ui`     | Design-system primitives                      |
| `src/components/layout` | Navbar, footer, and other shell pieces        |
| `src/components/shared` | A component used by two or more features      |
| `src/config`            | Site copy and validated environment variables |
| `src/lib`               | Prisma, auth, logging, and error helpers      |
| `src/utils`             | Small pure helpers                            |
| `src/hooks`             | Shared hooks                                  |
| `src/providers`         | App-wide providers, including theme           |
| `src/types`             | Shared TypeScript types                       |

`src/app/(public)/layout.tsx` renders the public navbar and footer. `src/app/admin/(panel)/layout.tsx` renders the admin shell after it loads an active admin. The root layout in `src/app/layout.tsx` only sets the document, fonts, and theme.

---

## Features

A feature that only one area uses stays in `src/features/<name>`. Move a piece to `components/shared`, `hooks`, or `utils` when a second feature needs it.

These features export a public entry from `index.ts`. Pages import that entry:

- `landing-page`
- `about-page`
- `admin-login`
- `admin-shell`

These features have no `index.ts`. Their pages import the file they need, for example `@/features/flat-projects/queries`:

- `land-projects`
- `flat-projects`
- `admin-accounts`

Do not import another feature's private files through a deep path when that feature already has an `index.ts`. Import what the index exports.

---

## Server and client

Pages, layouts, and data reads are Server Components. Add `"use client"` only on the leaf that needs state, effects, or event handlers. A form, a dialog, and the theme toggle are client leaves. The page that renders them can stay on the server.

Pass plain data into a client component. Do not pass functions, class instances, or `Date` objects from a server component.

---

## Shared values

Site name, phones, address, and public nav live in [`src/config/site.ts`](../src/config/site.ts). Colors, type scale, radius, and shadows live in [`src/app/globals.css`](../src/app/globals.css). Change a token there when the whole site should pick it up.

App code reads environment variables from `@/config/env`. See [Environment variables](./env.md).

---

## Related files

- [`src/app/(public)/layout.tsx`](<../src/app/(public)/layout.tsx>)
- [`src/app/admin/(panel)/layout.tsx`](<../src/app/admin/(panel)/layout.tsx>)
- [`src/app/layout.tsx`](../src/app/layout.tsx)
- [`src/config/site.ts`](../src/config/site.ts)
- [`src/app/globals.css`](../src/app/globals.css)
