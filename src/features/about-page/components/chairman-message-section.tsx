import Image from 'next/image';
import { SectionLayout } from '@/components/layout';

const CHAIRMAN_PORTRAIT = {
  src: '/images/message-from-chairman/chairman-nc.png',
  alt: 'নজরুল সিটির চেয়ারম্যান নজরুল ইসলাম',
} as const;

const CHAIRMAN_SIGNATURE = {
  src: '/images/message-from-chairman/chairman-sir-signature.png',
} as const;

export function ChairmanMessageSection() {
  return (
    <SectionLayout
      aria-labelledby="chairman-message-heading"
      containerClassName="bg-muted py-10 md:rounded-md"
    >
      <div className="grid items-center gap-8 rounded-md bg-muted md:grid-cols-2 md:gap-12">
        <div className="order-2 flex max-w-prose flex-col gap-4 md:order-1">
          <p className="flex items-center gap-3 text-sm font-semibold tracking-wide text-muted-foreground">
            <span className="h-0.5 w-8 shrink-0 bg-primary" aria-hidden="true" />
            চেয়ারম্যান মহোদয়ের বার্তা
          </p>
          <h2 id="chairman-message-heading" className="text-balance">
            সততা, আস্থা ও উন্নয়নের পথে আমরা এগিয়ে চলেছি
          </h2>
          {/* <span className="h-0.5 w-10 bg-primary" aria-hidden="true" /> */}

          <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            <p>প্রিয় গ্রাহকবৃন্দ,</p>
            <p>
              আসসালামু আলাইকুম। Nazrul City-তে আপনাদের স্বাগতম। আমাদের প্রতি যে আস্থা ও ভালোবাসা
              আপনারা দেখিয়েছেন, তা আমাদের কর্মকে আরও দায়িত্বশীল ও নিষ্ঠাবান হতে অনুপ্রাণিত করে।
            </p>
            <p>
              জমি একটি মূল্যবান সম্পদ, এটি শুধু আর্থিক বিনিয়োগ নয়—এটি একটি পরিবারের ভবিষ্যৎ,
              নিরাপত্তা এবং স্বপ্নের প্রতিফলন। আমরা বিশ্বাস করি, সঠিক তথ্য, স্বচ্ছতা এবং পেশাদার
              সহায়তার মাধ্যমে প্রতিটি ক্রেতার জন্য নিরাপদ ও লাভজনক জমি নিশ্চিত করাই আমাদের মূল
              লক্ষ্য।
            </p>
            <p>
              Nazrul City ভবিষ্যতে আরও বিস্তৃত পরিসরে কাজ করে দেশের উন্নয়নে অবদান রাখবে এবং আপনাদের
              পাশে থেকে দীর্ঘদিনের আস্থার সম্পর্ক গড়ে তুলবে—এই প্রত্যাশায় আমরা এগিয়ে যাচ্ছি।
            </p>
            <p>সবার প্রতি শুভকামনা।</p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="relative h-12 w-36">
                <Image
                  src={CHAIRMAN_SIGNATURE.src}
                  alt=""
                  fill
                  sizes="9rem"
                  className="object-contain object-left mix-blend-multiply dark:mix-blend-screen dark:invert"
                />
              </div>
              <p className="font-semibold text-foreground">চেয়ারম্যান</p>
              <p className="text-sm text-muted-foreground">Nazrul City</p>
            </div>

            <blockquote className="hidden w-34 rounded-md bg-card p-3 shadow-md md:block">
              <div className="flex gap-2">
                <span className="w-0.5 shrink-0 bg-primary" aria-hidden="true" />
                <div>
                  <span
                    className="font-heading text-2xl leading-none text-primary"
                    aria-hidden="true"
                  >
                    “
                  </span>
                  <p className="text-sm leading-snug font-medium text-foreground">
                    স্বপ্ন দেখুন, <br /> আমরা আছি <br /> আপনার পাশে।
                  </p>
                </div>
              </div>
            </blockquote>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <Image
            src={CHAIRMAN_PORTRAIT.src}
            alt={CHAIRMAN_PORTRAIT.alt}
            width={1192}
            height={1019}
            sizes="(min-width: 768px) 36rem, 100vw"
            className="h-auto w-full rounded-md shadow-md"
          />
        </div>
      </div>
    </SectionLayout>
  );
}
