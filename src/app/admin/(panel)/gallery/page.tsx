import type { Metadata } from 'next';
import { GalleryAdminPanel } from '@/features/media/components/admin/gallery-admin-panel';
import { getAllAdminGalleryPhotos } from '@/features/media/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Photo Gallery',
  description: 'Manage photo gallery for the Media page and dedicated gallery page.',
  robots: { index: false, follow: false },
};

export default async function AdminGalleryPage() {
  const photos = await getAllAdminGalleryPhotos();

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <GalleryAdminPanel photos={photos} />
    </section>
  );
}
