import Image from 'next/image';
import { CircleCheck, Eye, Flag } from 'lucide-react';
import { SectionLayout } from '@/components/layout';
import { cn } from '@/lib/utils';

const MISSION_IMAGE = {
  src: '/images/about-page/mission-vision/mission.avif',
  alt: 'হাতে তুলে ধরা বাড়ি, পেছনে শহর',
} as const;

const VISION_IMAGE = {
  src: '/images/about-page/mission-vision/vision.png',
  alt: 'হাতের তালুতে গড়ে ওঠা শহর',
} as const;

const VISION_POINTS = [
  { id: 'visit', label: 'সরেজমিন দেখে সিদ্ধান্ত' },
  { id: 'price', label: 'দাম আগে, তারপর দলিল' },
] as const;

export function MissionVisionSection() {
  return (
    <SectionLayout aria-label="মিশন ও ভিশন">
      <div className="grid gap-4 md:grid-cols-5 md:gap-5">
        <article className="relative overflow-hidden rounded-lg bg-foreground p-6 text-background md:col-span-3 md:p-8 dark:bg-foreground dark:text-background">
          <CardBackdrop
            src={MISSION_IMAGE.src}
            imageClassName="object-[center_60%]"
            overlayClassName="bg-foreground/80 dark:bg-foreground/90"
          />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Flag className="size-6" aria-hidden="true" />
              <h2 className="text-balance">মিশন</h2>
            </div>
            <p className="max-w-prose text-base leading-relaxed text-background/80 dark:text-background/80">
              নজরুল সিটি ময়মনসিংহে জমি, প্লট ও ফ্ল্যাট সৎ দামে এবং খোলা কাগজপত্রসহ ক্রেতার হাতে
              তুলে দেয়। কেনার আগে জায়গা দেখা যায়। দলিল, খতিয়ান ও নামজারি অফিসে খোলা হয়।
            </p>
            <p className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-background/30 px-3 py-2 text-sm font-medium dark:border-background/30">
              <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
              প্রতিটি কেনা-বেচায় খোলা কাগজ
            </p>
          </div>
        </article>

        <AboutMedia
          src={MISSION_IMAGE.src}
          alt={MISSION_IMAGE.alt}
          sizes="(min-width: 768px) 40vw, 100vw"
        />

        <AboutMedia
          src={VISION_IMAGE.src}
          alt={VISION_IMAGE.alt}
          sizes="(min-width: 768px) 40vw, 100vw"
          imageClassName="object-contain"
          className="bg-foreground dark:bg-card"
        />

        <article className="relative overflow-hidden rounded-lg bg-secondary p-6 text-primary-foreground md:col-span-3 md:p-8 dark:bg-secondary/70">
          <CardBackdrop
            src={VISION_IMAGE.src}
            overlayClassName="bg-secondary/85 dark:bg-secondary/85"
          />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Eye className="size-6" aria-hidden="true" />
              <h2 className="text-balance">ভিশন</h2>
            </div>
            <p className="max-w-prose text-base leading-relaxed text-primary-foreground/85">
              ময়মনসিংহে জমি কেনা হবে দেখে ও জেনে। ক্রেতা ভয়ে নয়, কাগজ দেখে মালিক হবেন। একটি
              পরিবারের ঘর হবে শান্তির ঘাঁটি।
            </p>
            <ul className="mt-auto flex list-none flex-col gap-3">
              {VISION_POINTS.map((point) => (
                <li key={point.id} className="flex items-center gap-2 text-base">
                  <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
                  <span>{point.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </SectionLayout>
  );
}

type TCardBackdropProps = {
  src: string;
  overlayClassName: string;
  imageClassName?: string;
};

function CardBackdrop({ src, overlayClassName, imageClassName }: Readonly<TCardBackdropProps>) {
  return (
    <div className="absolute inset-0 md:hidden" aria-hidden="true">
      <Image src={src} alt="" fill sizes="100vw" className={cn('object-cover', imageClassName)} />
      <div className={cn('absolute inset-0', overlayClassName)} />
    </div>
  );
}

type TAboutMediaProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
};

function AboutMedia({ src, alt, sizes, className, imageClassName }: Readonly<TAboutMediaProps>) {
  return (
    <div className="relative hidden min-h-64 md:col-span-2 md:block">
      <div
        className={cn(
          'relative min-h-64 overflow-hidden rounded-lg md:absolute md:inset-0 md:min-h-0',
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn('object-cover object-[center_60%]', imageClassName)}
        />
      </div>
    </div>
  );
}
