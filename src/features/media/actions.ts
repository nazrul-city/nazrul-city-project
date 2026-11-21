'use server';

import { revalidatePath } from 'next/cache';
import { readActiveAdmin } from '@/lib/auth';
import { destroyCloudinaryImage } from '@/lib/cloudinary';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { extractCloudinaryPublicId } from '@/utils/project-image-url';
import { MAX_FACEBOOK_REELS } from './constants';
import {
  addFacebookReelSchema,
  updateFacebookReelSchema,
  type TAddFacebookReelResult,
  type TAddFacebookReelValues,
  type TUpdateFacebookReelResult,
  type TUpdateFacebookReelValues,
} from './schemas/facebook-reel-schema';

const DENIED = 'You must be signed in as an admin to manage Facebook reels.';

function revalidate() {
  revalidatePath('/media');
  revalidatePath('/admin/facebook-reels');
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
