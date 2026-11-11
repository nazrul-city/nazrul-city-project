import { z } from 'zod';
import { clientEnv } from '@/config/env/client';

export const MAX_PROJECT_IMAGES = 15;
export const MAX_PROJECT_IMAGE_BYTES = 5 * 1024 * 1024;

const PROJECT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export function canUploadProjectImages(): boolean {
  return (
    clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== undefined &&
    clientEnv.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET !== undefined
  );
}

export function isProjectImageFile(file: File): boolean {
  return (
    PROJECT_IMAGE_TYPES.some((type) => type === file.type) && file.size <= MAX_PROJECT_IMAGE_BYTES
  );
}

export function isAllowedProjectImageUrl(value: string): boolean {
  const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return false;
  }

  return value.startsWith(`https://res.cloudinary.com/${cloudName}/`);
}

export const projectImageListSchema = z
  .array(z.string().refine(isAllowedProjectImageUrl, { error: 'Upload the image again.' }))
  .max(MAX_PROJECT_IMAGES, { error: 'Add no more than 15 images.' });

/**
 * Extracts the public_id from a Cloudinary image URL belonging to this project.
 * Handles folders and strips version prefixes (v123456789/) and file extensions.
 */
export function extractCloudinaryPublicId(url: string): string | null {
  const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return null;
  }

  const prefix = `https://res.cloudinary.com/${cloudName}/image/upload/`;

  if (!url.startsWith(prefix)) {
    return null;
  }

  const remainder = url.slice(prefix.length);
  const withoutVersion = remainder.replace(/^v\d+\//, '');
  const lastDotIndex = withoutVersion.lastIndexOf('.');

  if (lastDotIndex <= 0) {
    return withoutVersion || null;
  }

  return withoutVersion.slice(0, lastDotIndex);
}
