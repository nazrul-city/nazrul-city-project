import { SectionLayout } from '@/components/layout';
import { FaqTabs } from '@/features/landing-page/components/faq-section/faq-tabs';

export function FaqSection() {
  return (
    <SectionLayout id="faq" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="mt-2 text-center text-balance">
          সাধারণ প্রশ্নাবলী
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-muted-foreground">
          আমাদের সার্ভিস ও সহযোগিতা সম্পর্কে সর্বাধিক জিজ্ঞাসিত কিছু প্রশ্নের উত্তর এখানে পাবেন।
        </p>
        <FaqTabs />
      </div>
    </SectionLayout>
  );
}
