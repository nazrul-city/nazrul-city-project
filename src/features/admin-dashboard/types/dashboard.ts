import type { PlotStatus, UserRole } from '@/generated/prisma/client';

export type TDashboardKPIs = {
  totalPlots: number;
  publishedPlots: number;
  availablePlots: number;
  reservedPlots: number;
  soldPlots: number;

  totalFlats: number;
  publishedFlats: number;
  availableFlats: number;
  reservedFlats: number;
  soldFlats: number;
  readyFlats: number;
  underConstructionFlats: number;
  upcomingFlats: number;

  featuredPlotName: string | null;
  featuredFlatName: string | null;

  activeNotice: {
    message: string;
    isEnabled: boolean;
  } | null;

  totalAdmins: number;
};

export type TRecentProjectCategory = 'PLOT' | 'FLAT';

export type TDashboardRecentProject = {
  id: string;
  name: string;
  slug: string;
  category: TRecentProjectCategory;
  district: string;
  status: PlotStatus;
  published: boolean;
  isFeatured: boolean;
  updatedAt: string;
  editHref: string;
};

export type TDashboardData = {
  kpis: TDashboardKPIs;
  recentProjects: readonly TDashboardRecentProject[];
};

export type TAdminDashboardViewProps = {
  adminName: string;
  adminRole: UserRole;
  data: TDashboardData;
};
