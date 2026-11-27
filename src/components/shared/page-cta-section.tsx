import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionLayout } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type TPageCtaLink = {
  id: string;
  href: string;
  label: string;
  variant: 'default' | 'secondary' | 'outline';
};

type TPageCtaSectionProps = {
  id: string;
  headingId: string;
  heading: string;
  description: string;
  links: readonly TPageCtaLink[];
  needTopPadding?: boolean;
};

/**
 * Reusable bottom-of-page CTA banner matching the AboutCtaSection design system.
 */
export function PageCtaSection({
  id,
  headingId,
  heading,
  description,
  links,
  needTopPadding = false,
}: Readonly<TPageCtaSectionProps>) {
  return (
    <SectionLayout id={id} aria-labelledby={headingId} needTopPadding={needTopPadding}>
      <div className="flex flex-col gap-6 rounded-md bg-accent p-6 md:flex-row md:items-center md:justify-between md:gap-10 md:p-8">
        <div className="max-w-prose">
          <h2 id={headingId} className="text-balance text-foreground">
            {heading}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-accent-foreground">{description}</p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 md:w-auto md:flex-row">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                buttonVariants({ variant: link.variant }),
                'min-h-11 w-full gap-2 font-semibold md:w-auto'
              )}
            >
              <span>{link.label}</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
