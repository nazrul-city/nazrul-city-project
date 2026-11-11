import { z } from 'zod';

const SITE_CONTACT_FIELDS = ['primaryPhone', 'secondaryPhone', 'whatsapp', 'email'] as const;

// International format (E.164) so tel: and wa.me links work everywhere.
const INTERNATIONAL_PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;

function requiredPhone(emptyMessage: string) {
  return z.string().trim().min(1, { error: emptyMessage }).regex(INTERNATIONAL_PHONE_PATTERN, {
    error: 'Use international format, for example +8801837777777.',
  });
}

export const siteContactFormSchema = z.object({
  primaryPhone: requiredPhone('Enter the primary phone number.'),
  secondaryPhone: requiredPhone('Enter the secondary phone number.'),
  whatsapp: requiredPhone('Enter the WhatsApp number.'),
  email: z
    .string()
    .trim()
    .min(1, { error: 'Enter an email address.' })
    .max(254, { error: 'Enter a valid email address.' })
    .email({ error: 'Enter a valid email address.' }),
});

export type TSiteContactFormValues = z.infer<typeof siteContactFormSchema>;

export type TSiteContactField = (typeof SITE_CONTACT_FIELDS)[number];

export type TSiteContactFieldErrors = Partial<Record<TSiteContactField, string>>;

export type TSiteContactSaveResult =
  | { ok: true }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: TSiteContactFieldErrors };

function isSiteContactField(value: string): value is TSiteContactField {
  return SITE_CONTACT_FIELDS.some((field) => field === value);
}

export function readSiteContactFieldErrors(error: z.ZodError): TSiteContactFieldErrors {
  const fieldErrors: TSiteContactFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && isSiteContactField(field) && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
