import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumb } from '@/components/shared/page-breadcrumb';
import { PlotDetail } from '@/features/land-projects/components/plot-detail';
import { getPublishedPlot } from '@/features/land-projects/queries';

export const dynamic = 'force-dynamic';

type TPlotPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Readonly<TPlotPageProps>): Promise<Metadata> {
  const { slug } = await params;
  const plot = await getPublishedPlot(slug);

  if (!plot) {
    return { title: 'প্লট' };
  }

  return {
    title: plot.title,
    description: plot.district,
  };
}

export default async function PlotPage({ params }: Readonly<TPlotPageProps>) {
  const { slug } = await params;
  const plot = await getPublishedPlot(slug);

  if (!plot) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <PageBreadcrumb
        items={[
          { label: 'হোম', href: '/' },
          { label: 'প্লট', href: '/plots' },
          { label: plot.name },
        ]}
      />
      <PlotDetail plot={plot} />
    </div>
  );
}
