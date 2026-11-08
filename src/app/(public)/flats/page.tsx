import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/shared/page-breadcrumb';
import { PublishedProjectCard } from '@/components/shared/published-project-card';
import { FLAT_STATUS_OPTIONS } from '@/features/flat-projects/components/flat-form-schema';
import { listPublishedFlats } from '@/features/flat-projects/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ফ্ল্যাট',
  description:
    'নাজরুল সিটির প্রকাশিত ফ্ল্যাট প্রকল্পগুলো দেখুন। আপনার পছন্দের ফ্ল্যাট বেছে নিয়ে বিস্তারিত জানুন।',
};

const FLATS_BREADCRUMB = [{ label: 'হোম', href: '/' }, { label: 'ফ্ল্যাট' }] as const;

function readFlatStatusLabel(status: (typeof FLAT_STATUS_OPTIONS)[number]['value']): string {
  return FLAT_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export default async function FlatsPage() {
  const flats = await listPublishedFlats();

  return (
    <div className="flex flex-col">
      <PageBreadcrumb items={FLATS_BREADCRUMB} />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
        <header className="mx-auto flex max-w-prose flex-col items-center gap-2 text-center">
          <h1>ফ্ল্যাট</h1>
          <p className="text-base text-muted-foreground">
            নাজরুল সিটির প্রকাশিত ফ্ল্যাট প্রকল্পগুলো দেখুন। আপনার পছন্দের ফ্ল্যাট বেছে নিয়ে
            বিস্তারিত জানুন।
          </p>
        </header>
        {flats.length === 0 ? (
          <p className="text-base text-muted-foreground">এখনও কোনো ফ্ল্যাট প্রকাশিত হয়নি।</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flats.map((flat, index) => (
              <li key={flat.slug}>
                <PublishedProjectCard
                  href={`/flats/${flat.slug}`}
                  name={flat.name}
                  shortIntro={flat.shortIntro}
                  status={flat.status}
                  statusLabel={readFlatStatusLabel(flat.status)}
                  district={flat.district}
                  price={flat.price}
                  imageUrl={flat.imageUrl}
                  badgeLabel="ফ্ল্যাট"
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
