import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { AboutContent, AboutIntro, MissionVisionSection } from '@/features/about-page';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে',
  description: SITE_CONFIG.description,
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutIntro />
      <MissionVisionSection />
      <AboutContent />
    </div>
  );
}
