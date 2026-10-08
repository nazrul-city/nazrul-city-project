import { SectionLayout } from '@/components/layout';
import { Marquee } from '@/components/shared/marquee';
import { PartnerLogo } from '@/features/landing-page/components/partners-section/partner-logo';
import { PARTNERS } from '@/features/landing-page/constants/partners';
import { cn } from '@/lib/utils';

const MARQUEE_EDGE_FADE =
  '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]';

export function PartnersSection() {
  return (
    <SectionLayout id="partners" aria-labelledby="partners-heading">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <p className="text-sm font-medium text-muted-foreground">পার্টনারস</p>
        <h2 id="partners-heading" className="mt-2">
          আমরা যেসব প্রতিষ্ঠানের সাথে কাজ করি
        </h2>
      </div>

      <div className="mt-8 md:mt-10">
        <Marquee
          speed={40}
          gap={72}
          pauseOnHover={false}
          className={cn('motion-reduce:hidden', MARQUEE_EDGE_FADE)}
        >
          {PARTNERS.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </Marquee>

        <ul className="sr-only mx-auto max-w-6xl px-4 motion-reduce:not-sr-only motion-reduce:flex motion-reduce:flex-wrap motion-reduce:items-center motion-reduce:justify-center motion-reduce:gap-x-18 motion-reduce:gap-y-6 md:px-6 lg:px-8">
          {PARTNERS.map((partner) => (
            <li key={partner.id}>
              <PartnerLogo partner={partner} />
            </li>
          ))}
        </ul>
      </div>
    </SectionLayout>
  );
}
