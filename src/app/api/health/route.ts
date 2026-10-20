import { NextResponse } from 'next/server';

import { logger, withRequestLogging } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  return withRequestLogging(request, async () => {
    await prisma.test.create({
      data: {
        name: 'Test',
        description: 'Test description',
      },
    });

    logger.error('health check ok');

    return NextResponse.json({ message: 'Hello, world!' }, { status: 203 });
  });
}
