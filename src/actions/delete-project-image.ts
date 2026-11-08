'use server';

import { readActiveAdmin } from '@/lib/auth';
import { destroyCloudinaryImage, type TDestroyImageResult } from '@/lib/cloudinary';
import { extractCloudinaryPublicId } from '@/utils/project-image-url';

export async function deleteProjectImageAction(imageUrl: string): Promise<TDestroyImageResult> {
  const admin = await readActiveAdmin();

  if (!admin) {
    return {
      ok: false,
      message: 'You must be signed in as an admin to delete images.',
    };
  }

  const publicId = extractCloudinaryPublicId(imageUrl);

  if (!publicId) {
    return {
      ok: false,
      message: 'That image URL does not belong to this project’s Cloudinary cloud.',
    };
  }

  return destroyCloudinaryImage(publicId);
}
