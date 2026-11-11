import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/shared/page-breadcrumb';
import { PublishedProjectCard } from '@/components/shared/published-project-card';
import { PLOT_STATUS_OPTIONS } from '@/features/land-projects/components/plot-form-schema';
import { listPublishedPlots } from '@/features/land-projects/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'প্লট',
  description:
    'নাজরুল সিটির প্রকাশিত আবাসিক প্লট প্রকল্পগুলো দেখুন। আপনার পছন্দের প্লট বেছে নিয়ে বিস্তারিত জানুন।',
};

const PLOTS_BREADCRUMB = [{ label: 'হোম', href: '/' }, { label: 'প্লট' }] as const;

function readPlotStatusLabel(status: (typeof PLOT_STATUS_OPTIONS)[number]['value']): string {
  return PLOT_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export default async function PlotsPage() {
  const plots = await listPublishedPlots();

  return (
    <div className="flex flex-col">
      <PageBreadcrumb items={PLOTS_BREADCRUMB} />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
        <header className="mx-auto flex max-w-prose flex-col items-center gap-2 text-center">
          <h1>প্লট</h1>
          <p className="text-base text-muted-foreground">
            নাজরুল সিটির প্রকাশিত আবাসিক প্লট প্রকল্পগুলো দেখুন। আপনার পছন্দের প্লট বেছে নিয়ে
            বিস্তারিত জানুন।
          </p>
        </header>
        {plots.length === 0 ? (
          <p className="text-base text-muted-foreground">এখনও কোনো প্লট প্রকাশিত হয়নি।</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plots.map((plot, index) => (
              <li key={plot.slug}>
                <PublishedProjectCard
                  href={`/plots/${plot.slug}`}
                  name={plot.name}
                  shortIntro={plot.shortIntro}
                  status={plot.status}
                  statusLabel={readPlotStatusLabel(plot.status)}
                  district={plot.district}
                  price={plot.price}
                  imageUrl={plot.imageUrl}
                  badgeLabel="প্লট"
                  imagePriority={index === 0}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
