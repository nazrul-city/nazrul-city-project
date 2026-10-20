import { type NextRequest, NextResponse } from 'next/server';
import { logger, withRequestLogging } from '@/lib/logger';

type THealthByIdRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Readonly<THealthByIdRouteContext>) {
  return withRequestLogging(request, async () => {
    const { id } = await context.params;

    logger.info(`health by id: ${id}`);

    return NextResponse.json({ id }, { status: 200 });
  });
}
