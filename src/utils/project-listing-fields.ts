import { z } from 'zod';

const MAX_FACILITIES = 25;
const MAX_FACILITY_LENGTH = 120;
const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'] as const;
const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export const facilityListSchema = z
  .array(z.string())
  .max(MAX_FACILITIES, { error: 'Add no more than 20 facilities.' })
  .refine((items) => items.every((item) => item.trim().length <= MAX_FACILITY_LENGTH), {
    error: 'Each facility must be 120 characters or fewer.',
  })
  .transform((items) => items.map((item) => item.trim()).filter((item) => item.length > 0));

export const optionalYoutubeUrlSchema = z
  .string()
  .trim()
  .max(2000, { error: 'Use 2000 characters or fewer.' })
  .refine(
    (value) => {
      if (value.length === 0) {
        return true;
      }

      try {
        const url = new URL(value);
        return url.protocol === 'https:' && YOUTUBE_HOSTS.some((host) => host === url.hostname);
      } catch {
        return false;
      }
    },
    { error: 'Enter a YouTube link.' }
  );

export function readYoutubeVideoId(value: string): string | null {
  if (value.length === 0) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== 'https:' || !YOUTUBE_HOSTS.some((host) => host === url.hostname)) {
      return null;
    }

    if (url.hostname === 'youtu.be') {
      const shortId = url.pathname.split('/').find((part) => part.length > 0) ?? '';
      return YOUTUBE_VIDEO_ID.test(shortId) ? shortId : null;
    }

    const watchId = url.searchParams.get('v');

    if (watchId && YOUTUBE_VIDEO_ID.test(watchId)) {
      return watchId;
    }

    const parts = url.pathname.split('/').filter((part) => part.length > 0);
    const markerIndex = parts.findIndex((part) => part === 'embed' || part === 'shorts');
    const pathId = markerIndex >= 0 ? parts[markerIndex + 1] : undefined;

    if (pathId && YOUTUBE_VIDEO_ID.test(pathId)) {
      return pathId;
    }

    return null;
  } catch {
    return null;
  }
}
