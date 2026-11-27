'use server';

import { revalidatePath } from 'next/cache';
import { readActiveAdmin } from '@/lib/auth';
import { destroyCloudinaryImage } from '@/lib/cloudinary';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { extractCloudinaryPublicId } from '@/utils/project-image-url';
import { MAX_FACEBOOK_REELS } from './constants';
import { MAX_PUBLISHED_PODCASTS } from './constants/podcasts';
import {
  addFacebookReelSchema,
  updateFacebookReelSchema,
  type TAddFacebookReelResult,
  type TAddFacebookReelValues,
  type TUpdateFacebookReelResult,
  type TUpdateFacebookReelValues,
} from './schemas/facebook-reel-schema';
import {
  addGalleryPhotoSchema,
  type TAddGalleryPhotoResult,
  type TAddGalleryPhotoValues,
  type TCreateGalleryPhotoFormValues,
  type TDeleteGalleryPhotoResult,
} from './schemas/gallery-photo-schema';
import {
  addPodcastSchema,
  updatePodcastSchema,
  type TAddPodcastValues,
  type TPodcastActionResult,
  type TUpdatePodcastValues,
} from './schemas/podcast-schema';

const DENIED = 'You must be signed in as an admin to manage Facebook reels.';
const DENIED_GALLERY = 'You must be signed in as an admin to manage gallery photos.';
const DENIED_PODCASTS = 'You must be signed in as an admin to manage podcasts.';

function revalidate() {
  revalidatePath('/media');
  revalidatePath('/admin/facebook-reels');
}

function revalidateGallery() {
  revalidatePath('/media');
  revalidatePath('/media/gallery');
  revalidatePath('/admin/gallery');
}

function revalidatePodcasts() {
  revalidatePath('/media');
  revalidatePath('/admin/podcasts');
}

export async function addFacebookReelAction(
  values: TAddFacebookReelValues
): Promise<TAddFacebookReelResult> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED };
    }

    const parsed = addFacebookReelSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof TAddFacebookReelValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TAddFacebookReelValues;
        fieldErrors[field] = issue.message;
      }
      return { ok: false, message: 'তথ্য যাচাইকরণ ব্যর্থ হয়েছে।', fieldErrors };
    }

    const count = await prisma.facebookReel.count();
    if (count >= MAX_FACEBOOK_REELS) {
      return {
        ok: false,
        message: `সর্বোচ্চ ${MAX_FACEBOOK_REELS}টি ফেসবুক রিলস যুক্ত করা যাবে।`,
      };
    }

    await prisma.facebookReel.create({
      data: {
        videoUrl: parsed.data.videoUrl,
        thumbnailUrl: parsed.data.thumbnailUrl,
        views: parsed.data.views,
        duration: parsed.data.duration,
        caption: parsed.data.caption ?? '',
        priority: count,
      },
    });

    logger.info('facebook reel added');
    revalidate();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'রিলস যোগ করতে ব্যর্থ হয়েছে।';
    logger.error(`addFacebookReelAction error: ${message}`);
    return { ok: false, message };
  }
}

export async function updateFacebookReelAction(
  values: TUpdateFacebookReelValues
): Promise<TUpdateFacebookReelResult> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED };
    }

    const parsed = updateFacebookReelSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof TAddFacebookReelValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TAddFacebookReelValues;
        fieldErrors[field] = issue.message;
      }
      return { ok: false, message: 'তথ্য যাচাইকরণ ব্যর্থ হয়েছে।', fieldErrors };
    }

    const existing = await prisma.facebookReel.findUnique({
      where: { id: parsed.data.id },
    });

    if (!existing) {
      return { ok: false, message: 'এই রিলসটি খুঁজে পাওয়া যায়নি।' };
    }

    // If thumbnail was replaced, clean up old image from Cloudinary
    if (existing.thumbnailUrl !== parsed.data.thumbnailUrl) {
      const oldPublicId = extractCloudinaryPublicId(existing.thumbnailUrl);
      if (oldPublicId) {
        await destroyCloudinaryImage(oldPublicId);
      }
    }

    await prisma.facebookReel.update({
      where: { id: parsed.data.id },
      data: {
        videoUrl: parsed.data.videoUrl,
        thumbnailUrl: parsed.data.thumbnailUrl,
        views: parsed.data.views,
        duration: parsed.data.duration,
        caption: parsed.data.caption ?? '',
      },
    });

    logger.info(`facebook reel updated: ${parsed.data.id}`);
    revalidate();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'রিলস আপডেট করতে ব্যর্থ হয়েছে।';
    logger.error(`updateFacebookReelAction error: ${message}`);
    return { ok: false, message };
  }
}

