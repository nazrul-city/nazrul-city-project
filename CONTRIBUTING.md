# Contributing Guidelines

Thank you for your interest in contributing to Nazrul City! To maintain code quality and ensure a smooth review process, please follow these guidelines.

---

## 1. Prerequisites

Before getting started, ensure you have the following installed locally:

- **Node.js**: `24.22.0` (24.x LTS) — see `.nvmrc` (`node -v`)
- **pnpm**: `11.28.6` (matches `packageManager` in `package.json`) (`pnpm -v`)
- **Git**: Latest version

If you use nvm:

```bash
nvm install   # reads .nvmrc → 24.22.0
nvm use
corepack enable
corepack prepare pnpm@11.28.6 --activate
```

---

## 2. Development Workflow

### Step 1: Fork & Clone

```bash
# Fork the repository on GitHub, then clone your fork:
git clone https://github.com/nazrul-city/nazrul-city-project.git
cd nazrul-city-project
pnpm install
```

### Step 2: Create a Feature Branch

Always create your branch off the **`development`** branch (never off `main`):

```bash
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

#### Branch Naming Conventions:

- `feature/*` — New pages, UI components, or features
- `fix/*` — Bug fixes or visual corrections
- `perf/*` — Performance optimizations
- `docs/*` — Documentation improvements
- `refactor/*` — Code restructuring without feature changes
- `chore/*` — Tooling, dependency, or config updates

### Step 3: Run Locally & Make Changes

Start the Next.js local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to preview your changes in real-time.

### Step 4: Validate Code Quality

Before committing, ensure all automated verification checks pass:

```bash
pnpm lint          # ESLint check
pnpm typecheck     # TypeScript strict compilation check
pnpm format:check  # Prettier style check
pnpm build         # Production Next.js build verification
```

### Step 5: Commit with Conventional Commits

Commit messages must strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
git commit -m "feat: add property listing card component"
git commit -m "fix: resolve navigation drawer scroll lock on mobile"
```

> **Automated Git Hooks (Husky):**
> Upon committing, Husky runs `lint-staged` and `commitlint`. lint-staged runs ESLint and Prettier on the staged files, and `prisma format` on staged Prisma files. commitlint rejects a message that is not a Conventional Commit.

### Step 6: Push & Open a Pull Request

```bash
git push origin feature/your-feature-name
```

> [!IMPORTANT]
> **All Pull Requests MUST target the `development` branch.**
> PRs directly targeting `main` will be automatically rejected by CI branch validation rules.

---

## 3. Pull Request Checklist

When opening a Pull Request:

- [ ] PR targets the `development` branch.
- [ ] PR title adheres to Conventional Commits (e.g., `feat: ...`, `fix: ...`).
- [ ] All CI checks pass (lint, typecheck, format, build, and security scans).
- [ ] The PR template description and checklist are completed.
- [ ] Screenshots or recordings are provided for any visual UI changes.

---

## 4. Code Style & Standards

- **Imports**: Always use the `@/*` alias for internal paths (`@/components/...`, `@/lib/...`).
- **Types**: Use explicit type imports: `import type { ComponentProps } from 'react'`.
- **Variables**: Prefix intentionally unused variables with an underscore (e.g., `_event`).
- **Formatting**: Enforced via Prettier — avoid manual reformatting outside project rules.
- **Logging**: Never leave `console.log` in production code; use `console.warn` or `console.error` only when necessary.

---

## 5. Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request to `main` and `development`. A new push cancels the previous run for that ref.

Node is `24.22.0`, the same pin as [`.nvmrc`](.nvmrc). Install uses `pnpm install --frozen-lockfile`.

The Lint, Typecheck, Format, and Build jobs run the same commands as [Step 4](#step-4-validate-code-quality).

| Job               | What it does                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Install           | Installs dependencies and caches `node_modules`                                                   |
| Lint              | `pnpm lint`                                                                                       |
| Typecheck         | `pnpm typecheck`                                                                                  |
| Format            | `pnpm format:check`                                                                               |
| Build             | `pnpm build`                                                                                      |
| Secret scanning   | Gitleaks on the git history                                                                       |
| CodeQL            | JavaScript and TypeScript security queries                                                        |
| Dependency review | Pull requests only. `continue-on-error` is set, so a finding does not fail the workflow by itself |
| Security audit    | `pnpm audit --audit-level=high`                                                                   |

The build job receives `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, and `NEXT_PUBLIC_SENTRY_DSN` from GitHub secrets. It does not receive `DATABASE_URL` or the admin auth variables. CI does not run `pnpm db:migrate` or `pnpm db:deploy`.

| Workflow                                                             | When                                                 | What                                                                                                                      |
| -------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [`validate-pr-target.yml`](.github/workflows/validate-pr-target.yml) | Pull request into `main`                             | The branch must be `development`, the author must be the repository owner, and the pull request must not come from a fork |
| [`dependency-audit.yml`](.github/workflows/dependency-audit.yml)     | Mondays at 09:00 UTC, pull requests, and manual runs | `pnpm audit --audit-level=high`                                                                                           |
| [`lighthouse.yml`](.github/workflows/lighthouse.yml)                 | Pull requests to `main` and `development`            | Builds the app, starts it, and runs Lighthouse against `http://localhost:3000`                                            |

How to report a vulnerability is in [`SECURITY.md`](SECURITY.md).

---

## 6. Release Process (Maintainers Only)

1. PRs are reviewed and merged into `development`.
2. A promotion PR is created from `development` → `main`.
3. After merging into `main`, the **Release workflow** is triggered via GitHub Actions.
4. The workflow calculates the SemVer bump, updates `package.json`, tags the commit, and creates a GitHub Release.

---

## Questions or Need Help?

If you have questions, encounter a bug, or want to discuss an idea:

- Open an issue on GitHub.
- Reach out via email: [grihiniworld@gmail.com](mailto:grihiniworld@gmail.com)
