import { GiftIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

type TSpecialOfferBannerProps = {
  offer: string;
};

export function SpecialOfferBanner({ offer }: Readonly<TSpecialOfferBannerProps>) {
  if (offer.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-accent p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <GiftIcon aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-primary">Special Offer</p>
          <p className="text-base font-medium text-primary">সীমিত সময়ের জন্য বিশেষ ছাড়!</p>
          <p className="text-base">{offer}</p>
        </div>
      </div>
      <Link
        href="/#contact"
        className={buttonVariants({
          variant: 'outline',
          className: 'w-full border-primary text-primary md:w-auto',
        })}
      >
        বিস্তারিত জানুন
      </Link>
    </section>
  );
}
