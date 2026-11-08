'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import {
  flatFormSchema,
  readFlatFieldErrors,
  type TFlatFieldErrors,
  type TFlatFormValues,
  type TFlatSaveResult,
} from '@/features/flat-projects/components/flat-form-schema';
import { readActiveAdmin } from '@/lib/auth';
import { clearOtherFeaturedProjects } from '@/lib/featured-project';
import { destroyManyCloudinaryImages } from '@/lib/cloudinary';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { extractCloudinaryPublicId } from '@/utils/project-image-url';
import { sanitizeRichText } from '@/utils/sanitize-rich-text';

const SAVE_DENIED = 'You do not have access to save this flat.';
const DELETE_DENIED = 'You do not have access to delete this flat.';
const VISIBILITY_DENIED = 'You do not have access to update this flat.';

const flatVisibilitySchema = z
  .object({
    flatId: z.string().uuid(),
    published: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine((value) => value.published !== undefined || value.isFeatured !== undefined, {
    message: 'Choose published or featured.',
  });

export type TFlatVisibilityResult = { ok: true } | { ok: false; message: string };

function flatData(values: TFlatFormValues) {
  return {
    name: values.name,
    title: values.title,
    slug: values.slug,
    propertyType: values.propertyType,
    address: values.address,
    district: values.district,
    description: sanitizeRichText(values.description),
    shortIntro: values.shortIntro,
    buildingTotalFloors: values.buildingTotalFloors,
    pricePerSqft: values.pricePerSqft,
    landmark: values.landmark,
    facilities: values.facilities,
    specialOffer: values.specialOffer,
    status: values.status,
    constructionStatus: values.constructionStatus,
    handoverDate: values.handoverDate,
    driveLink: values.driveLink,
    youtubeVideoUrl: values.youtubeVideoUrl,
    mapEmbedLink: values.mapEmbedLink,
    isFeatured: values.isFeatured,
    published: values.published,
    installmentFacility: values.installmentFacility === '' ? null : values.installmentFacility,
  };
}

function readUniqueField(error: unknown): keyof TFlatFieldErrors | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    return null;
  }

  const target = error.meta?.target;
  const fields = typeof target === 'string' ? [target] : Array.isArray(target) ? target : [];
  const names = fields.filter((field) => typeof field === 'string').join(' ');

  if (names.includes('slug')) {
    return 'slug';
  }

  if (names.includes('name')) {
    return 'name';
  }

  return null;
}

function uniqueFieldError(field: keyof TFlatFieldErrors): TFlatFieldErrors {
  if (field === 'slug') {
    return { slug: 'A flat with this slug already exists.' };
  }

  return { name: 'A flat with this name already exists.' };
}

async function requireActiveAdmin(): Promise<{ ok: true; isSuperAdmin: boolean } | { ok: false }> {
  const admin = await readActiveAdmin();

  if (!admin) {
    return { ok: false };
  }

  return { ok: true, isSuperAdmin: admin.role === 'SUPER_ADMIN' };
}

