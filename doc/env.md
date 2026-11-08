# Environment variables

How Nazrul City loads and checks configuration. The name, required flag, and purpose of each variable are in the [root README](../README.md). This file is why a blank `.env.example` does not boot.

**Server schema:** [`src/config/env/server.ts`](../src/config/env/server.ts)  
**Client schema:** [`src/config/env/client.ts`](../src/config/env/client.ts)  
**Example file:** [`.env.example`](../.env.example)

See also: [Errors](./errors.md) (Sentry setup), [Database](./database.md), [Contributing](../CONTRIBUTING.md#5-continuous-integration)

---

## Goals

- A missing or badly shaped value stops the process at startup.
- Secrets stay on the server.
- App code has one import for configuration.

---

## The modules

`@t3-oss/env-nextjs` builds two objects and Zod checks them.

- [`server.ts`](../src/config/env/server.ts) holds `DATABASE_URL`, logging, Sentry server values, and admin auth. `NODE_ENV` is shared so the browser bundle can read that one value.
- [`client.ts`](../src/config/env/client.ts) holds only `NEXT_PUBLIC_*` values.
- [`index.ts`](../src/config/env/index.ts) merges them. Import `env` from `@/config/env`.

`emptyStringAsUndefined` is on. An empty string is treated as missing. A required URL or a `min(1)` string then fails. That is why the Sentry DSN, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` cannot be left blank in `.env.example`.

`NEXT_PUBLIC_*` values are inlined into the browser bundle. Do not put a secret in those names. Cloudinary upload uses two public values and no API secret. See [Images](./images.md).

---

## Where the values come from

Next.js reads `.env`, then `.env.local` overrides it. Copy `.env.example` to `.env` and fill the required keys before `pnpm dev`.

The Prisma CLI is not Next.js, so [`prisma.config.ts`](../prisma.config.ts) loads `.env` with `dotenv` and reads `DATABASE_URL` itself. That file cannot import `@/config/env` because the CLI has no Next.js path aliases.

Sentry init and [`next.config.ts`](../next.config.ts) both import `env`.

On a host, set the same names as project environment variables. No env file is required there.

Do not commit `.env` or `.env.local`.

---

## CI

The build job in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) injects `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, and `NEXT_PUBLIC_SENTRY_DSN` from GitHub secrets. It does not inject `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, or `ADMIN_PASSWORD`. A local `pnpm build` still needs the full set, because the schema checks them.

---

## Related files

- [`src/config/env/server.ts`](../src/config/env/server.ts)
- [`src/config/env/client.ts`](../src/config/env/client.ts)
- [`src/config/env/index.ts`](../src/config/env/index.ts)
- [`prisma.config.ts`](../prisma.config.ts)
- [`.env.example`](../.env.example)
