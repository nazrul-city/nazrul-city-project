import type { Metadata } from 'next';
import { PlotForm } from '@/features/land-projects/components/plot-form';

export const metadata: Metadata = {
  title: 'New plot',
  description: 'Create a land project.',
  robots: { index: false, follow: false },
};

export default function NewPlotPage() {
  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <h1>New plot</h1>
      <PlotForm mode="create" />
    </section>
  );
}
