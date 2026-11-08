import {
  Building2Icon,
  CalendarIcon,
  CheckIcon,
  CoinsIcon,
  LandmarkIcon,
  LeafIcon,
  MapIcon,
  MapPinIcon,
  ShieldIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { ProjectCtaBar } from '@/components/shared/project-cta-bar';
import { ProjectDriveLink } from '@/components/shared/project-drive-link';
import { ProjectImageCarousel } from '@/components/shared/project-image-carousel';
import { RichText } from '@/components/shared/rich-text';
import { SpecialOfferBanner } from '@/components/shared/special-offer-banner';
import { Separator } from '@/components/ui/separator';
import { FLAT_STATUS_OPTIONS } from '@/features/flat-projects/components/flat-form-schema';
import type { getPublishedFlat } from '@/features/flat-projects/queries';
import { isGoogleMapsEmbedUrl } from '@/utils/google-maps-embed';
import { readYoutubeVideoId } from '@/utils/project-listing-fields';

type TFlatDetailProps = {
  flat: NonNullable<Awaited<ReturnType<typeof getPublishedFlat>>>;
};

type TFlatFactProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

/** Public page only — admin form keeps English labels. */
const PROPERTY_TYPE_LABELS_BN = {
  RESIDENTIAL: 'আবাসিক',
  COMMERCIAL: 'বাণিজ্যিক',
  BOTH: 'আবাসিক ও বাণিজ্যিক',
} as const;

function readPropertyLabel(value: TFlatDetailProps['flat']['propertyType']): string {
  return PROPERTY_TYPE_LABELS_BN[value];
}

function readStatusLabel(status: TFlatDetailProps['flat']['status']): string {
  return FLAT_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function toBengaliDigits(value: number): string {
  return String(value).replace(/\d/g, (digit) => {
    const bengaliDigit = BENGALI_DIGITS[Number(digit)];
    return bengaliDigit ?? digit;
  });
}

function FlatFact({ label, value, icon }: Readonly<TFlatFactProps>) {
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
    title: 'Clean Environment',
    detail: 'পরিচ্ছন্ন পরিবেশ',
    icon: LeafIcon,
  },
  {
    title: 'Long-Term Investment',
    detail: 'দীর্ঘমেয়াদী বিনিয়োগ',
    icon: TrendingUpIcon,
  },
] as const;

function FlatTrustRow() {
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

export function FlatDetail({ flat }: Readonly<TFlatDetailProps>) {
  const statusLabel = readStatusLabel(flat.status);
  const propertyLabel = readPropertyLabel(flat.propertyType);
  const images = flat.images.map((image) => ({
    id: image.id,
    imageUrl: image.imageUrl,
  }));
  const videoId = readYoutubeVideoId(flat.youtubeVideoUrl);
  const floorCount = toBengaliDigits(flat.buildingTotalFloors);
  const facilityCount = `${toBengaliDigits(flat.facilities.length)}+`;

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-8 pb-24 md:pb-8">
      {images.length > 0 ? (
        <div className="relative">
          <ProjectImageCarousel title={flat.name} images={images} />
          <p className="pointer-events-none absolute top-3 left-3 rounded-full bg-primary/50 px-3 py-1 text-base font-medium text-primary-foreground backdrop-blur-sm">
            {statusLabel}
          </p>
        </div>
      ) : null}

      <header className="flex flex-col gap-2">
        <h1>{flat.name}</h1>
        {flat.shortIntro ? <p className="text-base">{flat.shortIntro}</p> : null}
        <p className="flex items-center gap-2 text-base text-muted-foreground">
          <MapIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
          {flat.district}
        </p>
        <p className="flex items-center gap-2 text-base text-muted-foreground">
          <Building2Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
          {propertyLabel}
        </p>
        {flat.handoverDate ? (
          <p className="flex items-center gap-2 text-base text-muted-foreground">
            <CalendarIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
            হস্তান্তর: {flat.handoverDate}
          </p>
        ) : null}
        {flat.installmentFacility ? (
          <p className="flex items-start gap-2 text-base text-muted-foreground">
            <WalletIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            {flat.installmentFacility}
          </p>
        ) : null}
      </header>

      <dl className="grid grid-cols-3 gap-3">
        <FlatFact
          label="বর্গফুট মূল্য"
          value={flat.pricePerSqft}
          icon={<CoinsIcon aria-hidden="true" className="size-5" />}
        />
        <FlatFact
          label="মোট তলা"
          value={floorCount}
          icon={<Building2Icon aria-hidden="true" className="size-5" />}
        />
        <FlatFact
          label="সুবিধা"
          value={facilityCount}
          icon={<UsersIcon aria-hidden="true" className="size-5" />}
        />
      </dl>

      <Separator />

      <section className="flex w-full flex-col gap-3" aria-labelledby="flat-overview-title">
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-primary">প্রকল্পের পরিচিতি</p>
          <h2 id="flat-overview-title">{flat.title}</h2>
        </div>
        <RichText html={flat.description} />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {flat.facilities.length > 0 ? (
          <section className="flex flex-col gap-3">
            <h3>সুবিধা</h3>
            <ul className="flex flex-col gap-2">
              {flat.facilities.map((facility) => (
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
            {flat.address}
          </p>
          {flat.landmark ? (
            <p className="flex items-start gap-2 text-base text-muted-foreground">
              <LandmarkIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              {flat.landmark}
            </p>
          ) : null}
          {flat.mapEmbedLink && isGoogleMapsEmbedUrl(flat.mapEmbedLink) ? (
            <iframe
              title={`Map of ${flat.name}`}
              src={flat.mapEmbedLink}
              className="h-80 w-full rounded-xl border-0"
              loading="lazy"
            />
          ) : null}
          {flat.mapEmbedLink && !isGoogleMapsEmbedUrl(flat.mapEmbedLink) ? (
            <a
              href={flat.mapEmbedLink}
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
            title={`${flat.name} video`}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1`}
            className="aspect-video w-full rounded-xl border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        </section>
      ) : null}

      <FlatTrustRow />
      <ProjectDriveLink
        driveLink={flat.driveLink}
        title="প্রকল্পের ডকুমেন্টস (ড্রাইভ)"
        subtitle="ফ্লোর প্ল্যান, লেআউট এবং আরও"
      />
      <SpecialOfferBanner offer={flat.specialOffer} />
      <ProjectCtaBar name={flat.name} />
    </article>
  );
}
