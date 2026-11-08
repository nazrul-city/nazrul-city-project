'use server';

import { revalidatePath } from 'next/cache';
import {
  heroStatsFormSchema,
  readHeroStatsFieldErrors,
  type THeroStatsFormValues,
  type THeroStatsSaveResult,
} from '@/features/hero-stats/components/hero-stats-form-schema';
import { HERO_STATS_ID } from '@/features/hero-stats/constants';
import { readActiveAdmin } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const SAVE_DENIED = 'You do not have access to save these stats.';

export async function updateHeroStats(values: THeroStatsFormValues): Promise<THeroStatsSaveResult> {
  const admin = await readActiveAdmin();

  if (!admin) {
    return { ok: false, message: SAVE_DENIED };
  }

  const parsed = heroStatsFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readHeroStatsFieldErrors(parsed.error) };
  }

  await prisma.heroStats.upsert({
    where: { id: HERO_STATS_ID },
    create: {
      id: HERO_STATS_ID,
      plotsSold: parsed.data.plotsSold,
      happyClients: parsed.data.happyClients,
      propertiesListed: parsed.data.propertiesListed,
    },
    update: {
      plotsSold: parsed.data.plotsSold,
      happyClients: parsed.data.happyClients,
      propertiesListed: parsed.data.propertiesListed,
    },
  });

  logger.info('hero stats updated');
  revalidatePath('/');
  revalidatePath('/admin/hero-stats');
  return { ok: true };
}
