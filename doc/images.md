# Listing images

Plot and flat photos upload from the browser to Cloudinary. The app stores the URL.

**Field:** [`src/components/shared/project-image-field.tsx`](../src/components/shared/project-image-field.tsx)  
**Rules:** [`src/utils/project-image-url.ts`](../src/utils/project-image-url.ts)

See also: [Listings](./listings.md), [Environment variables](./env.md)

---

## Goals

- The Next.js server never receives the image file.
- A saved URL has to be on this project's Cloudinary cloud.
- Plots and flats share one field, so a limit change is made once.

---

## Upload

The browser posts the file to Cloudinary with an unsigned upload preset. The response must include `secure_url`. That URL is what the form submits.

Both of these must be set or the control stays disabled. The rest of the site still runs.

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

`canUploadProjectImages` is true only when both are present. They are public values. Do not put a Cloudinary API secret in a `NEXT_PUBLIC_` name. This flow does not use one.

---

## Deletion

Deleting an image from Cloudinary requires signed authentication:

- `CLOUDINARY_API_KEY` (server-only)
- `CLOUDINARY_API_SECRET` (server-only)

When an admin clicks **Remove** on an image, a confirmation alert dialog warns that the deletion is permanent. On confirmation, the server action `deleteProjectImageAction` calls the Cloudinary Destroy API (`POST https://api.cloudinary.com/v1_1/<cloud>/image/destroy`) with `invalidate: true` to purge CDN caches.

When an entire Plot or Flat listing is deleted by a Super Admin, all associated images are automatically batch-deleted from Cloudinary via `destroyManyCloudinaryImages`.

---

## Limits

Defined in `src/utils/project-image-url.ts`:

| Rule  | Value                                         |
| ----- | --------------------------------------------- |
| Count | 15 images                                     |
| Types | JPEG, PNG, WebP                               |
| Size  | 5 MB per file                                 |
| URL   | `https://res.cloudinary.com/<cloud name>/...` |

`projectImageListSchema` checks the URL list on the plot form schema and the flat form schema. A URL for a different cloud name fails with "Upload the image again."

The server action writes one image row per URL, with `sortOrder` taken from the array index. Replacing images on edit deletes the old rows and inserts the new list in one transaction.

`next.config.ts` allows `res.cloudinary.com` as a remote image host so `next/image` can render those URLs.

---

## Related files

- [`src/components/shared/project-image-field.tsx`](../src/components/shared/project-image-field.tsx)
- [`src/utils/project-image-url.ts`](../src/utils/project-image-url.ts)
- [`src/features/land-projects/components/plot-form-schema.ts`](../src/features/land-projects/components/plot-form-schema.ts)
- [`src/features/flat-projects/components/flat-form-schema.ts`](../src/features/flat-projects/components/flat-form-schema.ts)
- [`next.config.ts`](../next.config.ts)
