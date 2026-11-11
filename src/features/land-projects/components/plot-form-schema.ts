import { z } from 'zod';
import { facilityListSchema, optionalYoutubeUrlSchema } from '@/utils/project-listing-fields';
import { projectImageListSchema } from '@/utils/project-image-url';

const PLOT_FIELDS = [
  'name',
  'title',
  'slug',
  'description',
  'shortIntro',
  'facilities',
  'address',
  'district',
  'landmark',
  'shotangshoPrice',
  'landAreaSize',
  'driveLink',
  'youtubeVideoUrl',
  'mapEmbedLink',
  'specialOffer',
  'published',
  'isFeatured',
  'status',
  'installmentFacility',
  'images',
] as const;

export const PLOT_STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'SOLD', label: 'Sold' },
] as const;

function requiredText(emptyMessage: string, max: number) {
  return z
    .string()
    .trim()
    .min(1, { error: emptyMessage })
    .max(max, { error: `Use ${max} characters or fewer.` });
}

function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max, { error: `Use ${max} characters or fewer.` });
}

function optionalUrl(message: string) {
  return z
    .string()
    .trim()
    .max(2000, { error: 'Use 2000 characters or fewer.' })
    .refine((value) => value.length === 0 || z.string().url().safeParse(value).success, {
      error: message,
    });
}

export const plotFormSchema = z.object({
  name: requiredText('Enter a name.', 120),
  title: requiredText('Enter a title.', 160),
  slug: requiredText('Enter a slug.', 160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: 'Enter a valid slug.',
  }),
  description: requiredText('Enter a description.', 20000),
  shortIntro: optionalText(150),
  facilities: facilityListSchema,
  address: requiredText('Enter an address.', 500),
  district: requiredText('Enter a district.', 120),
  landmark: optionalText(500),
  shotangshoPrice: requiredText('Enter a price.', 120),
  landAreaSize: requiredText('Enter the land area.', 120),
  driveLink: optionalUrl('Enter a valid drive link.'),
  youtubeVideoUrl: optionalYoutubeUrlSchema,
  mapEmbedLink: optionalUrl('Enter a valid map URL.'),
  specialOffer: optionalText(200),
  published: z.boolean(),
  isFeatured: z.boolean(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD'], { error: 'Choose a status.' }),
  installmentFacility: optionalText(500),
  images: projectImageListSchema,
});

export type TPlotFormValues = z.infer<typeof plotFormSchema>;

export const PLOT_FORM_DEFAULTS = {
  name: '',
  title: '',
  slug: '',
  description: '',
  shortIntro: '',
  facilities: [],
  address: '',
  district: '',
  landmark: '',
  shotangshoPrice: '',
  landAreaSize: '',
  driveLink: '',
  youtubeVideoUrl: '',
  mapEmbedLink: '',
  specialOffer: '',
  published: false,
  isFeatured: false,
  status: 'AVAILABLE',
  installmentFacility: '',
  images: [],
} as const satisfies TPlotFormValues;

export type TPlotField = (typeof PLOT_FIELDS)[number];

export type TPlotFieldErrors = Partial<Record<TPlotField, string>>;

export type TPlotSaveResult =
  { ok: true } | { ok: false; message: string } | { ok: false; fieldErrors: TPlotFieldErrors };

function isPlotField(value: string): value is TPlotField {
  return PLOT_FIELDS.some((field) => field === value);
}

export function readPlotFieldErrors(error: z.ZodError): TPlotFieldErrors {
  const fieldErrors: TPlotFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && isPlotField(field) && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
