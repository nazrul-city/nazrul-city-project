import 'server-only';
import { createHash } from 'node:crypto';
import { logger } from '@/lib/logger';
import { env } from '@/config/env';

export type TDestroyImageResult = {
  ok: boolean;
  message?: string;
};

/**
 * Cloudinary public IDs may contain letters, digits, underscores, hyphens,
 * dots and forward slashes (for folder paths). Reject anything else to prevent
 * parameter injection into the signature string.
 */
const CLOUDINARY_PUBLIC_ID_PATTERN = /^[a-zA-Z0-9_\-./]+$/;

function isValidPublicId(publicId: string): boolean {
  return (
    publicId.length > 0 && publicId.length <= 512 && CLOUDINARY_PUBLIC_ID_PATTERN.test(publicId)
  );
}

/**
 * Permanently deletes an image from Cloudinary CDN and invalidates edge caches.
 * Requires CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET on the server.
 */
export async function destroyCloudinaryImage(publicId: string): Promise<TDestroyImageResult> {
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    logger.warn('cloudinary credentials are not configured; image deletion skipped');
    return {
      ok: false,
      message: 'Cloudinary credentials are not configured on the server.',
    };
  }

  // Validate publicId before embedding it in the signature string to prevent
  // parameter injection attacks.
  if (!isValidPublicId(publicId)) {
    logger.warn('cloudinary destroy called with invalid public_id; request rejected');
    return {
      ok: false,
      message: 'Invalid image identifier.',
    };
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  // Cloudinary signatures require parameters in alphabetical order.
  const paramString = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = createHash('sha256').update(`${paramString}${apiSecret}`).digest('hex');

  const formData = new URLSearchParams({
    public_id: publicId,
    timestamp,
    api_key: apiKey,
    signature,
    invalidate: 'true',
  });

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`cloudinary destroy error: HTTP ${response.status.toString()}`);

      let errorMessage = 'Could not delete the image from Cloudinary.';
      try {
        const errorJson: unknown = JSON.parse(errorText);
        if (
          typeof errorJson === 'object' &&
          errorJson !== null &&
          'error' in errorJson &&
          typeof errorJson.error === 'object' &&
          errorJson.error !== null &&
          'message' in errorJson.error &&
          typeof errorJson.error.message === 'string'
        ) {
          errorMessage = errorJson.error.message;
        }
      } catch {
        // Use default fallback if not valid JSON.
      }

      return { ok: false, message: errorMessage };
    }

    const data: unknown = await response.json();
    const result = typeof data === 'object' && data !== null && 'result' in data ? data.result : '';

    if (result === 'ok' || result === 'not found') {
      logger.info(`cloudinary image deleted (${String(result)})`);
      return { ok: true };
    }

    logger.warn('cloudinary destroy returned unexpected result');
    return { ok: false, message: 'Cloudinary could not delete the image.' };
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      logger.error('cloudinary destroy request timed out after 8 seconds');
      return {
        ok: false,
        message: 'Cloudinary request timed out. Please check your network connection.',
      };
    }

    const message = error instanceof Error ? error.message : 'Unknown network error';
    logger.error(`cloudinary destroy request failed: ${message}`);
    return { ok: false, message: 'Network error deleting image from Cloudinary.' };
  }
}

/**
 * Batch-deletes multiple images from Cloudinary CDN.
 * Errors on individual images are caught and logged so one failure does not halt the batch.
 */
export async function destroyManyCloudinaryImages(publicIds: readonly string[]): Promise<void> {
  if (publicIds.length === 0) {
    return;
  }

  await Promise.allSettled(publicIds.map((publicId) => destroyCloudinaryImage(publicId)));
}
