import type { Metadata } from 'next';
import { ReelAdminPanel } from '@/features/media/components/admin/reel-admin-panel';
import { getAllFacebookReels } from '@/features/media/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Facebook Reels',
  description: 'Manage top Facebook Reels for the Media page.',
  robots: { index: false, follow: false },
};

export default async function AdminFacebookReelsPage() {
  const reels = await getAllFacebookReels();

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <ReelAdminPanel reels={reels} />
    </section>
  );
}
