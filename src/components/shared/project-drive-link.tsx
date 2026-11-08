import { ChevronRightIcon } from 'lucide-react';

type TProjectDriveLinkProps = {
  driveLink: string;
  title?: string;
  subtitle?: string;
};

function DriveMark() {
  return (
    <svg viewBox="0 0 87.3 78" aria-hidden="true" className="size-8 shrink-0">
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  );
}

export function ProjectDriveLink({
  driveLink,
  title = 'প্রকল্পের জরিপ মানচিত্র (ড্রাইভ)',
  subtitle = 'জমি জরিপ, লেআউট পরিকল্পনা এবং আরও',
}: Readonly<TProjectDriveLinkProps>) {
  if (driveLink.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2">
      <p className="text-base text-muted-foreground">প্রয়োজনীয় ডকুমেন্টস</p>
      <a
        href={driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center gap-3 rounded-xl bg-muted p-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <DriveMark />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-base font-semibold">{title}</span>
          <span className="text-base text-muted-foreground">{subtitle}</span>
        </span>
        <ChevronRightIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
      </a>
    </section>
  );
}
