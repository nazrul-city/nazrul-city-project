import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { SocialIcon, type TSocialIcon } from '@/components/shared/social-icon';
import { buttonVariants } from '@/components/ui/button';
import { PUBLIC_NAV_ITEMS, SITE_CONFIG } from '@/config/site';
import { cn } from '@/lib/utils';
import { resolvePublicHref } from '@/utils/public-href';

type TFooterProps = {
  className?: string;
};

const SOCIAL_LINKS_DUMMY_DATA = [
  {
    label: 'Facebook',
    href: SITE_CONFIG.social.facebook,
    icon: 'facebook',
  },
  {
    label: 'Instagram',
    href: SITE_CONFIG.social.instagram,
    icon: 'instagram',
  },
  {
    label: 'YouTube',
    href: SITE_CONFIG.social.youtube,
    icon: 'youtube',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${SITE_CONFIG.contact.whatsapp}`,
    icon: 'whatsapp',
  },
] as const satisfies readonly {
  label: string;
  href: string;
  icon: TSocialIcon;
}[];

const LEGAL_LINKS = [
  { label: 'গোপনীয়তা নীতি', href: '#' },
  { label: 'নীতিমালা', href: '#' },
] as const;

export function Footer({ className }: Readonly<TFooterProps>) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn('w-full rounded-t-3xl border-t border-border/50 bg-muted', className)}>
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="group flex w-fit items-center gap-2.5 text-foreground transition-opacity hover:opacity-90"
            >
              <span className="flex size-12 items-center justify-center rounded-lg p-0.5 shadow-xs transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/images/nc-logo.png"
                  alt="Nazrul City Logo"
                  className="hidden h-10 w-10 object-contain dark:block"
                  width={32}
                  height={32}
                />
                <Image
                  src="/images/nc-logo-dark.png"
                  alt="Nazrul City Logo"
                  className="block h-10 w-10 object-contain dark:hidden"
                  width={32}
                  height={32}
                />
              </span>
              <span className="flex flex-col">
                <span className="font-heading text-base font-bold tracking-tight text-foreground">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-xs font-semibold text-foreground">{SITE_CONFIG.tagline}</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
            <Link
              href="/projects"
              className={cn(buttonVariants({ size: 'sm' }), 'mt-1 w-fit gap-1.5')}
            >
              <span>প্লট ও ফ্ল্যাট দেখুন</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <nav aria-label="Footer">
            <h3>মেনু</h3>

            <ul className="mt-4 flex flex-col gap-1">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={resolvePublicHref(item.href, false)}
                    className="inline-flex items-center py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3>যোগাযোগ </h3>
            <ul className="mt-4 flex flex-col gap-1">
              {SITE_CONFIG.contact.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone}`}
                    aria-label={`Call ${phone}`}
                    className="inline-flex items-center gap-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Phone className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  aria-label={`Email ${SITE_CONFIG.contact.email}`}
                  className="inline-flex items-center gap-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{SITE_CONFIG.contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 py-1 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{SITE_CONFIG.contact.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3>অনুসরণ করুন</h3>

            <ul className="mt-4 flex flex-wrap gap-2">
              {SOCIAL_LINKS_DUMMY_DATA.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={item.label}
                    className="inline-flex size-11 items-center justify-center rounded-md border border-border/50 text-primary transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <SocialIcon name={item.icon} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/50 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <ul className="flex items-center gap-4">
            {LEGAL_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="inline-flex items-center py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
