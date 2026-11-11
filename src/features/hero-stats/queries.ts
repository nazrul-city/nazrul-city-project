import 'server-only';

import { HERO_STATS_DEFAULTS, HERO_STATS_ID } from '@/features/hero-stats/constants';
import type { THeroStatsFormValues } from '@/features/hero-stats/components/hero-stats-form-schema';
import { prisma } from '@/lib/prisma';

export type THeroStatsValues = {
  plotsSold: string;
  happyClients: string;
  propertiesListed: string;
};

export async function getHeroStats(): Promise<THeroStatsValues> {
  try {
    const stats = await prisma.heroStats.findUnique({
      where: { id: HERO_STATS_ID },
      select: {
        plotsSold: true,
        happyClients: true,
        propertiesListed: true,
      },
    });

    if (!stats) {
      return {
        plotsSold: HERO_STATS_DEFAULTS.plotsSold,
        happyClients: HERO_STATS_DEFAULTS.happyClients,
        propertiesListed: HERO_STATS_DEFAULTS.propertiesListed,
      };
    }

    return {
      plotsSold: stats.plotsSold,
      happyClients: stats.happyClients,
      propertiesListed: stats.propertiesListed,
    };
  } catch {
    return {
      plotsSold: HERO_STATS_DEFAULTS.plotsSold,
      happyClients: HERO_STATS_DEFAULTS.happyClients,
      propertiesListed: HERO_STATS_DEFAULTS.propertiesListed,
    };
  }
}

export async function getHeroStatsFormValues(): Promise<THeroStatsFormValues> {
  return getHeroStats();
}
