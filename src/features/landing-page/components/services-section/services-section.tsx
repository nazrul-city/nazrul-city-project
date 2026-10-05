import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionLayout } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { SERVICES } from '@/features/landing-page/constants/services';
import { cn } from '@/lib/utils';

export function ServicesSection() {
  return (
    <SectionLayout id="services" aria-labelledby="services-heading" needTopPadding>
      <h2 id="services-heading" className="text-center text-balance">
        আমাদের সেবা
      </h2>

      <div className="mx-auto mt-3 max-w-prose text-center">
        <p className="text-lg text-muted-foreground">
          নজরুল সিটিতে আপনি যেসব সেবা পাবেন — প্লট কেনা, রেজিস্ট্রি, নামজারি, দলিল, খাজনা প্রদানসহ
          আরও অনেক কিছু এক জায়গায়।
        </p>
      </div>

      <ul className="mt-8 grid list-none grid-cols-1 items-stretch gap-6 md:mt-10 md:grid-cols-2">
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </ul>
    </SectionLayout>
  );
}

type TServiceCardProps = {
  service: (typeof SERVICES)[number];
};

function ServiceCard({ service }: Readonly<TServiceCardProps>) {
  return (
    <li className="flex min-w-0">
      <Card className="h-full w-full gap-0 rounded-md border border-border/50 py-0 shadow-md ring-0">
        <div className="p-4 pb-0 md:p-6 md:pb-0">
          <div className="relative aspect-4/3 overflow-hidden rounded-md">
            <Image
              src={service.imageSrc}
              alt={service.imageAlt}
              fill
              sizes="(min-width: 768px) 36rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <CardHeader className="relative flex flex-1 flex-col items-start gap-2 overflow-hidden rounded-none p-4 md:p-6">
          <h3 className="relative z-10 text-balance">{service.title}</h3>
          <CardDescription className="relative z-10 text-base leading-relaxed">
            {service.description}
          </CardDescription>
          <Link
            href={service.ctaLink}
            className={cn(buttonVariants({ size: 'sm' }), 'relative z-10 mt-auto gap-1.5')}
          >
            {service.ctaText}
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <ServiceCardAccent />
        </CardHeader>
      </Card>
    </li>
  );
}

function ServiceCardAccent() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-16 size-40">
      <span className="absolute inset-0 rounded-full bg-primary/10" />
      <span className="absolute inset-6 rounded-full bg-primary/20" />
      <span className="absolute inset-12 rounded-full bg-primary/10" />
    </span>
  );
}
