import { SectionLayout } from '@/components/layout';
import { SITE_CONFIG } from '@/config/site';
import { ContactForm } from '@/features/landing-page/components/contact-section/contact-form';
import { OfficeHoursStatus } from '@/features/landing-page/components/contact-section/office-hours-status';

export function ContactSection() {
  return (
    <SectionLayout id="contact" aria-labelledby="contact-heading">
      <header className="mx-auto flex max-w-xl flex-col items-center gap-4 py-6 text-center">
        <h2
          id="contact-heading"
          className="text-3xl leading-tight font-bold text-foreground md:text-4xl"
        >
          যোগাযোগ করুন
        </h2>
        <p className="mt-1 max-w-prose text-base text-muted-foreground md:text-lg">
          প্লট, ফ্ল্যাট অথবা জমি সম্পর্কে আরও জানতে আমাদের সঙ্গে সরাসরি যোগাযোগ করুন। আপনার তথ্য
          পাঠান, আমরা দ্রুত সময়ের মধ্যে ফোন অথবা হোয়াটসঅ্যাপে যোগাযোগ করব।
        </p>
      </header>

      <div className="mt-8 grid items-stretch gap-6 lg:mt-10 lg:grid-cols-2">
        <ContactForm />
        <CorporateOfficeMap />
      </div>
    </SectionLayout>
  );
}

function CorporateOfficeMap() {
  return (
    <div className="flex min-h-80 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex flex-col gap-2 p-4 md:p-6">
        <h3>কর্পোরেট অফিস</h3>
        <OfficeHoursStatus
          days={SITE_CONFIG.contact.hours.days}
          time={SITE_CONFIG.contact.hours.time}
          openHour={SITE_CONFIG.contact.hours.openHour}
          closeHour={SITE_CONFIG.contact.hours.closeHour}
        />
      </div>
      <div className="relative min-h-80 flex-1">
        <iframe
          title="নজরুল সিটি কর্পোরেট অফিসের মানচিত্র"
          src={SITE_CONFIG.contact.mapEmbedUrl}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
