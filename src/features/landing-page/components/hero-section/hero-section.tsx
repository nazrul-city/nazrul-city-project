import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FeaturedHeroCard,
  type TFeaturedHeroCardProps,
} from '@/features/landing-page/components/hero-section/featured-hero-card';
import { HeroStats, type THeroStatItem } from './hero-stats';
import { Marquee } from '@/components/shared/marquee';
import type { TSiteNotice } from '@/features/site-notice/queries';

export type THeroPropertyCard = TFeaturedHeroCardProps;

export type THeroSectionProps = {
  backgroundImageSrc?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  propertyCard?: THeroPropertyCard | null;
  marqueeNotice?: TSiteNotice | null;
  stats?: readonly THeroStatItem[];
  showStats?: boolean;
  className?: string;
};

export function HeroSection({
  backgroundImageSrc = '/images/landing-page/hero-bg.jpeg',
  eyebrow = 'প্লট, ফ্ল্যাট ও জমি',
  title = 'এমন একটি জায়গা খুঁজে নিন যা বাড়ির মতো মনে হয়।',
  description = 'স্বচ্ছ মূল্য নির্ধারণ, যাচাইকৃত দলিল এবং প্রথম পরিদর্শন থেকে হস্তান্তর পর্যন্ত একটি নির্বিঘ্ন প্রক্রিয়া। আত্মবিশ্বাসের সাথে প্রধান আবাসিক প্লট এবং প্রিমিয়াম ইউনিটে বিনিয়োগ করুন।',
  ctaText = 'জমি ও ফ্ল্যাট দেখুন',
  ctaHref = '#services',
  propertyCard = null,
  marqueeNotice = null,
  stats,
  showStats = true,
  className,
}: THeroSectionProps) {
  const showMarquee =
    marqueeNotice !== null && marqueeNotice.isEnabled && marqueeNotice.message.trim().length > 0;

  return (
    <div className="relative">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className={cn(
          'relative flex min-h-[88vh] w-full items-center overflow-hidden bg-background pb-12 md:min-h-[92vh] md:pb-16 lg:min-h-[96vh] lg:pb-20',
          className
        )}
      >
        <Image
          src={backgroundImageSrc}
          alt="Nazrul City Properties Overview"
          fill
          priority
          sizes="100vw"
          className="scale-100 object-cover object-center blur-xs md:object-right"
        />

        <div
          className="absolute inset-0 bg-foreground/50 dark:bg-background/70"
          aria-hidden="true"
        />

        {showMarquee ? (
          <div className="absolute top-18 right-0 left-0 z-10 border-b border-border/20 bg-background/30 py-2.5 backdrop-blur-sm">
            <Marquee
              speed={50}
              gap={100}
              pauseOnHover
              className="text-xs font-semibold tracking-wider text-primary uppercase md:text-sm"
            >
              <p>{marqueeNotice.message.trim()}</p>
            </Marquee>
          </div>
        ) : null}

        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-between gap-10 px-4 pt-32 pb-20 md:flex-row md:items-end md:gap-8 md:px-6 md:pt-36 md:pb-24 lg:px-8 lg:pt-40 lg:pb-28">
          <div className="flex max-w-2xl flex-col items-start gap-5 md:max-w-xl lg:max-w-2xl">
            {eyebrow ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-medium text-foreground shadow-xs backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary/70" />
                </span>
                <span>{eyebrow}</span>
              </div>
            ) : null}

            <h1
              id="hero-heading"
              className="font-heading text-3xl leading-[1.12] font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              {title}
            </h1>

            {description ? (
              <p className="max-w-xl text-base leading-relaxed text-foreground text-white md:text-lg">
                {description}
              </p>
            ) : null}

            <div className="pt-2">
              <Link
                href={ctaHref}
                className={cn(
                  buttonVariants({
                    className:
                      'group h-11 gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] md:h-13 md:gap-2 md:rounded-xl md:px-6 md:text-base md:shadow-lg',
                  })
                )}
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:size-4" />
              </Link>
            </div>
          </div>

          {propertyCard ? <FeaturedHeroCard {...propertyCard} /> : null}
        </div>
      </section>

      {showStats ? (
        <div className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 md:-mt-14 md:px-6 lg:-mt-16 lg:px-8">
          <HeroStats stats={stats} />
        </div>
      ) : null}
    </div>
  );
}
