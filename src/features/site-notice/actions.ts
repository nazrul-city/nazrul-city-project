'use server';

import { revalidatePath } from 'next/cache';
import {
  readSiteNoticeFieldErrors,
  siteNoticeFormSchema,
  type TSiteNoticeFormValues,
  type TSiteNoticeSaveResult,
} from '@/features/site-notice/components/site-notice-form-schema';
import { readActiveAdmin } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const SAVE_DENIED = 'You do not have access to save this notice.';

export async function updateSiteNotice(
  values: TSiteNoticeFormValues
): Promise<TSiteNoticeSaveResult> {
  const admin = await readActiveAdmin();

  if (!admin) {
    return { ok: false, message: SAVE_DENIED };
  }

  const parsed = siteNoticeFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: readSiteNoticeFieldErrors(parsed.error) };
  }

  await prisma.siteNotice.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      message: parsed.data.message,
      isEnabled: parsed.data.isEnabled,
    },
    update: {
      message: parsed.data.message,
      isEnabled: parsed.data.isEnabled,
    },
  });

  logger.info('site notice updated');
  revalidatePath('/');
  revalidatePath('/admin/site-notice');
  return { ok: true };
}
