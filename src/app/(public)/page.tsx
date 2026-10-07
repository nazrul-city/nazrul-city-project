import {
  ContactSection,
  FaqSection,
  HeroSection,
  HowWeWorkSection,
  PartnersSection,
  ServicesSection,
} from '@/features/landing-page';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <ServicesSection />

      <HowWeWorkSection />

      <FaqSection />

      <PartnersSection />

      <ContactSection />
    </div>
  );
}
