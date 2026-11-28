import { env } from '@/config/env';

/**
 * Uploads a podcast thumbnail directly to Cloudinary using an unsigned upload preset.
 * Stores files under the 'nazrul-city/podcasts' folder.
 */
export async function uploadPodcastThumbnailToCloudinary(file: File): Promise<string> {
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are missing.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'nazrul-city/podcasts');

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorBody}`);
  }

  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error('Cloudinary response did not include secure_url.');
  }

  return data.secure_url;
}
