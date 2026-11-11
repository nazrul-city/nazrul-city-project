import 'server-only';

import type { THeroPropertyCard } from '@/features/landing-page/components/hero-section/hero-section';
import { prisma } from '@/lib/prisma';

type TFeaturedCandidate = {
  kind: 'plot' | 'flat';
  name: string;
  slug: string;
  district: string;
  shortIntro: string;
  specialOffer: string;
  updatedAt: Date;
};

function toHeroPropertyCard(project: TFeaturedCandidate): THeroPropertyCard {
  const highlight =
    project.shortIntro.trim() ||
    project.specialOffer.trim() ||
    (project.kind === 'plot' ? 'প্রকাশিত প্লট প্রকল্প' : 'প্রকাশিত ফ্ল্যাট প্রকল্প');

  return {
    kind: project.kind,
    tag: project.kind === 'plot' ? 'বিশেষ প্লট' : 'বিশেষ ফ্ল্যাট',
    title: project.name,
    location: project.district,
    highlight,
    href: project.kind === 'plot' ? `/plots/${project.slug}` : `/flats/${project.slug}`,
  };
}

/**
 * Newest published project marked Featured in admin (plot or flat).
 * Returns null when nothing is featured — the hero hides the card then.
 */
export async function getFeaturedHeroProject(): Promise<THeroPropertyCard | null> {
  try {
    const [plot, flat] = await Promise.all([
      prisma.plot.findFirst({
        where: { published: true, isFeatured: true },
        orderBy: { updatedAt: 'desc' },
        select: {
          name: true,
          slug: true,
          district: true,
          shortIntro: true,
          specialOffer: true,
          updatedAt: true,
        },
      }),
      prisma.flat.findFirst({
        where: { published: true, isFeatured: true },
        orderBy: { updatedAt: 'desc' },
        select: {
          name: true,
          slug: true,
          district: true,
          shortIntro: true,
          specialOffer: true,
          updatedAt: true,
        },
      }),
    ]);

    const candidates: TFeaturedCandidate[] = [];

    if (plot) {
      candidates.push({ kind: 'plot', ...plot });
    }

    if (flat) {
      candidates.push({ kind: 'flat', ...flat });
    }

    if (candidates.length === 0) {
      return null;
    }

    const newest = candidates.reduce((current, next) =>
      next.updatedAt > current.updatedAt ? next : current
    );

    return toHeroPropertyCard(newest);
  } catch {
    return null;
  }
}
