import { z } from 'zod';

/**
 * Strict regex for matching official Facebook Reels URLs.
 */
export const FACEBOOK_REEL_URL_REGEX =
  /^https:\/\/(www\.|web\.|m\.)?(facebook\.com\/(reel\/|share\/r\/|watch\/\?v=)|fb\.watch\/)[\w.-]+/;

/**
 * Format min:sec (e.g. "0:56", "1:30", "12:45")
 */
export const REEL_DURATION_REGEX = /^\d{1,2}:\d{2}$/;

export const addFacebookReelSchema = z.object({
  videoUrl: z
    .string()
    .trim()
    .min(1, 'ফেসবুক রিলস লিংক দিন।')
    .url('সঠিক URL প্রদান করুন।')
    .regex(
      FACEBOOK_REEL_URL_REGEX,
      'সঠিক ফেসবুক রিলস লিংক দিন (যেমন: https://www.facebook.com/reel/...)।'
    ),
  thumbnailUrl: z.string().trim().url('সঠিক থাম্বনেইল URL প্রদান করুন।'),
  views: z
    .string()
    .trim()
    .min(1, 'ভিউ সংখ্যা দিন।')
    .max(6, 'ভিউ সংখ্যা সর্বোচ্চ ৬ অক্ষর হতে পারে (যেমন: 245K)।'),
  duration: z
    .string()
    .trim()
    .min(1, 'সময় দিন।')
    .regex(REEL_DURATION_REGEX, 'সময় min:sec ফরম্যাটে দিন (যেমন: 0:56)।'),
  caption: z.string().trim().max(200, 'ক্যাপশন সর্বোচ্চ ২০০ অক্ষরের হতে পারে।').default(''),
});

export const updateFacebookReelSchema = addFacebookReelSchema.extend({
  id: z.string().uuid(),
});

/**
 * Client-side form validation schemas (for react-hook-form + zodResolver).
 */
export const createReelFormSchema = z.object({
  videoUrl: z
    .string()
    .trim()
    .min(1, 'ফেসবুক রিলস লিংক দিন।')
    .regex(
      FACEBOOK_REEL_URL_REGEX,
      'সঠিক ফেসবুক রিলস লিংক দিন (যেমন: https://www.facebook.com/reel/...)।'
    ),
  caption: z.string().trim().max(200, 'ক্যাপশন সর্বোচ্চ ২০০ অক্ষরের হতে পারে।'),
  views: z
    .string()
    .trim()
    .min(1, 'ভিউ সংখ্যা দিন।')
    .max(6, 'ভিউ সংখ্যা সর্বোচ্চ ৬ অক্ষর হতে পারে (যেমন: 245K)।'),
  duration: z
    .string()
    .trim()
    .min(1, 'সময় দিন।')
    .regex(REEL_DURATION_REGEX, 'সময় min:sec ফরম্যাটে দিন (যেমন: 0:56)।'),
});

export const editReelFormSchema = createReelFormSchema;

export type TCreateReelFormValues = z.infer<typeof createReelFormSchema>;
export type TEditReelFormValues = z.infer<typeof editReelFormSchema>;

export type TAddFacebookReelValues = z.infer<typeof addFacebookReelSchema>;
export type TUpdateFacebookReelValues = z.infer<typeof updateFacebookReelSchema>;

export type TAddFacebookReelResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<keyof TAddFacebookReelValues, string>>;
    };

export type TUpdateFacebookReelResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<keyof TAddFacebookReelValues, string>>;
    };
