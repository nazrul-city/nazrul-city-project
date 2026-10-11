import Image from 'next/image';
import { SectionLayout } from '@/components/layout';

const INTRO_IMAGE = {
  src: '/images/about-page/about-intro/about-intro.png',
  alt: 'সবুজ গাছের সামনে আবাসিক ভবনের সারি',
} as const;

export function AboutIntro() {
  return (
    <SectionLayout aria-labelledby="about-heading" containerClassName="relative">
      <div className="relative z-10 max-w-xl py-8 md:py-16">
        <h1 className="text-lg font-semibold tracking-wide text-primary">আমাদের সম্পর্কে</h1>
        <h2 id="about-heading" className="mt-3">
          ঠিকানা শুধু জমিতে নয়, গড়ে উঠুক
          <br />
          একটি <span className="text-primary">আস্থার ভিত্তিতে</span>
        </h2>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
          প্রতিটি স্বপ্নের পেছনে থাকে একটি গল্প, আর প্রতিটি ঠিকানার সঙ্গে জড়িয়ে থাকে ভবিষ্যতের
          প্রত্যাশা। নজরুল সিটি সেই প্রত্যাশাকে গুরুত্ব দিয়ে সম্পত্তি কেনার অভিজ্ঞতাকে করতে চায়
          আরও সহজ, স্বচ্ছ ও নির্ভরযোগ্য। কারণ আমরা বিশ্বাস করি, সঠিক সিদ্ধান্তই হতে পারে আপনার আগামী
          দিনের সুন্দর সূচনা।
        </p>
        <p className="mt-6 flex items-center gap-3 text-sm font-medium">
          আস্থা · স্বচ্ছতা · আগামীর ঠিকানা
        </p>
      </div>

      <div className="relative aspect-2/1 md:absolute md:inset-0 md:aspect-auto">
        <Image
          src={INTRO_IMAGE.src}
          alt={INTRO_IMAGE.alt}
          fill
          priority
          sizes="(min-width: 768px) 72rem, 100vw"
          className="object-cover object-right md:object-contain md:object-bottom"
        />
      </div>
    </SectionLayout>
  );
}
