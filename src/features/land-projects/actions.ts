'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import {
  plotFormSchema,
  readPlotFieldErrors,
  type TPlotFieldErrors,
  type TPlotFormValues,
  type TPlotSaveResult,
} from '@/features/land-projects/components/plot-form-schema';
import { readActiveAdmin } from '@/lib/auth';
import { clearOtherFeaturedProjects } from '@/lib/featured-project';
import { destroyManyCloudinaryImages } from '@/lib/cloudinary';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { extractCloudinaryPublicId } from '@/utils/project-image-url';
import { sanitizeRichText } from '@/utils/sanitize-rich-text';

const SAVE_DENIED = 'You do not have access to save this plot.';
const DELETE_DENIED = 'You do not have access to delete this plot.';
const VISIBILITY_DENIED = 'You do not have access to update this plot.';

const plotVisibilitySchema = z
  .object({
    plotId: z.string().uuid(),
    published: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine((value) => value.published !== undefined || value.isFeatured !== undefined, {
    message: 'Choose published or featured.',
  });

export type TPlotVisibilityResult = { ok: true } | { ok: false; message: string };

function plotData(values: TPlotFormValues) {
  return {
    name: values.name,
    title: values.title,
    description: sanitizeRichText(values.description),
    slug: values.slug,
    shortIntro: values.shortIntro,
    facilities: values.facilities,
    address: values.address,
    district: values.district,
    landmark: values.landmark,
    shotangshoPrice: values.shotangshoPrice,
    landAreaSize: values.landAreaSize,
    driveLink: values.driveLink,
    youtubeVideoUrl: values.youtubeVideoUrl,
    mapEmbedLink: values.mapEmbedLink,
    specialOffer: values.specialOffer,
    published: values.published,
    isFeatured: values.isFeatured,
    status: values.status,
    installmentFacility: values.installmentFacility === '' ? null : values.installmentFacility,
  };
}

function readUniqueField(error: unknown): keyof TPlotFieldErrors | null {
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

function uniqueFieldError(field: keyof TPlotFieldErrors): TPlotFieldErrors {
  if (field === 'slug') {
    return { slug: 'A plot with this slug already exists.' };
  }

  return { name: 'A plot with this name already exists.' };
}

async function requireActiveAdmin(): Promise<{ ok: true; isSuperAdmin: boolean } | { ok: false }> {
  const admin = await readActiveAdmin();

  if (!admin) {
    return { ok: false };
  }

  return { ok: true, isSuperAdmin: admin.role === 'SUPER_ADMIN' };
}

function refreshPlotPaths(slug: string, previousSlug?: string) {
  revalidatePath('/admin/land-projects');
  revalidatePath('/admin/flat-projects');
  revalidatePath('/plots');
  revalidatePath(`/plots/${slug}`);
  revalidatePath('/');

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/plots/${previousSlug}`);
  }
}

export async function createPlot(values: TPlotFormValues): Promise<TPlotSaveResult> {
  const admin = await requireActiveAdmin();

  if (!admin.ok) {
    return { ok: false, message: SAVE_DENIED };
  }

  const parsed = plotFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readPlotFieldErrors(parsed.error) };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const plot = await tx.plot.create({ data: plotData(parsed.data) });

      if (parsed.data.isFeatured) {
        await clearOtherFeaturedProjects(tx, { plotId: plot.id });
      }

      if (parsed.data.images.length > 0) {
        await tx.plotImage.createMany({
          data: parsed.data.images.map((imageUrl, sortOrder) => ({
            plotId: plot.id,
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

  logger.info('plot created');
  refreshPlotPaths(parsed.data.slug);
  return { ok: true };
}

export async function updatePlot(
  plotId: string,
  values: TPlotFormValues
): Promise<TPlotSaveResult> {
  const admin = await requireActiveAdmin();

  if (!admin.ok) {
    return { ok: false, message: SAVE_DENIED };
  }

  if (!plotId) {
    return { ok: false, message: 'That plot was not found.' };
  }

  const parsed = plotFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readPlotFieldErrors(parsed.error) };
  }

  const existing = await prisma.plot.findUnique({
    where: { id: plotId },
    select: { slug: true },
  });

  if (!existing) {
    return { ok: false, message: 'That plot was not found.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.plot.update({
        where: { id: plotId },
        data: plotData(parsed.data),
      });

      if (parsed.data.isFeatured) {
        await clearOtherFeaturedProjects(tx, { plotId });
      }

      await tx.plotImage.deleteMany({ where: { plotId } });

      if (parsed.data.images.length > 0) {
        await tx.plotImage.createMany({
          data: parsed.data.images.map((imageUrl, sortOrder) => ({
            plotId,
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

  logger.info('plot updated');
  refreshPlotPaths(parsed.data.slug, existing.slug);
  return { ok: true };
}

export async function updatePlotVisibility(input: {
  plotId: string;
  published?: boolean;
  isFeatured?: boolean;
}): Promise<TPlotVisibilityResult> {
  const admin = await requireActiveAdmin();

  if (!admin.ok) {
    return { ok: false, message: VISIBILITY_DENIED };
  }

  const parsed = plotVisibilitySchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: 'That plot could not be updated.' };
  }

  const existing = await prisma.plot.findUnique({
    where: { id: parsed.data.plotId },
    select: { slug: true },
  });

  if (!existing) {
    return { ok: false, message: 'That plot was not found.' };
  }

  await prisma.$transaction(async (tx) => {
    await tx.plot.update({
      where: { id: parsed.data.plotId },
      data: {
        ...(parsed.data.published !== undefined ? { published: parsed.data.published } : {}),
        ...(parsed.data.isFeatured !== undefined ? { isFeatured: parsed.data.isFeatured } : {}),
      },
    });

    if (parsed.data.isFeatured === true) {
      await clearOtherFeaturedProjects(tx, { plotId: parsed.data.plotId });
    }
  });

  logger.info('plot visibility updated');
  refreshPlotPaths(existing.slug);
  return { ok: true };
}

export async function deletePlot(plotId: string): Promise<TPlotSaveResult> {
  const admin = await requireActiveAdmin();

  if (!admin.ok || !admin.isSuperAdmin) {
    return { ok: false, message: DELETE_DENIED };
  }

  if (!plotId) {
    return { ok: false, message: 'That plot was not found.' };
  }

  const existing = await prisma.plot.findUnique({
    where: { id: plotId },
    select: {
      slug: true,
      images: {
        select: { imageUrl: true },
      },
    },
  });

  if (!existing) {
    return { ok: false, message: 'That plot was not found.' };
  }

  await prisma.plot.delete({ where: { id: plotId } });
  logger.info('plot deleted');

  const publicIds = existing.images
    .map((img) => extractCloudinaryPublicId(img.imageUrl))
    .filter((id): id is string => id !== null);

  if (publicIds.length > 0) {
    await destroyManyCloudinaryImages(publicIds);
  }

  refreshPlotPaths(existing.slug);
  return { ok: true };
}
