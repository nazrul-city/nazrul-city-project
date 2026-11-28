import { PageCtaSection, type TPageCtaLink } from '@/components/shared/page-cta-section';
import { resolvePublicHref } from '@/utils/public-href';

const MEDIA_CTA_LINKS = [
  {
    id: 'contact',
    href: resolvePublicHref('#contact', false),
    label: 'যোগাযোগ করুন',
    variant: 'default',
  },
  {
    id: 'plots',
    href: '/plots',
    label: 'প্লটসমূহ দেখুন',
    variant: 'outline',
  },
] as const satisfies readonly TPageCtaLink[];

export function MediaCtaSection() {
  return (
    <PageCtaSection
      id="media-cta"
      headingId="media-cta-heading"
      heading="সরাসরি প্রজেক্ট ভিজিট বা পরামর্শের জন্য যোগাযোগ করুন"
      description="আমাদের কার্যক্রম ও গ্রাহকদের অভিজ্ঞতা তো দেখলেন—এবার নিজ চোখে প্রজেক্ট দেখে সিদ্ধান্ত নিন। জমি, ফ্ল্যাট কিংবা কিস্তি সুবিধা সম্পর্কে জানতে আজই কথা বলুন আমাদের সাথে।"
      links={MEDIA_CTA_LINKS}
      needTopPadding
    />
  );
}
