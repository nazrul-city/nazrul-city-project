# Documentation

Guides for how Nazrul City works. Install steps, the environment variable table, and the route list stay in the [root README](../README.md).

Each guide describes the code that exists today and links to the source file. A feature that is still a placeholder is named as unfinished. It is not written up as if it already ships.

## When a feature gets its own file

Add `doc/<feature>.md` when all three are true:

- The behavior is split across more than one file.
- A wrong edit can break security, stored data, or both the admin and the public site.
- The rules are not obvious from the component that renders the screen.

A single screen, a single form schema, or a placeholder stays as a short note inside the guide that uses it. Name the file after the feature, link it from this index, and link it from the guide that depends on it.

## Guides

**Start here**

- [Architecture](./architecture.md) — where a new file goes. It does not list every component.
- [Coding patterns](./coding-patterns.md) — how a feature is written. The full agent rule list stays in [AGENTS.md](../AGENTS.md).
- [Design tokens](./design-tokens.md) — where to change color, type, radius, and shadow. The values stay in CSS.

**Product**

- [Database](./database.md) — tables, enums, and migrations. Prisma error codes stay in [Errors](./errors.md).
- [Auth](./auth.md) — admin sign-in, roles, and what is not built yet.
- [Listings](./listings.md) — plots and flats, including who can publish and delete. Image and HTML rules are separate.
- [Images](./images.md) — Cloudinary upload limits. It does not cover the rest of the listing form.
- [Rich text](./rich-text.md) — the description editor and the HTML allowlist.

**Engineering**

- [Environment variables](./env.md) — how values are checked at startup. The name-by-name table stays in the [root README](../README.md).
- [Errors](./errors.md) — the JSON error shape for route handlers, and the Sentry browser, server, and edge setup.
- [Logger](./logger.md) — Pino request logs.

GitHub workflows and local git hooks are in [CONTRIBUTING.md](../CONTRIBUTING.md#5-continuous-integration). How to report a vulnerability stays in [SECURITY.md](../SECURITY.md).

Landing sections, the about page, and the theme toggle do not have their own guides. The home contact form validates in the browser and does not save a lead.
