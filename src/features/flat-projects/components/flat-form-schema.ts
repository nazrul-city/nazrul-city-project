import { z } from 'zod';
import { facilityListSchema, optionalYoutubeUrlSchema } from '@/utils/project-listing-fields';
import { projectImageListSchema } from '@/utils/project-image-url';

const FLAT_FIELDS = [
  'name',
  'title',
  'slug',
  'propertyType',
  'address',
  'district',
  'description',
  'shortIntro',
  'buildingTotalFloors',
  'pricePerSqft',
  'landmark',
  'facilities',
  'specialOffer',
  'status',
  'constructionStatus',
  'handoverDate',
  'driveLink',
  'youtubeVideoUrl',
  'mapEmbedLink',
  'isFeatured',
  'published',
  'installmentFacility',
  'images',
] as const;

export const FLAT_PROPERTY_OPTIONS = [
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'BOTH', label: 'Residential and commercial' },
] as const;

export const FLAT_STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'SOLD', label: 'Sold' },
] as const;

export const FLAT_CONSTRUCTION_OPTIONS = [
  { value: 'READY', label: 'Ready' },
  { value: 'UNDER_CONSTRUCTION', label: 'Under construction' },
  { value: 'UPCOMING', label: 'Upcoming' },
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

export const flatFormSchema = z.object({
  name: requiredText('Enter a name.', 120),
  title: requiredText('Enter a title.', 160),
  slug: requiredText('Enter a slug.', 160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: 'Enter a valid slug.',
  }),
  propertyType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'BOTH'], {
    error: 'Choose a property type.',
  }),
  address: requiredText('Enter an address.', 500),
  district: requiredText('Enter a district.', 120),
  description: requiredText('Enter a description.', 20000),
  shortIntro: optionalText(150),
  buildingTotalFloors: z
    .number({ error: 'Enter the number of floors.' })
    .int({ error: 'Enter the number of floors.' })
    .min(1, { error: 'Enter the number of floors.' })
    .max(200, { error: 'Enter 200 floors or fewer.' }),
  pricePerSqft: requiredText('Enter the price per sqft.', 120),
  landmark: optionalText(500),
  facilities: facilityListSchema,
  specialOffer: optionalText(200),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD'], { error: 'Choose a status.' }),
  constructionStatus: z.enum(['READY', 'UNDER_CONSTRUCTION', 'UPCOMING'], {
    error: 'Choose a construction status.',
  }),
  handoverDate: optionalText(120),
  driveLink: optionalUrl('Enter a valid drive link.'),
  youtubeVideoUrl: optionalYoutubeUrlSchema,
  mapEmbedLink: optionalUrl('Enter a valid map URL.'),
  isFeatured: z.boolean(),
  published: z.boolean(),
  installmentFacility: optionalText(500),
  images: projectImageListSchema,
});

export type TFlatFormValues = z.infer<typeof flatFormSchema>;

export const FLAT_FORM_DEFAULTS = {
  name: '',
  title: '',
  slug: '',
  propertyType: 'RESIDENTIAL',
  address: '',
  district: '',
  description: '',
  shortIntro: '',
  buildingTotalFloors: 1,
  pricePerSqft: '',
  landmark: '',
  facilities: [],
  specialOffer: '',
  status: 'AVAILABLE',
  constructionStatus: 'UNDER_CONSTRUCTION',
  handoverDate: '',
  driveLink: '',
  youtubeVideoUrl: '',
  mapEmbedLink: '',
  isFeatured: false,
  published: false,
  installmentFacility: '',
  images: [],
} as const satisfies TFlatFormValues;

export type TFlatField = (typeof FLAT_FIELDS)[number];

export type TFlatFieldErrors = Partial<Record<TFlatField, string>>;

export type TFlatSaveResult =
  { ok: true } | { ok: false; message: string } | { ok: false; fieldErrors: TFlatFieldErrors };

function isFlatField(value: string): value is TFlatField {
  return FLAT_FIELDS.some((field) => field === value);
}

export function readFlatFieldErrors(error: z.ZodError): TFlatFieldErrors {
  const fieldErrors: TFlatFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && isFlatField(field) && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
