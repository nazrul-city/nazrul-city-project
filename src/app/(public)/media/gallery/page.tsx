import type { Metadata } from 'next';
import { SectionLayout } from '@/components/layout/section-layout';
import { PageBreadcrumb } from '@/components/shared/page-breadcrumb';
import { DedicatedGalleryView } from '@/features/media/components/dedicated-gallery-view';
import { getPaginatedGalleryPhotos } from '@/features/media/queries';

const GALLERY_BREADCRUMB = [
  { label: 'হোম', href: '/' },
  { label: 'মিডিয়া', href: '/media' },
  { label: 'ফটোগ্যালারি' },
] as const;

export const metadata: Metadata = {
  title: 'ফটোগ্যালারি | নজরুল সিটি',
  description:
    'নজরুল সিটির প্রকল্প পরিদর্শন, দলিল হস্তান্তর, বুকিং মুহূর্ত, গ্রাহক সন্তুষ্টি ও কর্পোরেট কার্যক্রমের স্থিরচিত্র।',
  openGraph: {
    title: 'ফটোগ্যালারি | নজরুল সিটি',
    description:
      'নজরুল সিটির প্রকল্প পরিদর্শন, দলিল হস্তান্তর, বুকিং মুহূর্ত, গ্রাহক সন্তুষ্টি ও কর্পোরেট কার্যক্রমের স্থিরচিত্র।',
  },
};

type TGalleryPageProps = {
  searchParams: Promise<{
    category?: string;
    page?: string;
    limit?: string;
  }>;
};

export default async function GalleryPage({ searchParams }: Readonly<TGalleryPageProps>) {
  const resolvedParams = await searchParams;
  const page = Number.parseInt(resolvedParams.page || '1', 10);
  const limit = Number.parseInt(resolvedParams.limit || '20', 10);
  const category = resolvedParams.category || 'ALL';

  const {
    photos,
    totalCount,
    totalPages,
    currentPage,
    category: currentCategory,
  } = await getPaginatedGalleryPhotos({
    category,
    page: Number.isNaN(page) ? 1 : page,
    limit: Number.isNaN(limit) ? 20 : limit,
  });

  return (
    <div className="flex flex-col">
      {/* Consistent Page Breadcrumb matching About Us, Flats, and Plots pages */}
      <PageBreadcrumb items={GALLERY_BREADCRUMB} />

      <SectionLayout id="dedicated-gallery" aria-labelledby="dedicated-gallery-heading">
        {/* Header — centered style matching /flats and /plots pages */}
        <header className="mx-auto my-8 flex max-w-prose flex-col items-center gap-2 text-center md:mb-10">
          <h1 id="dedicated-gallery-heading">ফটোগ্যালারি</h1>
          <p className="text-base text-muted-foreground">
            নজরুল সিটির প্রকল্প পরিদর্শন, দলিল হস্তান্তর, বুকিং মুহূর্ত, গ্রাহক সন্তুষ্টি ও কর্পোরেট
            কার্যক্রমের স্থিরচিত্র সংগ্রহ।
          </p>
        </header>

        <DedicatedGalleryView
          photos={photos}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          currentCategory={currentCategory}
          limit={limit}
        />
      </SectionLayout>
    </div>
  );
}
