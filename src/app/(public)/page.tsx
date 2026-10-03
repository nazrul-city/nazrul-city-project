import { SectionLayout } from '@/components/layout';
import { FaqSection, HeroSection, PartnersSection } from '@/features/landing-page';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section (Full-Bleed) */}
      <HeroSection />

      <FaqSection />

      <PartnersSection />

      {/* About Section */}
      <SectionLayout id="about">
        <div className="flex min-h-[320px] flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs md:p-12">
          <h2 className="font-heading text-3xl font-bold tracking-tight">About Nazrul City</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Nazrul City is a real estate business. We help buyers and sellers complete deals on
            land, residential plots, and apartment flats or units. Our focus is honest pricing,
            verified papers, and a deal you can follow from first visit to handover.
          </p>
        </div>
      </SectionLayout>

      {/* Services Section */}
      <SectionLayout id="services">
        <div className="flex min-h-[320px] flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs md:p-12">
          <h2 className="font-heading text-3xl font-bold tracking-tight">What we buy &amp; sell</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Land for development or holding, plotted land for homes, and ready or upcoming flats and
            units. Tell us what you need — we match buyers and sellers and handle the transaction
            steps with you.
          </p>
        </div>
      </SectionLayout>

      {/* Listings Section */}
      <SectionLayout id="listings">
        <div className="flex min-h-[320px] flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs md:p-12">
          <h2 className="font-heading text-3xl font-bold tracking-tight">Current listings</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Featured land, plots, and flats will appear here. If you want to list a property or see
            what is available now, use the contact section and we will share matching options.
          </p>
        </div>
      </SectionLayout>

      {/* How we work Section */}
      <SectionLayout id="how-we-work">
        <div className="flex min-h-[320px] flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs md:p-12">
          <h2 className="font-heading text-3xl font-bold tracking-tight">How we work</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Share what you want to buy or sell. We review the property and papers, agree terms, and
            walk you through payment and transfer until the deal is complete.
          </p>
        </div>
      </SectionLayout>

      {/* Contact Section */}
      <SectionLayout id="contact">
        <div className="flex min-h-[320px] flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs md:p-12">
          <h2 className="font-heading text-3xl font-bold tracking-tight">Get in touch</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Buying land, a plot, or a flat — or ready to sell? Send a message and we will follow up
            with next steps.
          </p>
        </div>
      </SectionLayout>
    </div>
  );
}
