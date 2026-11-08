import {
  ContactSection,
  FaqSection,
  HeroSection,
  HowWeWorkSection,
  PartnersSection,
  ServicesSection,
  buildHeroStatItems,
} from '@/features/landing-page';
import { getFeaturedHeroProject } from '@/features/landing-page/queries';
import { getHeroStats, readYearsSinceFounding } from '@/features/hero-stats';
import { getSiteNotice } from '@/features/site-notice/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [propertyCard, marqueeNotice, heroStats] = await Promise.all([
    getFeaturedHeroProject(),
    getSiteNotice(),
    getHeroStats(),
  ]);

  const stats = buildHeroStatItems({
    ...heroStats,
    yearsSinceFounding: readYearsSinceFounding(),
  });

  return (
    <div className="flex flex-col">
      <HeroSection propertyCard={propertyCard} marqueeNotice={marqueeNotice} stats={stats} />

      <ServicesSection />

      <HowWeWorkSection />

      <FaqSection />

      <PartnersSection />

      <ContactSection />
    </div>
  );
}
