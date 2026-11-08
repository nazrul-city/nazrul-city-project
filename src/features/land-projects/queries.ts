import 'server-only';

import type { TPlotFormValues } from '@/features/land-projects/components/plot-form-schema';
import { prisma } from '@/lib/prisma';

export async function listAdminPlots() {
  return prisma.plot.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      district: true,
      status: true,
      published: true,
      isFeatured: true,
    },
  });
}

export async function getPlotFormValues(
  id: string
): Promise<{ id: string; values: TPlotFormValues } | null> {
  const plot = await prisma.plot.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        select: { imageUrl: true },
      },
    },
  });

  if (!plot) {
    return null;
  }

  return {
    id: plot.id,
    values: {
      name: plot.name,
      title: plot.title,
      slug: plot.slug,
      description: plot.description,
      shortIntro: plot.shortIntro,
      facilities: plot.facilities,
      address: plot.address,
      district: plot.district,
      landmark: plot.landmark,
      shotangshoPrice: plot.shotangshoPrice,
      landAreaSize: plot.landAreaSize,
      driveLink: plot.driveLink,
      youtubeVideoUrl: plot.youtubeVideoUrl,
      mapEmbedLink: plot.mapEmbedLink,
      specialOffer: plot.specialOffer,
      published: plot.published,
      isFeatured: plot.isFeatured,
      status: plot.status,
      installmentFacility: plot.installmentFacility ?? '',
      images: plot.images.map((image) => image.imageUrl),
    },
  };
}

export async function listPublishedPlots() {
  const plots = await prisma.plot.findMany({
    where: { published: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    select: {
      slug: true,
      name: true,
      shortIntro: true,
      status: true,
      district: true,
      shotangshoPrice: true,
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
        select: { imageUrl: true },
      },
    },
  });

  return plots.map((plot) => ({
    slug: plot.slug,
    name: plot.name,
    shortIntro: plot.shortIntro,
    status: plot.status,
    district: plot.district,
    price: plot.shotangshoPrice,
    imageUrl: plot.images[0]?.imageUrl ?? null,
  }));
}

export async function getPublishedPlot(slug: string) {
  return prisma.plot.findFirst({
    where: { slug, published: true },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}
