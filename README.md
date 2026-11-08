# Nazrul City

Real-estate website for Nazrul City: a public site for land, plots, and flats, plus an admin area for publishing those listings.

[![CI](https://github.com/nazrul-city/nazrul-city-project/actions/workflows/ci.yml/badge.svg)](https://github.com/nazrul-city/nazrul-city-project/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-24.22.0-339933)](.nvmrc)
[![pnpm](https://img.shields.io/badge/pnpm-11.28.6-F69220)](package.json)
[![License](https://img.shields.io/badge/license-MIT-blue)](package.json)

The public site is in Bangla. This file is for people who build and run the application.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Database](#database)
- [Admin](#admin)
- [Quality checks](#quality-checks)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Overview

Nazrul City is a Next.js application. Visitors browse published plots and flats. Staff sign in to the admin area to create and edit those listings.

The tagline on the site is **আমাদের সিটি, শান্তির ঘাঁটি**. Shared site copy (name, phones, address, navigation) lives in [`src/config/site.ts`](src/config/site.ts).

Pages stay thin. A route file in `src/app` composes a feature. Feature code stays in `src/features`. That split keeps a listing change inside the listing feature, and keeps the public layout separate from the admin layout.

## Features

**Public site**

- Home page: hero, services, how we work, FAQ, partners, and a contact section. The contact form does not save a lead yet.
- About page
- Published plot and flat catalogs, each with a detail page
- Listing images, maps, video, facilities, and special offers
- Light and dark theme. The default follows the system setting. A toggle in the navbar and the admin header switches it.

**Admin**

- Email and password sign-in, with an `httpOnly` session cookie
- Two roles: `ADMIN` and `SUPER_ADMIN`
- Create, edit, and publish land projects and flat projects
- Image upload to Cloudinary (up to 15 JPEG, PNG, or WebP files, 5 MB each)
- Super-admin tools for other admin accounts

Leads, website contact settings, and the dashboard counts are still placeholders. See [`doc/auth.md`](doc/auth.md).

## Tech stack

| Area            | Choice                                                     |
| --------------- | ---------------------------------------------------------- |
| App             | Next.js 16 (App Router), React 19, TypeScript (strict)     |
| UI              | Tailwind CSS v4, shadcn/ui, Base UI, Lucide                |
| Data            | PostgreSQL, Prisma ORM 7                                   |
| Forms           | React Hook Form, Zod                                       |
| Images          | Cloudinary (unsigned upload preset)                        |
| Auth            | Signed session cookie, passwords hashed with Node `scrypt` |
| Observability   | Sentry, Pino                                               |
| Package manager | pnpm 11 (Node 24)                                          |
| Git hooks       | Husky, lint-staged, commitlint                             |

Dev and production builds use Webpack (`--webpack` in the `package.json` scripts). The Sentry settings in [`next.config.ts`](next.config.ts) are written for Webpack.

## Prerequisites

- Node.js `24.22.0` (see [`.nvmrc`](.nvmrc))
- pnpm `11.28.6` (see `packageManager` in [`package.json`](package.json))
- PostgreSQL you can reach with a connection URL
- Git

With nvm and Corepack:

```bash
nvm install
nvm use
corepack enable
corepack prepare pnpm@11.28.6 --activate
```

## Getting started

```bash
git clone https://github.com/nazrul-city/nazrul-city-project.git
cd nazrul-city-project
pnpm install
cp .env.example .env
```

Fill in `.env` before the app will start. A blank copy of the example fails the checks in [Environment variables](#environment-variables). Then apply migrations and start the app:

```bash
pnpm db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin sign-in is [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Confirm the database connection:

```bash
curl http://localhost:3000/api/health
```

A healthy response is HTTP 200 with `"success": true`. The route answers only after PostgreSQL responds.

## Environment variables

Copy [`.env.example`](.env.example) to `.env`. Do not commit `.env`.

Next.js reads `.env`. A local `.env.local` overrides it. Prisma CLI reads `.env` through `dotenv` in [`prisma.config.ts`](prisma.config.ts). On a host such as Vercel, set the same names in the project environment. No env file is required there.

The app checks these values at startup with Zod. A missing or badly shaped value stops the process. App code imports them from `@/config/env`. It does not read `process.env` directly.

| Variable                               | Required | Purpose                                                                       |
| -------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `DATABASE_URL`                         | Yes      | PostgreSQL URL. For a host that needs TLS, use `sslmode=verify-full`.         |
| `LOG_LEVEL`                            | No       | Pino level: `fatal`, `error`, `warn`, or `info`. Default `info`.              |
| `AUTH_SECRET`                          | Yes      | Signs the admin session cookie. At least 32 random characters.                |
| `ADMIN_EMAIL`                          | Yes      | Email of the first super admin, created on first login when `users` is empty. |
| `ADMIN_PASSWORD`                       | Yes      | Password for that first account. 8 to 72 characters. Stored only as a hash.   |
| `NEXT_PUBLIC_SENTRY_DSN`               | Yes      | Browser error reporting. Must be a URL.                                       |
| `SENTRY_DSN`                           | No       | Server and edge reporting. Falls back to the public DSN when unset.           |
| `SENTRY_ORG`                           | Yes      | Sentry organization slug, used when uploading source maps.                    |
| `SENTRY_PROJECT`                       | Yes      | Sentry project slug.                                                          |
| `SENTRY_AUTH_TOKEN`                    | Yes      | Token with `project:releases` scope, used at build time.                      |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | No       | Cloudinary cloud name. Upload stays off until this and the preset are set.    |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | No       | Unsigned upload preset for plot and flat images.                              |

`NEXT_PUBLIC_*` values are visible in the browser. Do not put secrets in those names.

## Scripts

| Script              | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `pnpm dev`          | Start the local dev server.                                        |
| `pnpm build`        | Generate the Prisma client, then create a production build.        |
| `pnpm start`        | Serve the production build. Run `pnpm build` first.                |
| `pnpm typecheck`    | Type-check without emitting files.                                 |
| `pnpm lint`         | Run ESLint.                                                        |
| `pnpm lint:fix`     | Run ESLint and apply safe fixes.                                   |
| `pnpm format`       | Format the repo with Prettier and format the Prisma schema.        |
| `pnpm format:check` | Check formatting without writing files.                            |
| `pnpm db:generate`  | Generate the Prisma client into `src/generated/prisma`.            |
| `pnpm db:migrate`   | Create and apply migrations in development (`prisma migrate dev`). |
| `pnpm db:deploy`    | Apply existing migrations in production (`prisma migrate deploy`). |
| `pnpm db:studio`    | Open Prisma Studio.                                                |
| `pnpm db:status`    | Show migration status.                                             |
| `pnpm db:validate`  | Validate `prisma/schema.prisma`.                                   |

## Project structure

```text
src/
├── app/                  Routes, layouts, and metadata
│   ├── (public)/         Public site (navbar and footer)
│   ├── admin/            Admin login and panel
│   └── api/health/       Database health check
├── features/             Feature modules (UI, actions, queries)
├── components/
│   ├── ui/               Design-system primitives
│   ├── layout/           Navbar, footer, and other shell pieces
│   └── shared/           Components used by more than one feature
├── config/               Site copy and validated environment variables
├── lib/                  Prisma, auth, logging, and error helpers
├── hooks/                Shared hooks
├── providers/            App-wide providers (theme)
├── types/                Shared TypeScript types
└── utils/                Small pure helpers
prisma/
├── schema.prisma
└── migrations/
```

A feature that only one area uses stays inside `src/features/<name>`. Something used by two features moves to `components/shared`, `hooks`, or `utils`. Features do not import each other's private files. They import what `index.ts` exports.

Colors, type scale, radius, and shadows live in [`src/app/globals.css`](src/app/globals.css). Change a token there when the whole site should pick it up.

## Routes

| Path                   | Who         | Purpose                     |
| ---------------------- | ----------- | --------------------------- |
| `/`                    | Public      | Home                        |
| `/about-us`            | Public      | About                       |
| `/plots`               | Public      | Published land projects     |
| `/plots/[slug]`        | Public      | One plot                    |
| `/flats`               | Public      | Published flats             |
| `/flats/[slug]`        | Public      | One flat                    |
| `/admin/login`         | Public      | Admin sign-in               |
| `/admin`               | Signed in   | Admin home                  |
| `/admin/land-projects` | Signed in   | Plot list, create, and edit |
| `/admin/flat-projects` | Signed in   | Flat list, create, and edit |
| `/admin/admins`        | Super admin | Admin accounts              |
| `/admin/leads`         | Signed in   | Placeholder                 |
| `/admin/contact`       | Signed in   | Placeholder                 |
| `GET /api/health`      | Public      | PostgreSQL health check     |

Unpublished listings stay off the public catalog.

## Database

PostgreSQL is the only database. Prisma ORM 7 owns the schema in [`prisma/schema.prisma`](prisma/schema.prisma). The generated client is written to `src/generated/prisma` (do not edit it by hand).

Main models:

- `User` — admin accounts only. There is no public customer account.
- `Plot` and `PlotImage` — land projects.
- `Flat` and `FlatImage` — flat and commercial units.

`Plot` and `Flat` use a `published` flag. The public lists only published rows.

Local development:

```bash
pnpm db:migrate
```

A server applies migrations that already exist. It does not create new ones:

```bash
pnpm db:deploy
```

CI does not run migrations. See [Continuous integration](CONTRIBUTING.md#5-continuous-integration).

`pnpm build` runs `prisma generate`, so a normal production build has a client that matches the schema.

## Admin

1. Set `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
2. Apply migrations so the `users` table exists.
3. Open `/admin/login` and sign in with that email and password.

If `users` is empty, that first successful login creates a `SUPER_ADMIN`. Later admin accounts are created inside the panel. A `SUPER_ADMIN` can create an admin, turn that account on or off, and delete it. Changing a password is not built yet. An `ADMIN` manages listings. Passwords are stored as `scrypt` hashes. Role details are in [`doc/auth.md`](doc/auth.md).

Image upload needs both Cloudinary variables. Until they are set, the rest of the site still runs and the upload control stays disabled.

## Quality checks

Before a pull request:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

Git hooks run on commit: lint-staged formats the staged files, and commitlint checks the message. Use [Conventional Commits](https://www.conventionalcommits.org/), for example `feat: add plot detail map` or `fix: keep unpublished plots off the public list`.

GitHub Actions on `main` and `development` runs lint, typecheck, format check, build, and security scans. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

Pull requests target `development`. Promotion into `main` goes from `development` only. Details are in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Documentation

| Doc                                                | What it covers                                         |
| -------------------------------------------------- | ------------------------------------------------------ |
| [`doc/README.md`](doc/README.md)                   | Index of the guides in `doc/`                          |
| [`doc/architecture.md`](doc/architecture.md)       | Where routes, features, and shared UI live             |
| [`doc/coding-patterns.md`](doc/coding-patterns.md) | How a feature is written                               |
| [`doc/design-tokens.md`](doc/design-tokens.md)     | Where to change color, type, radius, and shadow        |
| [`doc/database.md`](doc/database.md)               | Schema, relations, and migrations                      |
| [`doc/auth.md`](doc/auth.md)                       | Admin sign-in, roles, and unfinished admin work        |
| [`doc/listings.md`](doc/listings.md)               | Plots, flats, and publish rules                        |
| [`doc/images.md`](doc/images.md)                   | Cloudinary upload limits                               |
| [`doc/rich-text.md`](doc/rich-text.md)             | Description editor and HTML allowlist                  |
| [`doc/env.md`](doc/env.md)                         | How environment variables are checked                  |
| [`doc/errors.md`](doc/errors.md)                   | API errors and Sentry setup                            |
| [`doc/logger.md`](doc/logger.md)                   | Pino logging                                           |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)               | Branches, commits, and what CI runs                    |
| [`SECURITY.md`](SECURITY.md)                       | How to report a vulnerability, and which CI checks run |
| [`AGENTS.md`](AGENTS.md)                           | Rules for coding agents working in this repo           |

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). Short version: branch from `development`, open the pull request against `development`, and keep the CI checks green.

Questions: [grihiniworld@gmail.com](mailto:grihiniworld@gmail.com).

## Security

Report vulnerabilities in private. Do not open a public issue. The process and response window are in [`SECURITY.md`](SECURITY.md).

Never commit `.env` files, database URLs, `AUTH_SECRET`, or `SENTRY_AUTH_TOKEN`.

## License

MIT, as declared in [`package.json`](package.json).
