export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-24 px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="flex min-h-[50vh] flex-col items-start justify-center gap-4 pt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3.5 py-1 text-xs text-muted-foreground">
          <span>Land, plots, and flats — buy &amp; sell</span>
        </div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Find or sell property with Nazrul City.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Welcome to Nazrul City. স্বাগতম. We buy and sell land, plots, and flats (units) with clear
          terms and a straightforward process.
        </p>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="flex min-h-[380px] scroll-mt-24 flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs sm:p-12"
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight">About Nazrul City</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Nazrul City is a real estate business. We help buyers and sellers complete deals on land,
          residential plots, and apartment flats or units. Our focus is honest pricing, verified
          papers, and a deal you can follow from first visit to handover.
        </p>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="flex min-h-[380px] scroll-mt-24 flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs sm:p-12"
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight">What we buy &amp; sell</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Land for development or holding, plotted land for homes, and ready or upcoming flats and
          units. Tell us what you need — we match buyers and sellers and handle the transaction
          steps with you.
        </p>
      </section>

      {/* Listings Section */}
      <section
        id="listings"
        className="flex min-h-[380px] scroll-mt-24 flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs sm:p-12"
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight">Current listings</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Featured land, plots, and flats will appear here. If you want to list a property or see
          what is available now, use the contact section and we will share matching options.
        </p>
      </section>

      {/* How we work Section */}
      <section
        id="how-we-work"
        className="flex min-h-[380px] scroll-mt-24 flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs sm:p-12"
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight">How we work</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Share what you want to buy or sell. We review the property and papers, agree terms, and
          walk you through payment and transfer until the deal is complete.
        </p>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="mb-24 flex min-h-[380px] scroll-mt-24 flex-col justify-center rounded-2xl border border-border/50 bg-card p-8 shadow-xs sm:p-12"
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight">Get in touch</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Buying land, a plot, or a flat — or ready to sell? Send a message and we will follow up
          with next steps.
        </p>
      </section>
    </div>
  );
}
