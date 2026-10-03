import { SectionLayout } from '@/components/layout';
import { FaqTabs } from '@/features/landing-page/components/faq-section/faq-tabs';

export function FaqSection() {
  return (
    <SectionLayout id="faq" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="mt-2 text-center text-balance">
          FAQ
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-muted-foreground">
          Find answers to common questions about our services and how we can help you.
        </p>
        <FaqTabs />
      </div>
    </SectionLayout>
  );
}
