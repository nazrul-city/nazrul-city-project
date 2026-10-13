import Link from 'next/link';
import { SectionLayout } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { resolvePublicHref } from '@/utils/public-href';
import { ArrowUpRight } from 'lucide-react';

const CTA_LINKS = [
  // {
  //   id: 'projects',
  //   href: resolvePublicHref('#projects', false),
  //   label: 'প্লট ও ফ্ল্যাট দেখুন',
  //   variant: 'default',
  // },
  {
    id: 'contact',
    href: resolvePublicHref('#contact', false),
    label: 'যোগাযোগ করুন',
    variant: 'default',
  },
] as const;

export function AboutCtaSection() {
  return (
    <SectionLayout id="about-cta" aria-labelledby="about-cta-heading">
      <div className="flex flex-col gap-6 rounded-md bg-accent p-6 md:flex-row md:items-center md:justify-between md:gap-10 md:p-8">
        <div className="max-w-prose">
          <h2 id="about-cta-heading" className="text-balance text-foreground">
            আপনার স্বপ্নের বাড়ি পেতে আমাদের সাথে যোগাযোগ করুন
          </h2>
          <p className="mt-2 text-base leading-relaxed text-accent-foreground">
            জমি, ফ্ল্যাট, অথবা বিনিয়োগ—আপনার যেকোনো রিয়েল এস্টেট চাহিদায় আমরা আছি পাশে।
            নির্ভরযোগ্য পরামর্শ, সহজ প্রক্রিয়া এবং ব্যক্তিগত সমাধান জানতে আজই আমাদের সাথে যোগাযোগ
            করুন।
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          {CTA_LINKS.map((link) => (
            <CtaLink key={link.id} href={link.href} label={link.label} variant={link.variant} />
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}

type TCtaLinkProps = {
  href: string;
  label: string;
  variant: 'default' | 'secondary';
};

function CtaLink({ href, label, variant }: Readonly<TCtaLinkProps>) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant }), 'w-full md:w-auto')}>
      {label}
      <ArrowUpRight className="size-4" />
    </Link>
  );
}
