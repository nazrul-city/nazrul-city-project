import {
  Building2Icon,
  CheckIcon,
  CoinsIcon,
  LandmarkIcon,
  LeafIcon,
  MapIcon,
  MapPinIcon,
  MountainIcon,
  ShieldIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { ProjectImageCarousel } from '@/components/shared/project-image-carousel';
import { RichText } from '@/components/shared/rich-text';
import { SpecialOfferBanner } from '@/components/shared/special-offer-banner';
import { PlotCtaBar } from '@/features/land-projects/components/plot-cta-bar';
import { PlotDriveLink } from '@/features/land-projects/components/plot-drive-link';
import { PLOT_STATUS_OPTIONS } from '@/features/land-projects/components/plot-form-schema';
import type { getPublishedPlot } from '@/features/land-projects/queries';
import { isGoogleMapsEmbedUrl } from '@/utils/google-maps-embed';
import { readYoutubeVideoId } from '@/utils/project-listing-fields';
import { Separator } from '@/components/ui/separator';

type TPlotDetailProps = {
  plot: NonNullable<Awaited<ReturnType<typeof getPublishedPlot>>>;
};

type TPlotFactProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

function readStatusLabel(status: TPlotDetailProps['plot']['status']): string {
  return PLOT_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function toBengaliDigits(value: number): string {
  return String(value).replace(/\d/g, (digit) => {
    const bengaliDigit = BENGALI_DIGITS[Number(digit)];
    return bengaliDigit ?? digit;
  });
}

function PlotFact({ label, value, icon }: Readonly<TPlotFactProps>) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-secondary/10 p-3 text-center md:flex-row md:gap-3 md:text-left">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary md:size-11">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <dd className="text-sm font-bold md:text-base">{value}</dd>
        <dt className="text-sm text-muted-foreground md:text-base">{label}</dt>
      </div>
    </div>
  );
}

const TRUST_POINTS = [
  {
    title: '100% Legal Documentation',
    detail: 'সম্পূর্ণ বৈধ কাগজপত্র',
    icon: ShieldIcon,
  },
  {
    title: 'Modern Infrastructure',
    detail: 'আধুনিক অবকাঠামো',
    icon: Building2Icon,
  },
  {
    title: 'Green & Clean Environment',
    detail: 'সবুজ ও পরিচ্ছন্ন পরিবেশ',
    icon: LeafIcon,
  },
  {
    title: 'Long-Term Investment',
    detail: 'দীর্ঘমেয়াদী বিনিয়োগ',
    icon: TrendingUpIcon,
  },
] as const;

function PlotTrustRow() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {TRUST_POINTS.map((point) => {
        const Icon = point.icon;

        return (
          <li
            key={point.title}
            className="flex flex-col items-center gap-2 rounded-xl bg-card p-3 text-center ring-1 ring-foreground/10 md:p-4"
          >
            <Icon aria-hidden="true" className="size-6 text-primary" />
            <p className="text-sm font-medium md:text-base">{point.title}</p>
            <p className="text-sm text-muted-foreground md:text-base">{point.detail}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function PlotDetail({ plot }: Readonly<TPlotDetailProps>) {
  const statusLabel = readStatusLabel(plot.status);
  const images = plot.images.map((image) => ({
    id: image.id,
    imageUrl: image.imageUrl,
  }));
  const videoId = readYoutubeVideoId(plot.youtubeVideoUrl);
  const facilityCount = `${toBengaliDigits(plot.facilities.length)}+`;

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-8 pb-24 md:pb-8">
      {images.length > 0 ? (
        <div className="relative">
          <ProjectImageCarousel title={plot.name} images={images} />
          <p className="pointer-events-none absolute top-3 left-3 rounded-full bg-primary/50 px-3 py-1 text-base font-medium text-primary-foreground backdrop-blur-sm">
            {statusLabel}
          </p>
        </div>
      ) : null}

      <header className="flex flex-col gap-2">
        <h1>{plot.name}</h1>
        {plot.shortIntro ? <p className="text-base">{plot.shortIntro}</p> : null}
        <p className="flex items-center gap-2 text-base text-muted-foreground">
          <MapIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
          {plot.district}
        </p>
        {plot.installmentFacility ? (
          <p className="flex items-start gap-2 text-base text-muted-foreground">
            <WalletIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            {plot.installmentFacility}
          </p>
        ) : null}
      </header>

      <dl className="grid grid-cols-3 gap-3">
        <PlotFact
          label="জমির পরিমাণ"
          value={plot.landAreaSize}
          icon={<MountainIcon aria-hidden="true" className="size-5" />}
        />
        <PlotFact
          label="শতাংশ মূল্য"
          value={plot.shotangshoPrice}
          icon={<CoinsIcon aria-hidden="true" className="size-5" />}
        />
        <PlotFact
          label="সুবিধা"
          value={facilityCount}
          icon={<UsersIcon aria-hidden="true" className="size-5" />}
        />
      </dl>

      <Separator />

      <section className="flex w-full flex-col gap-3" aria-labelledby="plot-overview-title">
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-primary">প্রকল্পের পরিচিতি</p>
          <h2 id="plot-overview-title">{plot.title}</h2>
        </div>
        <RichText html={plot.description} />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {plot.facilities.length > 0 ? (
          <section className="flex flex-col gap-3">
            <h3>সুবিধা</h3>
            <ul className="flex flex-col gap-2">
              {plot.facilities.map((facility) => (
                <li key={facility} className="flex items-start gap-2 text-base">
                  <CheckIcon aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                  {facility}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="flex flex-col gap-3">
          <h3>প্রকল্পের অবস্থান</h3>
          <p className="flex items-start gap-2 text-base">
            <MapPinIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            {plot.address}
          </p>
          {plot.landmark ? (
            <p className="flex items-start gap-2 text-base text-muted-foreground">
              <LandmarkIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              {plot.landmark}
            </p>
          ) : null}
          {plot.mapEmbedLink && isGoogleMapsEmbedUrl(plot.mapEmbedLink) ? (
            <iframe
              title={`Map of ${plot.name}`}
              src={plot.mapEmbedLink}
              className="h-80 w-full rounded-xl border-0"
              loading="lazy"
            />
          ) : null}
          {plot.mapEmbedLink && !isGoogleMapsEmbedUrl(plot.mapEmbedLink) ? (
            <a
              href={plot.mapEmbedLink}
              className="text-base text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open map
            </a>
          ) : null}
        </section>
      </div>

      {videoId ? (
        <section className="flex flex-col gap-3">
          <h3>প্রকল্পের কিছু মুহূর্ত</h3>
          <iframe
            title={`${plot.name} video`}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1`}
            className="aspect-video w-full rounded-xl border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            // allowFullScreen
            loading="lazy"
          />
        </section>
      ) : null}

      <PlotTrustRow />
      <PlotDriveLink driveLink={plot.driveLink} />
      <SpecialOfferBanner offer={plot.specialOffer} />
      <PlotCtaBar name={plot.name} />
    </article>
  );
}
