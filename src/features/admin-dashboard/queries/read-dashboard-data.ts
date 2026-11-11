import 'server-only';

import { prisma } from '@/lib/prisma';
import type {
  TDashboardData,
  TDashboardKPIs,
  TDashboardRecentProject,
} from '@/features/admin-dashboard/types/dashboard';

export async function readDashboardData(): Promise<TDashboardData> {
  const [plots, flats, notice, activeAdminsCount] = await Promise.all([
    prisma.plot.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        district: true,
        status: true,
        published: true,
        isFeatured: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.flat.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        district: true,
        status: true,
        constructionStatus: true,
        published: true,
        isFeatured: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.siteNotice.findFirst({
      select: {
        message: true,
        isEnabled: true,
      },
    }),
    prisma.user.count({
      where: { isActive: true },
    }),
  ]);

  // Compute Plot KPIs
  const totalPlots = plots.length;
  let publishedPlots = 0;
  let availablePlots = 0;
  let reservedPlots = 0;
  let soldPlots = 0;
  let featuredPlotName: string | null = null;

  for (const plot of plots) {
    if (plot.published) {
      publishedPlots += 1;
    }
    if (plot.status === 'AVAILABLE') {
      availablePlots += 1;
    } else if (plot.status === 'RESERVED') {
      reservedPlots += 1;
    } else if (plot.status === 'SOLD') {
      soldPlots += 1;
    }
    if (plot.isFeatured && !featuredPlotName) {
      featuredPlotName = plot.name;
    }
  }

  // Compute Flat KPIs
  const totalFlats = flats.length;
  let publishedFlats = 0;
  let availableFlats = 0;
  let reservedFlats = 0;
  let soldFlats = 0;
  let readyFlats = 0;
  let underConstructionFlats = 0;
  let upcomingFlats = 0;
  let featuredFlatName: string | null = null;

  for (const flat of flats) {
    if (flat.published) {
      publishedFlats += 1;
    }
    if (flat.status === 'AVAILABLE') {
      availableFlats += 1;
    } else if (flat.status === 'RESERVED') {
      reservedFlats += 1;
    } else if (flat.status === 'SOLD') {
      soldFlats += 1;
    }

    if (flat.constructionStatus === 'READY') {
      readyFlats += 1;
    } else if (flat.constructionStatus === 'UNDER_CONSTRUCTION') {
      underConstructionFlats += 1;
    } else if (flat.constructionStatus === 'UPCOMING') {
      upcomingFlats += 1;
    }

    if (flat.isFeatured && !featuredFlatName) {
      featuredFlatName = flat.name;
    }
  }

  const kpis: TDashboardKPIs = {
    totalPlots,
    publishedPlots,
    availablePlots,
    reservedPlots,
    soldPlots,

    totalFlats,
    publishedFlats,
    availableFlats,
    reservedFlats,
    soldFlats,
    readyFlats,
    underConstructionFlats,
    upcomingFlats,

    featuredPlotName,
    featuredFlatName,

    activeNotice: notice
      ? {
          message: notice.message,
          isEnabled: notice.isEnabled,
        }
      : null,

    totalAdmins: activeAdminsCount,
  };

  // Combine and sort latest 6 updated projects across both categories
  const recentProjects: TDashboardRecentProject[] = [
    ...plots.slice(0, 6).map((plot) => ({
      id: plot.id,
      name: plot.name,
      slug: plot.slug,
      category: 'PLOT' as const,
      district: plot.district,
      status: plot.status,
      published: plot.published,
      isFeatured: plot.isFeatured,
      updatedAt: plot.updatedAt.toISOString(),
      editHref: `/admin/land-projects/${plot.id}`,
    })),
    ...flats.slice(0, 6).map((flat) => ({
      id: flat.id,
      name: flat.name,
      slug: flat.slug,
      category: 'FLAT' as const,
      district: flat.district,
      status: flat.status,
      published: flat.published,
      isFeatured: flat.isFeatured,
      updatedAt: flat.updatedAt.toISOString(),
      editHref: `/admin/flat-projects/${flat.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return {
    kpis,
    recentProjects,
  };
}
