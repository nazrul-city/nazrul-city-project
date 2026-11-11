import type { Metadata } from 'next';
import { HeroStatsForm } from '@/features/hero-stats/components/hero-stats-form';
import { getHeroStatsFormValues } from '@/features/hero-stats/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hero stats',
  description: 'Homepage hero statistics in the Nazrul City admin.',
  robots: { index: false, follow: false },
};

export default async function HeroStatsPage() {
  const defaultValues = await getHeroStatsFormValues();

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1>Hero stats</h1>
        <p className="max-w-prose text-base text-muted-foreground">
          Edit the three homepage hero numbers. Years of experience update automatically from 2020.
        </p>
      </div>
      <HeroStatsForm defaultValues={defaultValues} />
    </section>
  );
}
