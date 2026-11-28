import 'server-only';

import { prisma } from '@/lib/prisma';
import { MAX_FACEBOOK_REELS } from './constants';
import { GALLERY_PAGE_LIMIT, MEDIA_PREVIEW_PHOTO_COUNT } from './constants/gallery';
import { GALLERY_CATEGORY_VALUES } from './schemas/gallery-photo-schema';
import type { TFacebookReel } from './types/facebook-reel';
import type { TCategoryFilter, TGalleryCategory, TGalleryPhoto } from './types/gallery-photo';
import { MAX_PUBLISHED_PODCASTS } from './constants/podcasts';
import type { TPodcast } from './types/podcast';

export async function getPublicFacebookReels(): Promise<readonly TFacebookReel[]> {
  try {
    return await prisma.facebookReel.findMany({
      orderBy: { priority: 'asc' },
      take: MAX_FACEBOOK_REELS,
    });
  } catch {
    return [];
  }
}

export async function getAllFacebookReels(): Promise<readonly TFacebookReel[]> {
  try {
    return await prisma.facebookReel.findMany({
      orderBy: { priority: 'asc' },
    });
  } catch {
    return [];
  }
}

export async function getGalleryPreviewPhotos(): Promise<readonly TGalleryPhoto[]> {
  try {
    return await prisma.galleryPhoto.findMany({
      orderBy: { createdAt: 'desc' },
      take: MEDIA_PREVIEW_PHOTO_COUNT,
    });
  } catch {
    return [];
  }
}

export type TPaginatedGalleryResult = {
  photos: readonly TGalleryPhoto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  category: TCategoryFilter;
};

export async function getPaginatedGalleryPhotos(options?: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<TPaginatedGalleryResult> {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.max(1, options?.limit ?? GALLERY_PAGE_LIMIT);
  const rawCategory = options?.category?.toUpperCase();
  const isValidCategory =
    rawCategory &&
    rawCategory !== 'ALL' &&
    GALLERY_CATEGORY_VALUES.includes(rawCategory as (typeof GALLERY_CATEGORY_VALUES)[number]);

  const category: TCategoryFilter = isValidCategory ? (rawCategory as TGalleryCategory) : 'ALL';

  const whereClause = category === 'ALL' ? {} : { category };

  try {
    const [totalCount, photos] = await Promise.all([
      prisma.galleryPhoto.count({ where: whereClause }),
      prisma.galleryPhoto.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return {
      photos,
      totalCount,
      totalPages,
      currentPage: page,
      category,
    };
  } catch {
    return {
      photos: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: page,
      category,
    };
  }
}

export async function getAllAdminGalleryPhotos(): Promise<readonly TGalleryPhoto[]> {
  try {
    return await prisma.galleryPhoto.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getPublicPodcasts(): Promise<readonly TPodcast[]> {
  try {
    return await prisma.podcast.findMany({
      where: { published: true },
      orderBy: { orderPos: 'asc' },
      take: MAX_PUBLISHED_PODCASTS,
    });
  } catch {
    return [];
  }
}

export async function getAllAdminPodcasts(): Promise<readonly TPodcast[]> {
  try {
    return await prisma.podcast.findMany({
      orderBy: { orderPos: 'asc' },
    });
  } catch {
    return [];
  }
}

export async function getPublishedPodcastCount(): Promise<number> {
  try {
    return await prisma.podcast.count({
      where: { published: true },
    });
  } catch {
    return 0;
  }
}
