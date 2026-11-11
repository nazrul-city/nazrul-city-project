'use server';

import { revalidatePath } from 'next/cache';
import { SITE_CONTACT_ID } from '@/config/site-contact';
import {
  readSiteContactFieldErrors,
  siteContactFormSchema,
  type TSiteContactFormValues,
  type TSiteContactSaveResult,
} from '@/features/site-contact/components/site-contact-form-schema';
import { readActiveAdmin } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const SAVE_DENIED = 'You do not have access to save these contact details.';

export async function updateSiteContact(
  values: TSiteContactFormValues
): Promise<TSiteContactSaveResult> {
  const admin = await readActiveAdmin();

  if (!admin) {
    return { ok: false, message: SAVE_DENIED };
  }

  const parsed = siteContactFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readSiteContactFieldErrors(parsed.error) };
  }

  await prisma.siteContact.upsert({
    where: { id: SITE_CONTACT_ID },
    create: { id: SITE_CONTACT_ID, ...parsed.data },
    update: parsed.data,
  });

  logger.info('site contact updated');
  // The footer shows these details on every public page.
  revalidatePath('/', 'layout');
  revalidatePath('/admin/contact');
  return { ok: true };
}