export type TDeleteFacebookReelResult = { ok: true } | { ok: false; message: string };

export async function deleteFacebookReelAction(id: string): Promise<TDeleteFacebookReelResult> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED };
    }

    const reel = await prisma.facebookReel.findUnique({ where: { id } });
    if (!reel) {
      return { ok: false, message: 'এই রিলসটি খুঁজে পাওয়া যায়নি।' };
    }

    await prisma.facebookReel.delete({ where: { id } });

    // Clean up thumbnail from Cloudinary
    const publicId = extractCloudinaryPublicId(reel.thumbnailUrl);
    if (publicId) {
      const result = await destroyCloudinaryImage(publicId);
      if (!result.ok) {
        logger.warn(`Failed to destroy Cloudinary image: ${result.message ?? 'Unknown'}`);
      }
    }

    // Reorder remaining rows so priority stays contiguous (0, 1, 2...)
    const remaining = await prisma.facebookReel.findMany({ orderBy: { priority: 'asc' } });
    await prisma.$transaction(
      remaining.map((item, index) =>
        prisma.facebookReel.update({ where: { id: item.id }, data: { priority: index } })
      )
    );

    logger.info(`facebook reel deleted: ${id}`);
    revalidate();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'রিলস মুছতে ব্যর্থ হয়েছে।';
    logger.error(`deleteFacebookReelAction error: ${message}`);
    return { ok: false, message };
  }
}

export type TReorderFacebookReelsResult = { ok: true } | { ok: false; message: string };

export async function reorderFacebookReelsAction(
  orderedIds: readonly string[]
): Promise<TReorderFacebookReelsResult> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED };
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.facebookReel.update({
          where: { id },
          data: { priority: index },
        })
      )
    );

    logger.info('facebook reels reordered');
    revalidate();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'রিলস সাজাতে ব্যর্থ হয়েছে।';
    logger.error(`reorderFacebookReelsAction error: ${message}`);
    return { ok: false, message };
  }
}

export async function addGalleryPhotoAction(
  values: TAddGalleryPhotoValues
): Promise<TAddGalleryPhotoResult> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED_GALLERY };
    }

    const parsed = addGalleryPhotoSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof TCreateGalleryPhotoFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TCreateGalleryPhotoFormValues;
        fieldErrors[field] = issue.message;
      }
      return { ok: false, message: 'তথ্য যাচাইকরণ ব্যর্থ হয়েছে।', fieldErrors };
    }

    await prisma.galleryPhoto.create({
      data: {
        title: parsed.data.title,
        dateTaken: parsed.data.dateTaken,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl,
      },
    });

    logger.info('gallery photo added');
    revalidateGallery();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'ছবি যোগ করতে ব্যর্থ হয়েছে।';
    logger.error(`addGalleryPhotoAction error: ${message}`);
    return { ok: false, message };
  }
}

export async function deleteGalleryPhotoAction(id: string): Promise<TDeleteGalleryPhotoResult> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED_GALLERY };
    }

    const photo = await prisma.galleryPhoto.findUnique({
      where: { id },
    });

    if (!photo) {
      return { ok: false, message: 'এই ছবিটি খুঁজে পাওয়া যায়নি।' };
    }

    const publicId = extractCloudinaryPublicId(photo.imageUrl);
    if (publicId) {
      try {
        await destroyCloudinaryImage(publicId);
      } catch (cloudErr) {
        logger.warn(`Could not destroy Cloudinary image for photo ${id}: ${cloudErr}`);
      }
    }

    await prisma.galleryPhoto.delete({
      where: { id },
    });

    logger.info(`gallery photo ${id} deleted`);
    revalidateGallery();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'ছবি মুছতে ব্যর্থ হয়েছে।';
    logger.error(`deleteGalleryPhotoAction error: ${message}`);
    return { ok: false, message };
  }
}

