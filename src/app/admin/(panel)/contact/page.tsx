import type { Metadata } from 'next';
import { getSiteContact } from '@/config/site-contact';
import { SiteContactForm } from '@/features/site-contact';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Website contact',
  description: 'Website contact details in the Nazrul City admin.',
  robots: { index: false, follow: false },
};

export default async function WebsiteContactPage() {
  const defaultValues = await getSiteContact();

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1>Website contact</h1>
        <p className="max-w-prose text-base text-muted-foreground">
          Edit the phone numbers, WhatsApp number, and email shown across the public website.
        </p>
      </div>
      <SiteContactForm defaultValues={defaultValues} />
    </section>
  );
}
