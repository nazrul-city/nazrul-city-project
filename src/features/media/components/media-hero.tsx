import Image from 'next/image';
import { Play } from 'lucide-react';
import { SectionLayout } from '@/components/layout';

const HERO_IMAGE = {
  src: '/images/landing-page/hero-bg.jpeg',
  alt: 'নজরুল সিটির মনোরম প্রাকৃতিক দৃশ্য ও প্রকল্প এলাকা',
} as const;

export function MediaHeroSection() {
  return (
    <div className="relative mt-14 w-full overflow-hidden bg-background">
      {/* Background Aerial Project Image */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center md:object-right"
        />
        {/* Responsive contrast gradient overlay for accessible text readability */}
        <div
          className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-background/20 dark:from-background dark:via-background/85 dark:to-background/40"
          aria-hidden="true"
        />
      </div>

      <SectionLayout
        aria-labelledby="media-hero-heading"
        className="relative z-10 pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left Column: Media Badges & Headings */}
          <div className="max-w-2xl space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs">
              <span className="flex size-4 items-center justify-center rounded-full bg-primary-foreground/20">
                <Play
                  className="size-2.5 fill-current text-primary-foreground"
                  aria-hidden="true"
                />
              </span>
              <span>মিডিয়া</span>
            </div>

            {/* Main Headline */}
            <h1 id="media-hero-heading" className="tracking-tight">
              <span className="block">আমাদের কার্যক্রম ও</span>
              <span className="block text-primary">সন্তুষ্ট গ্রাহকবৃন্দ</span>
            </h1>

            {/* Subheadings */}
            <p className="text-base font-semibold text-foreground/90 md:text-lg">
              আমাদের প্রকল্প এলাকা ও গ্রাহকদের অভিজ্ঞতা
            </p>
            <p className="text-sm font-medium tracking-wide text-muted-foreground md:text-base">
              বাস্তব মুহূর্ত · সত্যি গল্প · আগামী দিনের আস্থা
            </p>
          </div>

          {/* Right Column: Stylized Bengali Slogan */}
          <div className="flex shrink-0 items-center justify-start md:justify-end">
            <h4 className="flex -rotate-4 flex-col font-heading text-2xl font-normal tracking-wide italic drop-shadow-xs select-none md:text-3xl lg:text-4xl">
              <span>একসাথে সুন্দর</span>
              <span className="text-primary">আগামীর পথে</span>
            </h4>
          </div>
        </div>
      </SectionLayout>

      {/* Elegant Curved Bottom Divider */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden leading-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-full fill-current text-background md:h-10 lg:h-14"
          preserveAspectRatio="none"
        >
          <path d="M0,25 C480,5 960,5 1440,25 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </div>
  );
}
