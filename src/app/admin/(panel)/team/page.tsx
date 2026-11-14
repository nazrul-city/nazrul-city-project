import type { Metadata } from 'next';
import { getTeamImages, TeamAdminPanel } from '@/features/team-images';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Team photos',
  description: 'Manage the team carousel on the About page.',
  robots: { index: false, follow: false },
};

export default async function TeamPage() {
  const images = await getTeamImages();

  return (
    <section className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1>Team photos</h1>
        <p className="max-w-prose text-base text-muted-foreground">
          Upload up to 20 team photos. They appear as an auto-playing carousel on the About page.
          Enter a caption, then pick a file — it uploads immediately.
        </p>
      </div>

      <TeamAdminPanel images={images} />
    </section>
  );
}
