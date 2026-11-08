import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PlotForm } from '@/features/land-projects/components/plot-form';
import { getPlotFormValues } from '@/features/land-projects/queries';

export const metadata: Metadata = {
  title: 'Edit plot',
  description: 'Edit a land project.',
  robots: { index: false, follow: false },
};

type TEditPlotPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPlotPage({ params }: Readonly<TEditPlotPageProps>) {
  const { id } = await params;
  const plot = await getPlotFormValues(id);

  if (!plot) {
    notFound();
  }

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <h1>Edit plot</h1>
      <PlotForm mode="edit" plotId={plot.id} defaultValues={plot.values} />
    </section>
  );
}
