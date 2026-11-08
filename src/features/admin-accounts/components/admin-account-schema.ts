import { z } from 'zod';

export const createAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Enter a name.' })
    .max(80, { error: 'Name must be 80 characters or fewer.' }),
  email: z
    .string()
    .trim()
    .min(1, { error: 'Enter an email address.' })
    .max(254, { error: 'Enter a valid email address.' })
    .email({ error: 'Enter a valid email address.' })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { error: 'Password must be 8 to 72 characters.' })
    .max(72, { error: 'Password must be 8 to 72 characters.' }),
});

export type TCreateAdminValues = z.infer<typeof createAdminSchema>;

export const CREATE_ADMIN_DEFAULT_VALUES = {
  name: '',
  email: '',
  password: '',
} as const satisfies TCreateAdminValues;

export const updateAdminStatusSchema = z.object({
  userId: z.string().min(1),
  isActive: z.boolean(),
});

export const deleteAdminSchema = z.object({
  userId: z.string().min(1),
});
