import 'server-only';

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@/config/env';
import { PrismaClient } from '@/generated/prisma/client';
import { logger } from '@/lib/logger';

const GLOBAL_PRISMA_KEY = 'prismaClient';

type TStoredPrisma = {
  client: PrismaClient;
  schemaId: string;
};

/**
 * True when the value is the Prisma client stored on `globalThis`.
 * A type guard is used so the dev singleton does not need a cast.
 */
function isPrismaClient(value: unknown): value is PrismaClient {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return '$queryRaw' in value && '$disconnect' in value && '$transaction' in value;
}

function isStoredPrisma(value: unknown): value is TStoredPrisma {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('client' in value) || !('schemaId' in value)) {
    return false;
  }

  return isPrismaClient(value.client) && typeof value.schemaId === 'string';
}

/**
 * Fingerprint of prisma/schema.prisma. The dev singleton is replaced when this
 * changes, so a renamed table is not queried by a client created earlier.
 */
function readSchemaId(): string {
  const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf8');
  return createHash('sha256').update(schema).digest('hex');
}

function disconnectPrismaClient(client: PrismaClient): void {
  void client.$disconnect().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown disconnect error';
    logger.error(`database client disconnect failed: ${message}`);
  });
}

function readDevPrismaClient(): PrismaClient {
  const schemaId = readSchemaId();
  const stored: unknown = Reflect.get(globalThis, GLOBAL_PRISMA_KEY);

  if (isStoredPrisma(stored) && stored.schemaId === schemaId) {
    return stored.client;
  }

  if (isStoredPrisma(stored)) {
    disconnectPrismaClient(stored.client);
  } else if (isPrismaClient(stored)) {
    disconnectPrismaClient(stored);
  }

  const client = createPrismaClient();
  const next: TStoredPrisma = { client, schemaId };
  Reflect.set(globalThis, GLOBAL_PRISMA_KEY, next);
  return client;
}

/**
 * Server-only Prisma Client singleton (Prisma ORM 7 + pg adapter).
 *
 * Use from Server Components, Route Handlers, and Server Actions only.
 * Never import this into Client Components.
 *
 * Why globalThis in development: Next.js HMR re-evaluates modules and would
 * otherwise open a new connection pool on every reload. When this module loads,
 * a changed prisma/schema.prisma replaces the saved client so new models are used.
 *
 * @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
 */
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg(
    { connectionString: env.DATABASE_URL },
    {
      onPoolError(error) {
        logger.error(`database pool error: ${error.message}`);
      },
    }
  );

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = env.NODE_ENV === 'production' ? createPrismaClient() : readDevPrismaClient();
