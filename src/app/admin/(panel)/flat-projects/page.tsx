import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { FlatAdminList } from '@/features/flat-projects/components/flat-admin-list';
import { listAdminFlats } from '@/features/flat-projects/queries';
import { readActiveAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Flat projects',
  description: 'Flat projects in the Nazrul City admin.',
  robots: { index: false, follow: false },
};

export default async function FlatProjectsPage() {
  const [admin, flats] = await Promise.all([readActiveAdmin(), listAdminFlats()]);

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1>Flat projects</h1>
        <Link
          href="/admin/flat-projects/new"
          className={buttonVariants({ className: 'w-full md:w-auto' })}
        >
          New flat
        </Link>
      </div>
      <FlatAdminList flats={flats} canDelete={admin?.role === 'SUPER_ADMIN'} />
    </section>
  );
}
