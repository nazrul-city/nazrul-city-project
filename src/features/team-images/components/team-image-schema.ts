import { z } from 'zod';
import { isAllowedProjectImageUrl } from '@/utils/project-image-url';

export const addTeamImageSchema = z.object({
  caption: z.string().min(1, { message: 'Caption is required.' }).max(200, {
    message: 'Caption must be 200 characters or fewer.',
  }),
  imageUrl: z
    .string()
    .url({ message: 'Upload the image first.' })
    .refine(isAllowedProjectImageUrl, { message: 'Upload the image again.' }),
});

export type TAddTeamImageValues = z.infer<typeof addTeamImageSchema>;

export type TAddTeamImageResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<keyof TAddTeamImageValues, string>>;
    };
