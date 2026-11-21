import type { Metadata } from 'next';
import { FacebookReelsSection, MediaHero } from '@/features/media';
import { getPublicFacebookReels } from '@/features/media/queries';

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
  const reels = await getPublicFacebookReels();

  return (
    <div className="flex flex-col">
      <MediaHero />
      <FacebookReelsSection reels={reels} />
    </div>
  );
}
