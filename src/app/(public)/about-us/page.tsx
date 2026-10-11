import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/shared/page-breadcrumb';
import { SITE_CONFIG } from '@/config/site';
import { AboutContent, AboutIntro, MissionVisionSection } from '@/features/about-page';

const ABOUT_BREADCRUMB = [{ label: 'হোম', href: '/' }, { label: 'আমাদের সম্পর্কে' }] as const;

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে',
  description: SITE_CONFIG.description,
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <PageBreadcrumb items={ABOUT_BREADCRUMB} />

      <AboutIntro />
      <MissionVisionSection />
      <AboutContent />
    </div>
  );
}