// ---------------------------------------------------------------------------
// Podcast Actions
// ---------------------------------------------------------------------------

export async function createPodcastAction(
  values: TAddPodcastValues
): Promise<TPodcastActionResult> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED_PODCASTS };
    }

    const parsed = addPodcastSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof TAddPodcastValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TAddPodcastValues;
        fieldErrors[field] = issue.message;
      }
      return { ok: false, message: 'তথ্য যাচাইকরণ ব্যর্থ হয়েছে।', fieldErrors };
    }

    // Strict Invariant: Max 10 published podcasts
    if (parsed.data.published) {
      const publishedCount = await prisma.podcast.count({ where: { published: true } });
      if (publishedCount >= MAX_PUBLISHED_PODCASTS) {
        return {
          ok: false,
          message:
            'সর্বোচ্চ ১০টি পডকাস্ট ভিডিও একসাথে দৃশ্যমান (প্রকাশিত) রাখা সম্ভব। নতুন কোনো ভিডিও দৃশ্যমান করতে চাইলে প্রথমে আগের যেকোনো একটি ভিডিও লুকান।',
        };
      }
    }

    const lastPodcast = await prisma.podcast.findFirst({
      orderBy: { orderPos: 'desc' },
      select: { orderPos: true },
    });
    const nextOrderPos = lastPodcast ? lastPodcast.orderPos + 1 : 0;

    await prisma.podcast.create({
      data: {
        title: parsed.data.title,
        youtubeUrl: parsed.data.youtubeUrl,
        thumbnailUrl: parsed.data.thumbnailUrl,
        duration: parsed.data.duration,
        published: parsed.data.published,
        clientName: parsed.data.clientName ?? '',
        clientDesignation: parsed.data.clientDesignation ?? '',
        projectName: parsed.data.projectName ?? '',
        orderPos: nextOrderPos,
      },
    });

    logger.info(`podcast created with orderPos ${nextOrderPos}`);
    revalidatePodcasts();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'পডকাস্ট যোগ করতে ব্যর্থ হয়েছে।';
    logger.error(`createPodcastAction error: ${message}`);
    return { ok: false, message };
  }
}

export async function updatePodcastAction(
  values: TUpdatePodcastValues
): Promise<TPodcastActionResult> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED_PODCASTS };
    }

    const parsed = updatePodcastSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof TAddPodcastValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TAddPodcastValues;
        fieldErrors[field] = issue.message;
      }
      return { ok: false, message: 'তথ্য যাচাইকরণ ব্যর্থ হয়েছে।', fieldErrors };
    }

    const existing = await prisma.podcast.findUnique({
      where: { id: parsed.data.id },
    });

    if (!existing) {
      return { ok: false, message: 'এই পডকাস্টটি খুঁজে পাওয়া যায়নি।' };
    }

    // Strict Invariant: If changing from unpublished to published, verify published count < 10
    if (parsed.data.published && !existing.published) {
      const publishedCount = await prisma.podcast.count({ where: { published: true } });
      if (publishedCount >= MAX_PUBLISHED_PODCASTS) {
        return {
          ok: false,
          message:
            'সর্বোচ্চ ১০টি পডকাস্ট ভিডিও একসাথে দৃশ্যমান (প্রকাশিত) রাখা সম্ভব। অন্য একটি ভিডিও লুকানোর পর এটি প্রকাশ করুন।',
        };
      }
    }

    // Clean up old thumbnail from Cloudinary if replaced
    if (existing.thumbnailUrl !== parsed.data.thumbnailUrl) {
      const oldPublicId = extractCloudinaryPublicId(existing.thumbnailUrl);
      if (oldPublicId) {
        try {
          await destroyCloudinaryImage(oldPublicId);
        } catch (cloudErr) {
          logger.warn(
            `Could not destroy old Cloudinary image for podcast ${existing.id}: ${cloudErr}`
          );
        }
      }
    }

    await prisma.podcast.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        youtubeUrl: parsed.data.youtubeUrl,
        thumbnailUrl: parsed.data.thumbnailUrl,
        duration: parsed.data.duration,
        published: parsed.data.published,
        clientName: parsed.data.clientName ?? '',
        clientDesignation: parsed.data.clientDesignation ?? '',
        projectName: parsed.data.projectName ?? '',
      },
    });

    logger.info(`podcast ${parsed.data.id} updated`);
    revalidatePodcasts();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'পডকাস্ট আপডেট করতে ব্যর্থ হয়েছে।';
    logger.error(`updatePodcastAction error: ${message}`);
    return { ok: false, message };
  }
}

