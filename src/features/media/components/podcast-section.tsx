import { ExternalLink } from 'lucide-react';
import { SectionLayout } from '@/components/layout/section-layout';
import { SocialIcon } from '@/components/shared/social-icon';
import { buttonVariants } from '@/components/ui/button';
import { SITE_CONFIG } from '@/config/site';
import { cn } from '@/lib/utils';
import type { TPodcast } from '../types/podcast';
import { PodcastMarqueeInteractive } from './podcast-marquee-interactive';

type TPodcastSectionProps = {
  podcasts: readonly TPodcast[];
};

export function PodcastSection({ podcasts }: Readonly<TPodcastSectionProps>) {
  return (
    <SectionLayout
      id="client-podcasts"
      aria-labelledby="podcasts-heading"
      needTopPadding
      className="bg-muted/30"
    >
      {/* Section Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-1 rounded-full bg-primary md:h-7 md:w-1.5" aria-hidden="true" />
          <h2 id="podcasts-heading" className="font-extrabold tracking-tight text-foreground">
            গ্রাহক সাক্ষাৎকার ও পডকাস্ট
          </h2>
        </div>
        <p className="mt-1 text-sm font-medium text-muted-foreground md:text-base">
          নজরুল সিটিতে প্লট ও ফ্ল্যাট ক্রেতাদের বাস্তব অভিজ্ঞতা এবং বিশেষ আলোচনা
        </p>
      </div>

      {/* Marquee or Empty State */}
      {podcasts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
          <p className="text-sm md:text-base">
            শীঘ্রই আমাদের পডকাস্ট ও গ্রাহক সাক্ষাৎকার যুক্ত করা হবে।
          </p>
        </div>
      ) : (
        <PodcastMarqueeInteractive podcasts={podcasts} />
      )}

      {/* Bottom CTA to Official YouTube Channel */}
      <div className="mt-8 flex justify-center md:mt-10">
        <a
          href={SITE_CONFIG.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: 'default', size: 'default' }),
            'min-h-11 gap-2 font-semibold'
          )}
        >
          <SocialIcon name="youtube" className="size-4" />
          <span> আরও সাক্ষাৎকার দেখুন</span>
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </SectionLayout>
  );
}
