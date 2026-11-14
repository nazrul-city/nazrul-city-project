import 'server-only';

import { prisma } from '@/lib/prisma';
import type { TTeamImage } from './types/team-image';

export async function getTeamImages(): Promise<readonly TTeamImage[]> {
  try {
    return await prisma.teamImage.findMany({
      orderBy: { orderPos: 'asc' },
    });
  } catch {
    return [];
  }
}
