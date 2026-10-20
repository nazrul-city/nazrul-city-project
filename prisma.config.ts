import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

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
    url: env('DATABASE_URL'),
  },
});
