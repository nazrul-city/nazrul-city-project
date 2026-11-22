import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionLayout } from '@/components/layout/section-layout';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TGalleryPhoto } from '../types/gallery-photo';
import { PhotoGalleryInteractive } from './photo-gallery-interactive';

type TPhotoGallerySectionProps = {
  photos: readonly TGalleryPhoto[];
};

export function PhotoGallerySection({ photos }: Readonly<TPhotoGallerySectionProps>) {
  return (
    <SectionLayout id="photo-gallery" needTopPadding aria-labelledby="gallery-heading">
      {/* Section Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-1 rounded-full bg-primary md:h-7 md:w-1.5" aria-hidden="true" />
            <h2 id="gallery-heading" className="font-extrabold tracking-tight text-foreground">
              ফটোগ্যালারি
            </h2>
          </div>
          <p className="mt-1 text-sm font-medium text-muted-foreground md:text-base">
            আমাদের মাঠপর্যায়ের কার্যক্রম, দলিল হস্তান্তর ও গ্রাহকদের বাস্তব মুহূর্তসমূহ
          </p>
        </div>
      </div>

      {/* Interactive Category Tabs + Photo Grid + Lightbox */}
      <PhotoGalleryInteractive photos={photos} />

      {/* Centered "সকল ছবি দেখুন" CTA Button */}
      <div className="mt-8 flex justify-center md:mt-10">
        <Link
          href="/media/gallery"
          className={cn(
            buttonVariants({ variant: 'default', size: 'default' }),
            'gap-2 font-semibold'
          )}
        >
          <span>সকল ছবি দেখুন</span>
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </SectionLayout>
  );
}
