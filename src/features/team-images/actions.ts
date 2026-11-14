'use server';

import { revalidatePath } from 'next/cache';
import { readActiveAdmin } from '@/lib/auth';
import { destroyCloudinaryImage } from '@/lib/cloudinary';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { extractCloudinaryPublicId } from '@/utils/project-image-url';
import { MAX_TEAM_IMAGES } from './constants';
import {
  addTeamImageSchema,
  type TAddTeamImageResult,
  type TAddTeamImageValues,
} from './components/team-image-schema';

const DENIED = 'You must be signed in as an admin to manage team photos.';

function revalidate() {
  revalidatePath('/about-us');
  revalidatePath('/admin/team');
}

export async function addTeamImageAction(
  values: TAddTeamImageValues
): Promise<TAddTeamImageResult> {
  try {
    const admin = await readActiveAdmin();

    if (!admin) {
      return { ok: false, message: DENIED };
    }

    const parsed = addTeamImageSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof TAddTeamImageValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TAddTeamImageValues;
        fieldErrors[field] = issue.message;
      }
      return { ok: false, message: 'Validation failed.', fieldErrors };
    }

    const count = await prisma.teamImage.count();

    if (count >= MAX_TEAM_IMAGES) {
      return {
        ok: false,
        message: `You can upload a maximum of ${MAX_TEAM_IMAGES.toString()} team photos.`,
      };
    }

    await prisma.teamImage.create({
      data: {
        caption: parsed.data.caption,
        imageUrl: parsed.data.imageUrl,
        orderPos: count,
      },
    });

    logger.info('team image added');
    revalidate();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add team image.';
    logger.error(`addTeamImageAction error: ${message}`);
    return { ok: false, message };
  }
}

export type TDeleteTeamImageResult = { ok: true } | { ok: false; message: string };

export async function deleteTeamImageAction(id: string): Promise<TDeleteTeamImageResult> {
  try {
    const admin = await readActiveAdmin();

    if (!admin) {
      return { ok: false, message: DENIED };
    }

    const image = await prisma.teamImage.findUnique({ where: { id } });

    if (!image) {
      return { ok: false, message: 'That photo was not found.' };
    }

    await prisma.teamImage.delete({ where: { id } });

    // Reorder remaining rows so orderPos stays contiguous
    const remaining = await prisma.teamImage.findMany({ orderBy: { orderPos: 'asc' } });
    await prisma.$transaction(
      remaining.map((img, index) =>
        prisma.teamImage.update({ where: { id: img.id }, data: { orderPos: index } })
      )
    );

    const publicId = extractCloudinaryPublicId(image.imageUrl);
    if (publicId) {
      const result = await destroyCloudinaryImage(publicId);
      if (!result.ok) {
        logger.warn(
          `team image deleted from DB but Cloudinary deletion failed: ${result.message ?? 'unknown'}`
        );
      }
    }

    logger.info('team image deleted');
    revalidate();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete team image.';
    logger.error(`deleteTeamImageAction error: ${message}`);
    return { ok: false, message };
  }
}

export type TReorderTeamImagesResult = { ok: true } | { ok: false; message: string };

export async function reorderTeamImagesAction(
  orderedIds: readonly string[]
): Promise<TReorderTeamImagesResult> {
  try {
    const admin = await readActiveAdmin();

    if (!admin) {
      return { ok: false, message: DENIED };
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.teamImage.update({ where: { id }, data: { orderPos: index } })
      )
    );

    logger.info('team images reordered');
    revalidate();
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reorder team images.';
    logger.error(`reorderTeamImagesAction error: ${message}`);
    return { ok: false, message };
  }
}
