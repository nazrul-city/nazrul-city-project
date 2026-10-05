import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionLayout } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';
import { SITE_CONFIG } from '@/config/site';
import { HOW_WE_WORK_STEPS } from '@/features/landing-page/constants/how-we-work';
import { cn } from '@/lib/utils';

const CONTACT_PHONE = SITE_CONFIG.contact.phones[0];

export function HowWeWorkSection() {
  return (
    <SectionLayout id="how-we-work" aria-labelledby="how-we-work-heading">
      <div className="mx-auto max-w-3xl">
        <h2 id="how-we-work-heading" className="text-center text-balance">
          নজরুল সিটি কিভাবে কাজ করে ?
        </h2>
        <p className="mx-auto mt-2 max-w-prose text-center text-base text-muted-foreground">
          জমি, প্লট ও ফ্ল্যাট — প্রথম যোগাযোগ থেকে দখল বুঝিয়ে দেওয়া পর্যন্ত।
        </p>

        <ol className="mt-8 list-none lg:mt-10">
          {HOW_WE_WORK_STEPS.map((step, index) => (
            <HowWeWorkStep
              key={step.id}
              step={step}
              stepNumber={String(index + 1).padStart(2, '0')}
              isLast={index === HOW_WE_WORK_STEPS.length - 1}
            />
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-center gap-2 lg:mt-10">
          <Link href="#contact" className={cn(buttonVariants(), 'gap-1.5')}>
            Contact us
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <p className="text-sm text-muted-foreground">
            Or call{' '}
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="rounded-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {CONTACT_PHONE}
            </a>
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}

type THowWeWorkStepProps = {
  step: (typeof HOW_WE_WORK_STEPS)[number];
  stepNumber: string;
  isLast: boolean;
};

function HowWeWorkStep({ step, stepNumber, isLast }: Readonly<THowWeWorkStepProps>) {
  return (
    <li className="flex gap-4">
      <div className="flex w-9 shrink-0 flex-col items-center self-stretch">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary-foreground tabular-nums">
          {stepNumber}
        </span>
        {isLast ? null : <span aria-hidden="true" className="w-px flex-1 bg-border" />}
      </div>
      <div className={cn('min-w-0', !isLast && 'pb-6')}>
        <h4 className="text-balance">{step.title}</h4>
        <p className="mt-1 text-base leading-relaxed text-muted-foreground">{step.body}</p>
      </div>
    </li>
  );
}