function refreshFlatPaths(slug: string, previousSlug?: string) {
  revalidatePath('/admin/flat-projects');
  revalidatePath('/admin/land-projects');
  revalidatePath('/flats');
  revalidatePath(`/flats/${slug}`);
  revalidatePath('/');

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/flats/${previousSlug}`);
  }
}

export async function createFlat(values: TFlatFormValues): Promise<TFlatSaveResult> {
  const admin = await requireActiveAdmin();

  if (!admin.ok) {
    return { ok: false, message: SAVE_DENIED };
  }

  const parsed = flatFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readFlatFieldErrors(parsed.error) };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const flat = await tx.flat.create({ data: flatData(parsed.data) });

      if (parsed.data.isFeatured) {
        await clearOtherFeaturedProjects(tx, { flatId: flat.id });
      }

      if (parsed.data.images.length > 0) {
        await tx.flatImage.createMany({
          data: parsed.data.images.map((imageUrl, sortOrder) => ({
            flatId: flat.id,
            imageUrl,
            sortOrder,
          })),
        });
      }
    });
  } catch (error) {
    const field = readUniqueField(error);

    if (field) {
      return { ok: false, fieldErrors: uniqueFieldError(field) };
    }

    throw error;
  }

  logger.info('flat created');
  refreshFlatPaths(parsed.data.slug);
  return { ok: true };
}

export async function updateFlat(
  flatId: string,
  values: TFlatFormValues
): Promise<TFlatSaveResult> {
  const admin = await requireActiveAdmin();

  if (!admin.ok) {
    return { ok: false, message: SAVE_DENIED };
  }

  if (!flatId) {
    return { ok: false, message: 'That flat was not found.' };
  }

  const parsed = flatFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readFlatFieldErrors(parsed.error) };
  }

  const existing = await prisma.flat.findUnique({
    where: { id: flatId },
    select: { slug: true },
  });

  if (!existing) {
    return { ok: false, message: 'That flat was not found.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.flat.update({
        where: { id: flatId },
        data: flatData(parsed.data),
      });

      if (parsed.data.isFeatured) {
        await clearOtherFeaturedProjects(tx, { flatId });
      }

      await tx.flatImage.deleteMany({ where: { flatId } });

      if (parsed.data.images.length > 0) {
        await tx.flatImage.createMany({
          data: parsed.data.images.map((imageUrl, sortOrder) => ({
            flatId,
            imageUrl,
            sortOrder,
          })),
        });
      }
    });
  } catch (error) {
    const field = readUniqueField(error);

    if (field) {
      return { ok: false, fieldErrors: uniqueFieldError(field) };
    }

    throw error;
  }

  logger.info('flat updated');
  refreshFlatPaths(parsed.data.slug, existing.slug);
  return { ok: true };
}

export async function updateFlatVisibility(input: {
  flatId: string;
  published?: boolean;
  isFeatured?: boolean;
}): Promise<TFlatVisibilityResult> {
  const admin = await requireActiveAdmin();

  if (!admin.ok) {
    return { ok: false, message: VISIBILITY_DENIED };
  }

  const parsed = flatVisibilitySchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: 'That flat could not be updated.' };
  }

  const existing = await prisma.flat.findUnique({
    where: { id: parsed.data.flatId },
    select: { slug: true },
  });

  if (!existing) {
    return { ok: false, message: 'That flat was not found.' };
  }

  await prisma.$transaction(async (tx) => {
    await tx.flat.update({
      where: { id: parsed.data.flatId },
      data: {
        ...(parsed.data.published !== undefined ? { published: parsed.data.published } : {}),
        ...(parsed.data.isFeatured !== undefined ? { isFeatured: parsed.data.isFeatured } : {}),
      },
    });

    if (parsed.data.isFeatured === true) {
      await clearOtherFeaturedProjects(tx, { flatId: parsed.data.flatId });
    }
  });

  logger.info('flat visibility updated');
  refreshFlatPaths(existing.slug);
  return { ok: true };
}

export async function deleteFlat(flatId: string): Promise<TFlatSaveResult> {
  const admin = await requireActiveAdmin();

  if (!admin.ok || !admin.isSuperAdmin) {
    return { ok: false, message: DELETE_DENIED };
  }

  if (!flatId) {
    return { ok: false, message: 'That flat was not found.' };
  }

  const existing = await prisma.flat.findUnique({
    where: { id: flatId },
    select: {
      slug: true,
      images: {
        select: { imageUrl: true },
      },
    },
  });

  if (!existing) {
    return { ok: false, message: 'That flat was not found.' };
  }

  await prisma.flat.delete({ where: { id: flatId } });
  logger.info('flat deleted');

  const publicIds = existing.images
    .map((img) => extractCloudinaryPublicId(img.imageUrl))
    .filter((id): id is string => id !== null);

  if (publicIds.length > 0) {
    await destroyManyCloudinaryImages(publicIds);
  }

  refreshFlatPaths(existing.slug);
  return { ok: true };
}
