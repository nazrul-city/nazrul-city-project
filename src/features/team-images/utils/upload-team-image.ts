import { z } from 'zod';
import { clientEnv } from '@/config/env/client';
import { isAllowedProjectImageUrl } from '@/utils/project-image-url';

const uploadResponseSchema = z.object({
  secure_url: z.string().url(),
});

export async function uploadTeamImageToCloudinary(file: File): Promise<string> {
  const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = clientEnv.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Image upload is not set up yet.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new Error('The image could not be uploaded.');
  }

  const payload: unknown = await response.json();
  const parsed = uploadResponseSchema.safeParse(payload);

  if (!parsed.success || !isAllowedProjectImageUrl(parsed.data.secure_url)) {
    throw new Error('The image could not be uploaded.');
  }

  return parsed.data.secure_url;
}
