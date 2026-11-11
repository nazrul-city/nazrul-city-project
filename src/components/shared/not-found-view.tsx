import Link from 'next/link';
import { ArrowUpRight, HomeIcon, LandPlotIcon, Building2Icon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function NotFoundView() {
  return (
    <section
      className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 py-20 md:px-6 md:py-28 lg:px-8"
      aria-labelledby="not-found-heading"
    >
      <div className="flex max-w-prose flex-col gap-4">
        <p className="text-base font-semibold tracking-wide text-primary">৪০৪</p>
        <h1 id="not-found-heading">পৃষ্ঠাটি পাওয়া যায়নি</h1>
        <p className="text-base text-muted-foreground">
          আপনি যে ঠিকানাটি খুঁজছেন তা সরানো হয়েছে, মুছে ফেলা হয়েছে, অথবা কখনোই ছিল না। হোমে ফিরে
          যান অথবা আমাদের প্লট ও ফ্ল্যাট প্রকল্পগুলো দেখুন।
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link href="/" className={cn(buttonVariants(), 'min-h-11 gap-2')}>
          <HomeIcon aria-hidden="true" className="size-4" />
          হোমে যান
        </Link>
        <Link
          href="/plots"
          className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11 gap-2')}
        >
          <LandPlotIcon aria-hidden="true" className="size-4" />
          প্লট দেখুন
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          href="/flats"
          className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11 gap-2')}
        >
          <Building2Icon aria-hidden="true" className="size-4" />
          ফ্ল্যাট দেখুন
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
