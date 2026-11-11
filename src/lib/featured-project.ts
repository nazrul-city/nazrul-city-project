import 'server-only';

import type { Prisma } from '@/generated/prisma/client';

type TFeaturedKeep = {
  plotId?: string;
  flatId?: string;
};

/**
 * Only one project (plot or flat) may be featured at a time.
 * Clears `isFeatured` on every other row, keeping the given id if provided.
 */
export async function clearOtherFeaturedProjects(
  tx: Prisma.TransactionClient,
  keep: TFeaturedKeep = {}
): Promise<void> {
  await tx.plot.updateMany({
    where: {
      isFeatured: true,
      ...(keep.plotId ? { id: { not: keep.plotId } } : {}),
    },
    data: { isFeatured: false },
  });

  await tx.flat.updateMany({
    where: {
      isFeatured: true,
      ...(keep.flatId ? { id: { not: keep.flatId } } : {}),
    },
    data: { isFeatured: false },
  });
}
