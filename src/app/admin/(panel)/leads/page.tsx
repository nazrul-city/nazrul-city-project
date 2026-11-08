import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leads',
  description: 'Leads in the Nazrul City admin.',
  robots: { index: false, follow: false },
};

export default function LeadsPage() {
  return (
    <div className="flex flex-1 flex-col gap-2 p-4">
      <h1>Leads....</h1>
    </div>
  );
}
