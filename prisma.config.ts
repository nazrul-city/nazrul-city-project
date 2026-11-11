import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma ORM CLI config only (generate / migrate / studio).
 *
 * Why dotenv here: the Prisma CLI is plain Node — it does not load Next.js
 * `.env` files. Official Prisma 7 + Next.js docs use `import "dotenv/config"`.
 *
 * Why not `@/config/env`: path aliases and the Next env module are not
 * available to the Prisma CLI. Runtime app code still uses `@/config/env`.
 *
 * This is Prisma ORM — not Prisma Composer / platform deploy.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Provide a fallback placeholder so `prisma generate` and CI builds succeed
    // without requiring a live database connection or runtime secrets.
    url:
      // eslint-disable-next-line no-process-env
      process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  },
});
