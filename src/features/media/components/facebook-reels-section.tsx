import { ExternalLink } from 'lucide-react';
import { SectionLayout } from '@/components/layout/section-layout';
import { SocialIcon } from '@/components/shared/social-icon';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FACEBOOK_REELS_PAGE_URL } from '../constants';
import type { TFacebookReel } from '../types/facebook-reel';
import { ReelsInteractiveGrid } from './reels-interactive-grid';

type TFacebookReelsSectionProps = {
  reels: readonly TFacebookReel[];
};

export function FacebookReelsSection({ reels }: Readonly<TFacebookReelsSectionProps>) {
  return (
    <SectionLayout
      id="facebook-reels"
      aria-labelledby="reels-heading"
      needTopPadding
      className="bg-muted/40"
    >
      {/* Section Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-1 rounded-full bg-primary md:h-7 md:w-1.5" aria-hidden="true" />
          <h2 id="reels-heading" className="font-extrabold tracking-tight text-foreground">
            শীর্ষ ৫টি ফেসবুক রিলস
          </h2>
        </div>
        <p className="mt-1 text-sm font-medium text-muted-foreground md:text-base">
          আমাদের সর্বাধিক দেখা ৫টি রিলস
        </p>
      </div>

      {/* Grid of Reels */}
      {reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
          <p className="text-sm md:text-base">শীঘ্রই আমাদের জনপ্রিয় রিলস যুক্ত করা হবে।</p>
        </div>
      ) : (
        <ReelsInteractiveGrid reels={reels} />
      )}

      {/* Bottom CTA to Facebook Reels Page */}
      <div className="mt-8 flex justify-center md:mt-10">
        <a
          href={FACEBOOK_REELS_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: 'default', size: 'default' }),
            'min-h-11 gap-2 font-semibold'
          )}
        >
          <SocialIcon name="facebook" className="size-4" />
          <span>আরও রিলস দেখুন</span>
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </SectionLayout>
  );
}
