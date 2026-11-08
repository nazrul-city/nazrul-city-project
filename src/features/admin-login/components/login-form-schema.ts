import { z } from 'zod';

export const INVALID_LOGIN_MESSAGE = 'Invalid email or password.';

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: 'Enter your email address.' })
    .max(254, { error: 'Enter a valid email address.' })
    .email({ error: 'Enter a valid email address.' })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { error: 'Password must be 8 to 72 characters.' })
    .max(72, { error: 'Password must be 8 to 72 characters.' }),
});

export type TLoginFormValues = z.infer<typeof loginFormSchema>;

export const LOGIN_FORM_DEFAULT_VALUES = {
  email: '',
  password: '',
} as const satisfies TLoginFormValues;