export async function togglePodcastVisibilityAction(
  id: string,
  targetPublished: boolean
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED_PODCASTS };
    }

    const existing = await prisma.podcast.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, message: 'এই পডকাস্টটি খুঁজে পাওয়া যায়নি।' };
    }

    // If enabling visibility, ensure total published stays <= 10
    if (targetPublished && !existing.published) {
      const publishedCount = await prisma.podcast.count({ where: { published: true } });
      if (publishedCount >= MAX_PUBLISHED_PODCASTS) {
        return {
          ok: false,
          message:
            'সর্বোচ্চ ১০টি পডকাস্ট ভিডিও একসাথে দৃশ্যমান (প্রকাশিত) রাখা সম্ভব। নতুন কোনো ভিডিও দৃশ্যমান করতে চাইলে প্রথমে আগের যেকোনো একটি ভিডিও লুকান।',
        };
      }
    }

    await prisma.podcast.update({
      where: { id },
      data: { published: targetPublished },
    });

    logger.info(`podcast ${id} visibility toggled to ${targetPublished}`);
    revalidatePodcasts();
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে।';
    logger.error(`togglePodcastVisibilityAction error: ${message}`);
    return { ok: false, message };
  }
}

export async function deletePodcastAction(
  id: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED_PODCASTS };
    }

    const podcast = await prisma.podcast.findUnique({ where: { id } });
    if (!podcast) {
      return { ok: false, message: 'এই পডকাস্টটি খুঁজে পাওয়া যায়নি।' };
    }

    await prisma.podcast.delete({ where: { id } });

    // Clean up thumbnail from Cloudinary
    const publicId = extractCloudinaryPublicId(podcast.thumbnailUrl);
    if (publicId) {
      try {
        await destroyCloudinaryImage(publicId);
      } catch (cloudErr) {
        logger.warn(`Could not destroy Cloudinary image for podcast ${id}: ${cloudErr}`);
      }
    }

    // Re-sequence remaining rows so orderPos stays contiguous (0, 1, 2...)
    const remaining = await prisma.podcast.findMany({ orderBy: { orderPos: 'asc' } });
    await prisma.$transaction(
      remaining.map((item, index) =>
        prisma.podcast.update({ where: { id: item.id }, data: { orderPos: index } })
      )
    );

    logger.info(`podcast ${id} deleted and remaining reordered`);
    revalidatePodcasts();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'পডকাস্ট মুছতে ব্যর্থ হয়েছে।';
    logger.error(`deletePodcastAction error: ${message}`);
    return { ok: false, message };
  }
}

export async function reorderPodcastsAction(
  orderedIds: readonly string[]
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const admin = await readActiveAdmin();
    if (!admin) {
      return { ok: false, message: DENIED_PODCASTS };
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.podcast.update({
          where: { id },
          data: { orderPos: index },
        })
      )
    );

    logger.info(`podcasts reordered: ${orderedIds.length} items`);
    revalidatePodcasts();
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'ক্রমবিন্যাস সংরক্ষণ করতে ব্যর্থ হয়েছে।';
    logger.error(`reorderPodcastsAction error: ${message}`);
    return { ok: false, message };
  }
}
