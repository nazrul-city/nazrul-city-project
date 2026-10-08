export type TService = {
  id: string;
  indexLabel: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  ctaLink: string;
  ctaText: string;
};

export const SERVICES = [
  {
    id: 'plot',
    indexLabel: '০১',
    title: 'প্লট বিক্রি',
    description:
      'আপনার প্রয়োজন অনুযায়ী নির্ভরযোগ্য এবং পরিপাটি প্লট বিক্রয়। ৪, ৫, ১০ বা ২০ শতাংশ—যে কোনো আকার সহজেই বেছে নিতে পারেন। নির্মাণের উপযোগী পরিবেশ ও সকল বৈধ কাগজপত্র সহ প্লট হস্তান্তর নিশ্চিত করা হয়।',
    imageSrc: '/images/landing-page/our-services/plot.png',
    imageAlt: 'ইটের দেয়াল দিয়ে ভাগ করা প্লটের মাঠ',
    ctaLink: '/plots',
    ctaText: 'প্লট দেখুন',
  },
  {
    id: 'flat',
    indexLabel: '০২',
    title: 'ফ্ল্যাট বিক্রি',
    description:
      'আধুনিক ও সুন্দর ফ্ল্যাট, আবাসিক অথবা বাণিজ্যিক—সব প্রকার চাহিদার জন্য। নির্ধারিত বাজেটে, জনপ্রিয় লোকেশনে, সকল উন্নত সুবিধা ও নিরাপত্তা সহ দ্রুত ফ্ল্যাট হস্তান্তর।',

    imageSrc: '/images/landing-page/our-services/flat.jpg',
    imageAlt: 'বহুতল ফ্ল্যাট ভবন',
    ctaLink: '/flats',
    ctaText: 'ফ্ল্যাট দেখুন',
  },
] as const satisfies readonly TService[];
