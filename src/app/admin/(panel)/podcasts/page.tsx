import type { Metadata } from 'next';
import { PodcastAdminPanel } from '@/features/media/components/admin/podcast-admin-panel';
import { getAllAdminPodcasts } from '@/features/media/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'পডকাস্ট ও সাক্ষাৎকার | অ্যাডমিন প্যানেল',
  description: 'Manage client podcasts and video interviews for the Media page.',
  robots: { index: false, follow: false },
};

export default async function AdminPodcastsPage() {
  const podcasts = await getAllAdminPodcasts();

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PodcastAdminPanel podcasts={podcasts} />
    </section>
  );
}
