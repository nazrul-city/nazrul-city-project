# Coding patterns

How to add a feature in this repo. Placement of folders is in [Architecture](./architecture.md). The long rule list for coding agents is in [AGENTS.md](../AGENTS.md).

**Example action:** [`src/features/land-projects/actions.ts`](../src/features/land-projects/actions.ts)

See also: [Architecture](./architecture.md), [Environment variables](./env.md)

---

## Goals

- A new screen follows the same shape as plots and flats.
- Validation runs on the server even when the form already checked the input.
- Shared design values stay in one place.

---

## A feature change

1. Put the route in `src/app`. Keep the page thin.
2. Put the UI, the Zod schema, the server action, and the query in `src/features/<name>`.
3. Reach for `src/components/shared` only when a second feature needs the same piece.

Server Components are the default. `"use client"` goes on the leaf that has state or events, such as a form.

---

## Mutations

A write is a server action in the feature (`'use server'` at the top of `actions.ts`). The action checks the caller, parses the input with Zod, then talks to Prisma. The return type is a small result object, for example `{ ok: true }` or `{ ok: false, fieldErrors }`.

Forms use React Hook Form and the same schema through `@hookform/resolvers`. The plot form and the flat form are the pattern.

This is the shape of `createPlot`. The file also writes image rows in the same transaction and maps a unique-constraint error onto the name or slug field.

```ts
const actor = await requireActiveAdmin();

if (!actor.ok) {
  return { ok: false, message: SAVE_DENIED };
}

const parsed = plotFormSchema.safeParse(values);

if (!parsed.success) {
  return { ok: false, fieldErrors: readPlotFieldErrors(parsed.error) };
}

await prisma.$transaction(async (tx) => {
  await tx.plot.create({ data: plotData(parsed.data) });
});

return { ok: true };
```

Copy that order for a new action: authorize, parse, write, return a typed result. Do not trust the client payload.

---

## Types and imports

- Types use the `T` prefix: `TPlotFormValues`, `TLoginResult`.
- Component props are `Readonly<T{Name}Props>`.
- Imports from inside `src/` use the `@/` alias.
- A type-only import uses `import type`.

---

## Environment and styling

Read configuration through `import { env } from '@/config/env'`. Do not read `process.env` in app code. The exception is [`prisma.config.ts`](../prisma.config.ts), which runs outside Next.js. See [Environment variables](./env.md).

Class names go through `cn` from [`src/lib/utils.ts`](../src/lib/utils.ts). Colors, type, radius, and shadow come from the tokens in [`src/app/globals.css`](../src/app/globals.css). Which name to edit, and which class to use, is in [Design tokens](./design-tokens.md).

---

## Related files

- [`src/features/land-projects/actions.ts`](../src/features/land-projects/actions.ts)
- [`src/features/land-projects/components/plot-form-schema.ts`](../src/features/land-projects/components/plot-form-schema.ts)
- [`src/lib/utils.ts`](../src/lib/utils.ts)
- [`AGENTS.md`](../AGENTS.md)
