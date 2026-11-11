import type { Metadata } from 'next';
import { SiteNoticeForm } from '@/features/site-notice/components/site-notice-form';
import { getSiteNoticeFormValues } from '@/features/site-notice/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hero notice',
  description: 'Home hero marquee notice in the Nazrul City admin.',
  robots: { index: false, follow: false },
};

export default async function SiteNoticePage() {
  const defaultValues = await getSiteNoticeFormValues();

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1>Hero notice</h1>
        <p className="max-w-prose text-base text-muted-foreground">
          Edit the scrolling message at the top of the homepage hero.
        </p>
      </div>
      <SiteNoticeForm defaultValues={defaultValues} />
    </section>
  );
}
