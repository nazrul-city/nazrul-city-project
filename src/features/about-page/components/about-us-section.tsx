import Image from 'next/image';
import { SectionLayout } from '@/components/layout';

const ABOUT_US_IMAGE = {
  src: '/images/about-page/about-us-section/office2.jpg',
  alt: 'Nazrul City Office',
} as const;

export function AboutUsSection() {
  return (
    <SectionLayout aria-labelledby="about-us-heading">
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
        <div className="relative order-2 aspect-4/3 overflow-hidden rounded-md md:order-1">
          <Image
            src={ABOUT_US_IMAGE.src}
            alt={ABOUT_US_IMAGE.alt}
            fill
            sizes="(min-width: 768px) 36rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 flex max-w-prose flex-col gap-4 md:order-2">
          <p className="text-sm font-semibold tracking-wide text-primary">আমাদের সম্পর্কে</p>
          <h2 id="about-us-heading">নজরুল সিটি</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            ময়মনসিংহে অনেক পরিবার বছরের পর বছর জমিয়ে একটি জমি বা ফ্ল্যাট কেনেন। ভয় থাকে কাগজে,
            দামে, আর মাঝখানের মানুষে।
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            নজরুল সিটি সেই ভয় কমাতে গড়ে উঠেছে। মালিক লেঃ কর্ণেল মোঃ নজরুল ইসলাম (অবঃ)। জমি ক্রয়,
            বায়না ও ওয়ারিশ সূত্রে তাঁর। ক্রেতা জায়গা দেখেন, অফিসে কাগজ খোলেন, তারপর দাম ঠিক হয়।
            সাফ কবলা ক্রেতার নামে, আর বিক্রেতা হিসেবে থাকেন নজরুল সিটি।
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}
