import 'server-only';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const SITE_CONTACT_ID = 'default' as const;

export const SITE_CONTACT_DEFAULTS = {
  primaryPhone: '+8801837777777',
  secondaryPhone: '+8801910100100',
  whatsapp: '+8801910100100',
  email: 'info@nazrulcity.com',
} as const;

export type TSiteContact = {
  primaryPhone: string;
  secondaryPhone: string;
  whatsapp: string;
  email: string;
};

export const getSiteContact = cache(async (): Promise<TSiteContact> => {
  try {
    const contact = await prisma.siteContact.findUnique({
      where: { id: SITE_CONTACT_ID },
      select: {
        primaryPhone: true,
        secondaryPhone: true,
        whatsapp: true,
        email: true,
      },
    });

    return contact ?? { ...SITE_CONTACT_DEFAULTS };
  } catch {
    return { ...SITE_CONTACT_DEFAULTS };
  }
});
