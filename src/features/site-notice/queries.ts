import 'server-only';

import {
  SITE_NOTICE_DEFAULTS,
  type TSiteNoticeFormValues,
} from '@/features/site-notice/components/site-notice-form-schema';
import { prisma } from '@/lib/prisma';

export type TSiteNotice = {
  message: string;
  isEnabled: boolean;
};

export async function getSiteNotice(): Promise<TSiteNotice> {
  const notice = await prisma.siteNotice.findUnique({
    where: { id: 'default' },
    select: {
      message: true,
      isEnabled: true,
    },
  });

  if (!notice) {
    return {
      message: SITE_NOTICE_DEFAULTS.message,
      isEnabled: SITE_NOTICE_DEFAULTS.isEnabled,
    };
  }

  return {
    message: notice.message,
    isEnabled: notice.isEnabled,
  };
}

export async function getSiteNoticeFormValues(): Promise<TSiteNoticeFormValues> {
  const notice = await getSiteNotice();

  return {
    message: notice.message,
    isEnabled: notice.isEnabled,
  };
}
