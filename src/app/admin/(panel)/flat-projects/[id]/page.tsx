import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FlatForm } from '@/features/flat-projects/components/flat-form';
import { getFlatFormValues } from '@/features/flat-projects/queries';

export const metadata: Metadata = {
  title: 'Edit flat',
  description: 'Edit a flat project.',
  robots: { index: false, follow: false },
};

type TEditFlatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditFlatPage({ params }: Readonly<TEditFlatPageProps>) {
  const { id } = await params;
  const flat = await getFlatFormValues(id);

  if (!flat) {
    notFound();
  }

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <h1>Edit flat</h1>
      <FlatForm mode="edit" flatId={flat.id} defaultValues={flat.values} />
    </section>
  );
}
