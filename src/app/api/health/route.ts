import { NextResponse } from 'next/server';

import { catchAsync } from '@/lib/errors';
import { logger, withRequestLogging } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import type { TApiSuccessBody } from '@/types/api-response';

const HEALTH_MESSAGE = 'The server is healthy.' as const;

export async function GET(request: Request) {
  return withRequestLogging(
    request,
    catchAsync(async () => {
      // The success message is sent only after Postgres answers.
      await prisma.$queryRaw`SELECT 1`;

      logger.info('health check ok');

      const body = {
        success: true,
        statusCode: 200,
        message: HEALTH_MESSAGE,
        data: null,
      } satisfies TApiSuccessBody<null>;

      return NextResponse.json(body, { status: body.statusCode });
    })
  );
}
