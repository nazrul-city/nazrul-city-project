import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumb } from '@/components/shared/page-breadcrumb';
import { FlatDetail } from '@/features/flat-projects/components/flat-detail';
import { getPublishedFlat } from '@/features/flat-projects/queries';

export const dynamic = 'force-dynamic';

type TFlatPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Readonly<TFlatPageProps>): Promise<Metadata> {
  const { slug } = await params;
  const flat = await getPublishedFlat(slug);

  if (!flat) {
    return { title: 'ফ্ল্যাট' };
  }

  return {
    title: flat.title,
    description: flat.district,
  };
}

export default async function FlatPage({ params }: Readonly<TFlatPageProps>) {
  const { slug } = await params;
  const flat = await getPublishedFlat(slug);

  if (!flat) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <PageBreadcrumb
        items={[
          { label: 'হোম', href: '/' },
          { label: 'ফ্ল্যাট', href: '/flats' },
          { label: flat.name },
        ]}
      />
      <FlatDetail flat={flat} />
    </div>
  );
}
