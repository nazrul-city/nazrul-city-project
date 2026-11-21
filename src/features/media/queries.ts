import 'server-only';

import { prisma } from '@/lib/prisma';
import { MAX_FACEBOOK_REELS } from './constants';
import type { TFacebookReel } from './types/facebook-reel';

export async function getPublicFacebookReels(): Promise<readonly TFacebookReel[]> {
  try {
    return await prisma.facebookReel.findMany({
      orderBy: { priority: 'asc' },
      take: MAX_FACEBOOK_REELS,
    });
  } catch {
    return [];
  }
}

export async function getAllFacebookReels(): Promise<readonly TFacebookReel[]> {
  try {
    return await prisma.facebookReel.findMany({
      orderBy: { priority: 'asc' },
    });
  } catch {
    return [];
  }
}
