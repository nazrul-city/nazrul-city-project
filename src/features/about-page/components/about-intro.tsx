import { SectionLayout } from '@/components/layout';

export function AboutIntro() {
  return (
    <SectionLayout
      aria-labelledby="about-heading"
      className="bg-background pt-24 text-foreground md:pt-28 dark:bg-background dark:text-foreground"
    >
      <div>
        <h1 id="about-heading">আমাদের সম্পর্কে</h1>
      </div>
    </SectionLayout>
  );
}
