import { z } from 'zod';

const SITE_NOTICE_FIELDS = ['message', 'isEnabled'] as const;

export const SITE_NOTICE_DEFAULTS = {
  message:
    'সেরা আবাসন সমাধান, যা আপনার স্বপ্নকে বাস্তবে রূপ দেওয়ার জন্য তৈরি। কল করুন: +8801837777777 | +8801910100100',
  isEnabled: true,
} as const;

export const siteNoticeFormSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, { error: 'Enter a notice message.' })
    .max(200, { error: 'Use 200 characters or fewer.' }),
  isEnabled: z.boolean(),
});

export type TSiteNoticeFormValues = z.infer<typeof siteNoticeFormSchema>;

export type TSiteNoticeField = (typeof SITE_NOTICE_FIELDS)[number];

export type TSiteNoticeFieldErrors = Partial<Record<TSiteNoticeField, string>>;

export type TSiteNoticeSaveResult =
  | { ok: true }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: TSiteNoticeFieldErrors };

function isSiteNoticeField(value: string): value is TSiteNoticeField {
  return SITE_NOTICE_FIELDS.some((field) => field === value);
}

export function readSiteNoticeFieldErrors(error: z.ZodError): TSiteNoticeFieldErrors {
  const fieldErrors: TSiteNoticeFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && isSiteNoticeField(field) && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
