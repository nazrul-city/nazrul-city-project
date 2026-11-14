import { SectionLayout } from '@/components/layout';
import { getTeamImages } from '@/features/team-images';
import { TeamCarousel } from './team-carousel';

export async function TeamSection() {
  const images = await getTeamImages();

  if (images.length === 0) {
    return null;
  }

  return (
    <SectionLayout aria-labelledby="team-heading">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 id="team-heading">আমাদের টিম</h2>
      </div>

      <TeamCarousel images={images} />
    </SectionLayout>
  );
}
