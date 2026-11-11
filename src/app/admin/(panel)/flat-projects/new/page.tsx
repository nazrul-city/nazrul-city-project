import type { Metadata } from 'next';
import { FlatForm } from '@/features/flat-projects/components/flat-form';

export const metadata: Metadata = {
  title: 'New flat',
  description: 'Create a flat project.',
  robots: { index: false, follow: false },
};

export default function NewFlatPage() {
  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <h1>New flat</h1>
      <FlatForm mode="create" />
    </section>
  );
}
