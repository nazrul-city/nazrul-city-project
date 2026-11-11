import { z } from 'zod';
import { HERO_STATS_DEFAULTS } from '@/features/hero-stats/constants';

const HERO_STATS_FIELDS = ['plotsSold', 'happyClients', 'propertiesListed'] as const;

function requiredStat(emptyMessage: string) {
  return z
    .string()
    .trim()
    .min(1, { error: emptyMessage })
    .max(20, { error: 'Use 20 characters or fewer.' });
}

export const heroStatsFormSchema = z.object({
  plotsSold: requiredStat('Enter plots sold.'),
  happyClients: requiredStat('Enter happy clients.'),
  propertiesListed: requiredStat('Enter properties listed.'),
});

export type THeroStatsFormValues = z.infer<typeof heroStatsFormSchema>;

export const HERO_STATS_FORM_DEFAULTS = {
  plotsSold: HERO_STATS_DEFAULTS.plotsSold,
  happyClients: HERO_STATS_DEFAULTS.happyClients,
  propertiesListed: HERO_STATS_DEFAULTS.propertiesListed,
} as const satisfies THeroStatsFormValues;

export type THeroStatsField = (typeof HERO_STATS_FIELDS)[number];

export type THeroStatsFieldErrors = Partial<Record<THeroStatsField, string>>;

export type THeroStatsSaveResult =
  { ok: true } | { ok: false; message: string } | { ok: false; fieldErrors: THeroStatsFieldErrors };

function isHeroStatsField(value: string): value is THeroStatsField {
  return HERO_STATS_FIELDS.some((field) => field === value);
}

export function readHeroStatsFieldErrors(error: z.ZodError): THeroStatsFieldErrors {
  const fieldErrors: THeroStatsFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && isHeroStatsField(field) && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
