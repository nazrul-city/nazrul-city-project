import { SITE_CONFIG } from '@/config/site';

export type TFaqCategory = 'land' | 'flat';

export type TFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type TFaqGroup = {
  id: TFaqCategory;
  label: string;
  items: readonly TFaqItem[];
};

const CONTACT_PHONE = SITE_CONFIG.contact.phones[0];

export const FAQ_GROUPS = [
  {
    id: 'land',
    label: 'Land',
    items: [
      {
        id: 'NC-owner',
        question: 'নজরুল সিটির জমির মালিক কে? কোন সূত্রে? এবং এই প্রতিষ্ঠান এর কতজন মালিক?',
        answer:
          'নজরুল সিটির মালিক লেঃ কর্ণেল মোঃ নজরুল ইসলাম (অবঃ)। তিনি এই প্রতিষ্ঠানের একক মালিকানায় রয়েছেন। ক্রয় সূত্রে, বায়না সূত্রে, ওয়ারিশান সূত্রে।',
      },
      {
        id: 'land-papers',
        question: 'How do you check the papers?',
        answer: 'Deeds and papers are reviewed before terms are agreed.',
      },
      {
        id: 'land-process',
        question: 'How does a land deal move forward?',
        answer:
          'Share what you want, review the property and papers, agree terms, then payment and transfer through handover.',
      },
      {
        id: 'land-available',
        question: 'How do I see land that is available now?',
        answer: 'Ask through the contact section and matching options are shared.',
      },
      {
        id: 'land-call',
        question: 'আরও জানতে চাইলে কীভাবে যোগাযোগ করবেন?',
        answer: `জমি সম্পর্কে আরও কোনো প্রশ্ন থাকলে সরাসরি ${CONTACT_PHONE} নম্বরে কল করুন।`,
      },
    ],
  },
  {
    id: 'flat',
    label: 'Flat',
    items: [
      {
        id: 'flat-kinds',
        question: 'Do you deal in ready and upcoming flats?',
        answer: 'Yes. Ready flats and upcoming flats or units.',
      },
      {
        id: 'flat-before',
        question: 'What should I know before I choose a flat?',
        answer: 'Pricing is explained up front, and papers are checked before the deal moves on.',
      },
      {
        id: 'flat-process',
        question: 'How does buying or selling a flat work?',
        answer:
          'Same path as land: share the need, review papers, agree terms, then payment and transfer.',
      },
      {
        id: 'flat-ask',
        question: 'How do I ask about a flat?',
        answer: 'Use the contact section. The follow-up covers next steps.',
      },
      {
        id: 'flat-call',
        question: 'আরও জানতে চাইলে কীভাবে যোগাযোগ করবেন?',
        answer: `ফ্ল্যাট সম্পর্কে আরও কোনো প্রশ্ন থাকলে সরাসরি ${CONTACT_PHONE} নম্বরে কল করুন।`,
      },
    ],
  },
] as const satisfies readonly TFaqGroup[];
