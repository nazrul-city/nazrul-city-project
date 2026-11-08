# Listings

Plots (land projects) and flats. Both sides share the same publish rule, image field, and description field.

**Plots:** [`src/features/land-projects/`](../src/features/land-projects/)  
**Flats:** [`src/features/flat-projects/`](../src/features/flat-projects/)

See also: [Database](./database.md), [Images](./images.md), [Rich text](./rich-text.md), [Auth](./auth.md)

---

## Goals

- A draft stays off the public site until `published` is true.
- Create and edit are allowed for any active admin.
- Delete is allowed for a super admin only.

---

## Routes

| Path                      | Who       | What                                       |
| ------------------------- | --------- | ------------------------------------------ |
| `/plots`, `/plots/[slug]` | Public    | Published plots                            |
| `/flats`, `/flats/[slug]` | Public    | Published flats                            |
| `/admin/land-projects`    | Signed in | Plot list, create (`/new`), edit (`/[id]`) |
| `/admin/flat-projects`    | Signed in | Flat list, create (`/new`), edit (`/[id]`) |

Public queries filter `published: true`. An unpublished slug returns no public page.

Saving a plot calls `revalidatePath` for `/plots`, the plot slug, and `/admin/land-projects`. Flats do the same for `/flats` and `/admin/flat-projects`.

---

## Who can change a listing

`createPlot` and `updatePlot` call `readActiveAdmin`. Any active admin can save. `deletePlot` also requires `role === 'SUPER_ADMIN'`. Flat actions use the same split.

Deleting the plot or flat row removes its image rows in the database. See [Database](./database.md).

The description is passed through `sanitizeRichText` before it is stored. See [Rich text](./rich-text.md). Image URLs are checked by `projectImageListSchema` on the form schema. See [Images](./images.md).

---

## What a listing stores

The columns are listed in [Database](./database.md). On the product side, both types have a title, unique name, unique slug, district, address, facilities, status (`AVAILABLE`, `RESERVED`, `SOLD`), a featured flag, and optional installment text.

A flat also has property type, construction status, floor count, price per square foot, and a handover date. Those values are strings or enums as the schema defines them. Price fields are not numeric columns.

---

## Contact form

The home contact form validates in the browser and does not write a row. There is no leads pipeline.

---

## Related files

- [`src/features/land-projects/actions.ts`](../src/features/land-projects/actions.ts)
- [`src/features/land-projects/queries.ts`](../src/features/land-projects/queries.ts)
- [`src/features/flat-projects/actions.ts`](../src/features/flat-projects/actions.ts)
- [`src/features/flat-projects/queries.ts`](../src/features/flat-projects/queries.ts)
- [`src/app/(public)/plots/page.tsx`](<../src/app/(public)/plots/page.tsx>)
- [`src/app/(public)/flats/page.tsx`](<../src/app/(public)/flats/page.tsx>)
