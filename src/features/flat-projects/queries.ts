import 'server-only';

import type { TFlatFormValues } from '@/features/flat-projects/components/flat-form-schema';
import { prisma } from '@/lib/prisma';

export async function listAdminFlats() {
  return prisma.flat.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      district: true,
      status: true,
      constructionStatus: true,
      published: true,
      isFeatured: true,
    },
  });
}

export async function getFlatFormValues(
  id: string
): Promise<{ id: string; values: TFlatFormValues } | null> {
  const flat = await prisma.flat.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        select: { imageUrl: true },
      },
    },
  });

  if (!flat) {
    return null;
  }

  return {
    id: flat.id,
    values: {
      name: flat.name,
      title: flat.title,
      slug: flat.slug,
      propertyType: flat.propertyType,
      address: flat.address,
      district: flat.district,
      description: flat.description,
      shortIntro: flat.shortIntro,
      buildingTotalFloors: flat.buildingTotalFloors,
      pricePerSqft: flat.pricePerSqft,
      landmark: flat.landmark,
      facilities: flat.facilities,
      specialOffer: flat.specialOffer,
      status: flat.status,
      constructionStatus: flat.constructionStatus,
      handoverDate: flat.handoverDate,
      driveLink: flat.driveLink,
      youtubeVideoUrl: flat.youtubeVideoUrl,
      mapEmbedLink: flat.mapEmbedLink,
      isFeatured: flat.isFeatured,
      published: flat.published,
      installmentFacility: flat.installmentFacility ?? '',
      images: flat.images.map((image) => image.imageUrl),
    },
  };
}

export async function listPublishedFlats() {
  try {
    const flats = await prisma.flat.findMany({
      where: { published: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      select: {
        slug: true,
        name: true,
        shortIntro: true,
        status: true,
        district: true,
        pricePerSqft: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
          select: { imageUrl: true },
        },
      },
    });

    return flats.map((flat) => ({
      slug: flat.slug,
      name: flat.name,
      shortIntro: flat.shortIntro,
      status: flat.status,
      district: flat.district,
      price: flat.pricePerSqft,
      imageUrl: flat.images[0]?.imageUrl ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getPublishedFlat(slug: string) {
  return prisma.flat.findFirst({
    where: { slug, published: true },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}
