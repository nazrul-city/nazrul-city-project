import { SectionLayout } from '@/components/layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const DIRECTION_CARDS = [
  {
    id: 'work',
    title: 'আমরা যা করি',
    body: 'নজরুল সিটি ময়মনসিংহে নিজের জমি ও প্লট বিক্রি করে, আর তৈরি ও আসন্ন ফ্ল্যাটও। প্লট ৪, ৫, ১০ বা ২০ শতাংশ। রাস্তা ১২–২০ ফিট। বাড়ি নিজের নকশায় করা যায়। শেয়ারিংয়ে ফ্ল্যাটের সঙ্গে জমির অংশ আসে। তারপর নামজারি করে হস্তান্তর হয়।',
  },
  {
    id: 'trust',
    title: 'কেন নজরুল সিটি',
    body: 'এক মালিক, লেঃ কর্ণেল মোঃ নজরুল ইসলাম (অবঃ)। দলিল জমির মালিক নিজে করেন। সাফ কবলা ক্রেতার নামে রেজিস্ট্রি হয়, বিক্রেতা থাকেন নজরুল সিটি। কাগজ সি এস, আর ও আর, বি আর এস, ই-নামজারি পর্যন্ত আপডেট। প্লট পছন্দ হলে অফিসে কাগজ দেখানো হয়। বুকিং টাকা ফেরতযোগ্য।',
  },
] as const;

export function WorkAndTrustSection() {
  return (
    <SectionLayout
      aria-labelledby="work-and-trust-heading"
      containerClassName="bg-muted py-10 md:rounded-md"
    >
      <p className="text-sm font-semibold tracking-wide text-primary">আমাদের দিক</p>
      <h2 id="work-and-trust-heading" className="mt-2 text-balance">
        আমরা যা করি, কেন নজরুল সিটি
      </h2>

      <ul className="mt-8 grid list-none items-stretch gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
        {DIRECTION_CARDS.map((card) => (
          <li key={card.id} className="flex min-w-0">
            <DirectionCard title={card.title} body={card.body} />
          </li>
        ))}
      </ul>
    </SectionLayout>
  );
}

type TDirectionCardProps = {
  title: string;
  body: string;
};

function DirectionCard({ title, body }: Readonly<TDirectionCardProps>) {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <h3 className="text-primary">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-relaxed text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
