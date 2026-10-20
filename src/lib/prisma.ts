import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@/config/env';
import { PrismaClient } from '@/generated/prisma/client';

/**
 * Server-only Prisma Client singleton (Prisma ORM 7 + pg adapter).
 *
 * Use from Server Components, Route Handlers, and Server Actions only.
 * Never import this into Client Components.
 *
 * Why globalThis in development: Next.js HMR re-evaluates modules and would
 * otherwise open a new connection pool on every reload.
 *
 * @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
 */
const globalForPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
