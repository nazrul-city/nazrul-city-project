import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { PlotAdminList } from '@/features/land-projects/components/plot-admin-list';
import { listAdminPlots } from '@/features/land-projects/queries';
import { readActiveAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Land projects',
  description: 'Land projects in the Nazrul City admin.',
  robots: { index: false, follow: false },
};

export default async function LandProjectsPage() {
  const [admin, plots] = await Promise.all([readActiveAdmin(), listAdminPlots()]);

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1>Land projects</h1>
        <Link
          href="/admin/land-projects/new"
          className={buttonVariants({ className: 'w-full md:w-auto' })}
        >
          New plot
        </Link>
      </div>
      <PlotAdminList plots={plots} canDelete={admin?.role === 'SUPER_ADMIN'} />
    </section>
  );
}
