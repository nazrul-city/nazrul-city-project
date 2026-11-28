import { z } from 'zod';

export const GALLERY_CATEGORY_VALUES = [
  'PROJECT_VISIT',
  'REGISTRATION',
  'BOOKING',
  'CUSTOMER_MOMENTS',
  'PROJECT_ACTIVITIES',
  'CORPORATE',
] as const;

export const createGalleryPhotoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'ছবির শিরোনাম বা বিবরণ দিন।')
    .max(200, 'শিরোনাম সর্বোচ্চ ২০০ অক্ষরের হতে পারে।'),
  dateTaken: z
    .string()
    .trim()
    .min(1, 'ছবির তারিখ দিন (যেমন: ১৭ জুন ২০২৬)।')
    .max(50, 'তারিখ সর্বোচ্চ ৫০ অক্ষরের হতে পারে।'),
  category: z.enum(GALLERY_CATEGORY_VALUES, {
    message: 'একটি সঠিক ক্যাটাগরি নির্বাচন করুন।',
  }),
});

export const addGalleryPhotoSchema = createGalleryPhotoFormSchema.extend({
  imageUrl: z.string().trim().url('সঠিক ছবির URL প্রদান করুন।'),
});

export type TCreateGalleryPhotoFormValues = z.infer<typeof createGalleryPhotoFormSchema>;
export type TAddGalleryPhotoValues = z.infer<typeof addGalleryPhotoSchema>;

export type TAddGalleryPhotoResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<keyof TCreateGalleryPhotoFormValues, string>>;
    };

export type TDeleteGalleryPhotoResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
    };
