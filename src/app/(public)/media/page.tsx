import type { Metadata } from 'next';
import { FacebookReelsSection, MediaHero, PhotoGallerySection } from '@/features/media';
import { getGalleryPreviewPhotos, getPublicFacebookReels } from '@/features/media/queries';

const MEDIA_BREADCRUMB = [{ label: 'হোম', href: '/' }, { label: 'মিডিয়া' }] as const;

export const metadata: Metadata = {
  title: 'মিডিয়া ও কার্যক্রম | নজরুল সিটি',
  description:
    'নজরুল সিটির সাম্প্রতিক কার্যক্রম, গ্রাহকদের সন্তুষ্টির অভিজ্ঞতা, ফেসবুক রিলস এবং প্রজেক্টের ছবির গ্যালারি।',
  openGraph: {
    title: 'মিডিয়া ও কার্যক্রম | নজরুল সিটি',
    description:
      'নজরুল সিটির সাম্প্রতিক কার্যক্রম, গ্রাহকদের সন্তুষ্টির অভিজ্ঞতা, ফেসবুক রিলস এবং প্রজেক্টের ছবির গ্যালারি।',
  },
};

export default async function MediaPage() {
  const [reels, previewPhotos] = await Promise.all([
    getPublicFacebookReels(),
    getGalleryPreviewPhotos(),
  ]);

  return (
    <div className="flex flex-col">
      <MediaHero breadcrumbs={MEDIA_BREADCRUMB} />
      <FacebookReelsSection reels={reels} />
      <PhotoGallerySection photos={previewPhotos} />
    </div>
  );
}
