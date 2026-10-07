import { z } from 'zod';

export const CONTACT_INTEREST_VALUES = ['plot', 'flat', 'land', 'other'] as const;

export const CONTACT_INTEREST_OPTIONS = [
  { value: 'plot', label: 'প্লট' },
  { value: 'flat', label: 'ফ্ল্যাট' },
  { value: 'land', label: 'জমি' },
  { value: 'other', label: 'অন্যান্য' },
] as const satisfies readonly {
  value: (typeof CONTACT_INTEREST_VALUES)[number];
  label: string;
}[];

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'নাম কমপক্ষে ২ অক্ষর লিখুন' })
    .max(80, { error: 'নাম ৮০ অক্ষরের মধ্যে রাখুন' }),
  phone: z
    .string()
    .trim()
    .regex(/^01\d{9}$/, { error: '০১ দিয়ে শুরু হওয়া ১১ সংখ্যার মোবাইল নম্বর লিখুন' }),
  interest: z.enum(CONTACT_INTEREST_VALUES, { error: 'একটি বিষয় বেছে নিন' }),
  message: z.string().trim().max(500, { error: 'বার্তা ৫০০ অক্ষরের মধ্যে রাখুন' }),
});

export type TContactFormValues = z.infer<typeof contactFormSchema>;

export const CONTACT_FORM_DEFAULT_VALUES = {
  name: '',
  phone: '',
  interest: 'plot',
  message: '',
} as const satisfies TContactFormValues;
