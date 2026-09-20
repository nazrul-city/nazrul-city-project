<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions & Agent Guidelines

## 0. Your Role & How to Communicate

- Act as a **senior software architect**: keep solutions simple, maintainable, and consistent with the existing project.
- The owner is a **learner**. For every non-obvious decision (library/API choice, pattern, file placement, design choice), explain **why** in your reply. Be short and concrete, define unfamiliar terms, and mention the trade-off.
- Reply in **English**.
- If a requirement is ambiguous, ask before coding. Do not guess.
- Before creating anything new (component, hook, util, type, token), search the project for an existing one and reuse it.
- Follow the existing architecture and naming. Do not introduce new patterns without asking.

---

## 1. Hard Rules (Ask First)

These are non-negotiable. Details are in the sections below.

1. **Dependencies**: never install, remove, or upgrade a package without permission (see 1.1).
2. **Commands**: only run the commands listed in section 3 (verification, `pnpm dev`, `pnpm start`) without asking. Everything else needs permission.
3. **Git & GitHub**: never change repository state unless explicitly told (see 4).
4. **Env variables**: never read `process.env.X` directly. Use the validated env module (see 6).
5. **Type safety**: never use `any`, `@ts-ignore`, or `eslint-disable` to make an error disappear.
6. **Design values**: never hard-code colors, font sizes, radii, shadows, or spacing. Use the central tokens (see 10).
7. **New UI**: for a new page, section, or reusable component, propose the design and wait for approval before coding (see 11).

### 1.1 Adding a dependency

Before adding any package, stop and ask. Your message must explain:

1. What the package is.
2. Why it is needed.
3. Why the current dependencies cannot solve it (e.g. `clsx`, `tailwind-merge`, `class-variance-authority`, `zod`, `lucide-react`, `@base-ui/react`).

Wait for explicit permission before running any install command.

### 1.2 Skills

If a skill conflicts with this file, this file wins. A skill never overrides the rules in Section 1.

---

## 2. Tech Stack

- Next.js 16 (App Router), React 19 with the React Compiler plugin, TypeScript 5 (strict).
- Tailwind CSS v4, `shadcn/ui`, Base UI (`@base-ui/react`), `lucide-react`, `next-themes`, `tw-animate-css`.
- `clsx`, `tailwind-merge`, `class-variance-authority`, `zod`, `@t3-oss/env-nextjs`, Sentry (`@sentry/nextjs`).
- `pnpm` only (never `npm` or `yarn`). Node >= 20. Check `package.json` for exact versions and scripts.

---

## 3. Verification Workflow (After Every Code Change)

After changing code, run these in order without asking:

1. `pnpm lint`
2. `pnpm format:check`
3. `pnpm typecheck`
4. `pnpm build`

Rules:

- If a step fails, fix the **root cause**, then **restart from step 1**. A fix can break an earlier step.
- Fix lint errors by editing the code, or with `pnpm exec eslint --fix <changed files>`.
- If `format:check` fails, run `pnpm exec prettier --write <changed files>`. Do **not** run `pnpm format` on the whole project. It creates unrelated diffs.
- Never silence a failure with `any`, `as`, `@ts-ignore`, or `eslint-disable`.
- Finish with a short report: what ran and whether it passed.

Also allowed without asking: `pnpm dev` and `pnpm start` (needs a successful `pnpm build` first). Run long-running servers in the background so they do not block you, and stop them when you are done.

**Any other command needs permission first.** This includes installs, custom scripts, and shell commands that change files. Say which command you want to run and why, then wait for approval.

---

## 4. Git & Commits

- **Never** run state-changing Git or GitHub operations (`add`, `commit`, `push`, `pull`, `merge`, `rebase`, `checkout`, `switch`, `branch`, `stash`, `reset`, `tag`, opening PRs or issues) unless the owner explicitly asks.
- Read-only commands (`git status`, `git diff`, `git log`, `git show`) are fine.

### When asked to commit

- Commit only what was requested.
- Format: `<type>: <subject>` (Conventional Commits, enforced by commitlint).
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Git hooks run on commit (`lint-staged`, `commitlint`). If one fails, fix the cause. Never use `--no-verify`, unless the owner explicitly asks for an emergency fix.

---

## 5. Architecture (Feature-Based)

### Folder map

| Path                                                     | Purpose                                                                                |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| `src/app`                                                | Routes, layouts, metadata (route group `(public)` for public pages)                    |
| `src/features`                                           | Feature modules. The main home of feature code                                         |
| `src/components/ui`                                      | Design-system primitives (shadcn/Base UI)                                              |
| `src/components/layout`                                  | App shell pieces (header, footer, containers)                                          |
| `src/components/shared`                                  | Reusable components used by 2+ features                                                |
| `src/config`                                             | App configuration and shared constants (site info, nav, links). `src/config/env` = env |
| `src/lib`                                                | Third-party setup/wrappers and framework-level helpers (e.g. `cn`)                     |
| `src/utils`                                              | Small pure helper functions                                                            |
| `src/styles`                                             | Extra style files. Global tokens live in `src/app/globals.css`                         |
| `src/hooks`, `src/actions`, `src/providers`, `src/types` | Shared (cross-feature) hooks, server actions, providers, and TypeScript types          |

### Feature module layout

```
src/features/<feature-name>/
├── components/   # UI for this feature
├── hooks/        # Logic for this feature
├── actions/      # Server actions (only if needed)
├── types/        # T{Name} types
├── constants/    # Feature constants
└── index.ts      # Public exports
```

If existing features use a different layout, **copy the existing one**.

### Placement rules

- Used by one feature: keep it **inside that feature**.
- Used by two or more features: move it to `components/shared`, `hooks`, or `utils`. Do not promote early.
- Do not import another feature's internals. Import only what its `index.ts` exports.
- Pages in `src/app` stay thin. They compose feature components and hold no business logic.

---

## 6. Environment Variables

- **Never** use `process.env.VALUE` directly in app code. Import from the validated env module: `import { env } from '@/config/env'`.
- When adding a new variable, add it to the env schema (`zod`) with correct client/server separation, and update the example env file if one exists.
- Never hard-code secrets, URLs, or keys.
- If a file physically cannot import the env module (e.g. `next.config.*`, Sentry init files), ask before using `process.env`.

---

## 7. Next.js Rules

### Server vs Client components

- **Default to Server Components.** Pages, layouts, and data fetching stay on the server.
- Add `"use client"` only where needed (state, effects, event handlers, browser APIs), and push it **down to the leaves**. Extract the interactive piece (nav toggle, form, counter) into its own small file instead of marking a whole page as client.
- Never pass non-serializable props from Server to Client Components (functions, `Date` objects, class instances). Convert dates to ISO strings and pass plain data only.

### Built-ins

- Always use `next/image` for images and `next/link` for internal navigation. Never use raw `<img>` or `<a>` for internal routes.
- Use the Metadata API (`metadata` / `generateMetadata`) for titles, descriptions, and Open Graph tags.
- Split large client bundles with `next/dynamic` or `React.lazy()` + `Suspense` (for example heavy, below-the-fold components).

---

## 8. React Rules

### Components

- Components are **small and single-purpose**. Separate concerns: no god components.
- **Separate logic from UI.** Data fetching, state calculation, and business logic go in custom hooks (`useAuth`, `useCart`). Components stay thin and render structure only.
- **Composition over configuration.** Do not build one component with 20 conditional props. Split into smaller components and use `children`.
- Keep state as **local as possible**. Do not lift it to a parent or global context if only one child needs it.
- Use `useReducer` for complex state logic.

### Effects

- Avoid `useEffect`. Prefer deriving values during render, event handlers, and Server Components.
- If an effect is truly necessary, **always return a cleanup function** for anything it sets up: timers, event listeners, subscriptions, or network requests (use `AbortController`).

### Handlers and lists

- **No inline functions** in JSX (`onClick={() => ...}`). Define named handlers (`handleSubmit`, `handleToggle`). For per-item logic in lists, extract an item component that owns its handler.
- Always set `key` on list items. Use a stable unique id (from the database or data), **never** the array index or `Math.random()`.

### Performance

- No premature optimization. Do not wrap things in `useMemo`, `useCallback`, or `React.memo` by default. The React Compiler handles most memoization automatically.
- Use them only for a measured problem, and explain why in your reply.

### DOM

- Never manipulate the DOM directly (`document.querySelector`, `innerHTML`). Use React state, and refs when a DOM node is truly needed.

---

## 9. TypeScript Rules

- Strict mode is on. Keep it on. Type props, state, and event handlers explicitly.
- **`any` is forbidden.** If a type is unknown until runtime, use `unknown` and narrow it with type guards or `zod` validation.
- **Avoid `as` assertions.** They tell the compiler "trust me" and hide runtime crashes. Use type guards or structural validation instead. (`as const` is allowed and encouraged.)
- Use `as const` for config arrays and lookup objects so they become deep read-only literal types.
- **`type` first, `interface` only when needed.** Use `type` for aliases, unions, primitives, and utility mappings. Use `interface` only for public contracts that need extension or declaration merging.
- Use built-in utility types (`Partial`, `Pick`, `Omit`, `Readonly`) instead of rewriting near-duplicate types.
- Use `import type { ... } from '...'` for type-only imports.

### Type naming

- Types use the **`T` prefix**: `TCar`, `TUser`, `TProjectCardProps`.
- Component props: `T{ComponentName}Props`.
- If an `interface` is unavoidable, use the **`I` prefix**: `IThemeContract`.

---

## 10. Styling & Design Tokens (Tailwind v4)

### 10.1 Basics

- **Mobile-first.** Write base styles for small screens, then scale up with `sm:`, `md:`, `lg:`.
- **Never use inline styles** (`style={{ ... }}`) and **never use `!important`**.
- Use `cn()` (built on `clsx` + `tailwind-merge`) for conditional and merged classes. Find the existing helper in `src/lib` or `src/utils`. Do not recreate it.
- Use `class-variance-authority` for components with variants.
- Use modern layouts: flexbox and grid, with responsive design.
- Reuse `shadcn/ui` and Base UI primitives from `components/ui` before building custom ones.

### 10.2 Single source of truth

Every reusable design value is defined **once**, in **one central place**, and used everywhere **by name**. Changing it there updates the whole site.

| Value                        | Where it lives                                                               |
| :--------------------------- | :--------------------------------------------------------------------------- |
| Colors (light and dark)      | CSS variables in `src/app/globals.css` (`:root`, `.dark`, Tailwind `@theme`) |
| Font families                | `next/font` in the root layout, exposed as CSS variables in `globals.css`    |
| Font sizes and line heights  | Type scale in `@theme`                                                       |
| Spacing                      | Tailwind spacing scale (one base `--spacing` unit)                           |
| Border radius                | `--radius-*` tokens                                                          |
| Shadows                      | `--shadow-*` tokens                                                          |
| Motion (easing, animations)  | `--ease-*` and `--animate-*` tokens in `@theme`                              |
| Z-index layers               | Named layers in one place (never raw numbers like `z-[9999]`)                |
| Breakpoints                  | Tailwind defaults. Custom ones only in `@theme`                              |
| Text, nav, links, site info  | `src/config` (shared) or the feature's `constants/`, typed with `as const`   |
| Component variants and sizes | `cva` inside the component file                                              |

### 10.3 Token rules

- **Read first.** Before styling, read `src/app/globals.css` and the existing `components/ui`. Follow the structure already there. Do not restructure `globals.css` without asking.
- **Semantic names, no raw or arbitrary values.** Use `primary`, `surface`, `muted`, `destructive`, never `bg-blue-500`, `text-[#333]`, `rounded-[10px]`, or `p-[13px]`. If no token fits, add one, then use it. (Structural layout values like `grid-cols-[1fr_auto]` are fine.)
- **Every color token has a light and a dark value.** Components must never need `dark:` overrides with raw colors. Follow the existing `next-themes` setup.
- **Adding or changing a token is a global change.** In your reply, explain why the new token is needed, why existing ones do not fit, and what it affects. Never rename or delete a token without asking.
- **The "one edit" test.** Before finishing, ask: "If the owner changes the primary color, a radius, or a font size, is it a one-line edit?" If not, fix it.

### 10.4 Reuse vs duplication

- **Design values: centralize immediately** (10.2).
- **Identical design-system elements** (button look, card look, section wrapper, heading styles) become one component or one `cva` variant. Do not copy class strings between files.
- **Code structure: extract after the third repetition**, and only when the copies change for the same reason (see Clean Code, section 13).

---

## 11. UI/UX Rules

The owner is learning UI/UX. Your job is to make good design decisions **and teach them**. Design skills (such as `frontend-design`) may suggest bold choices: apply them by changing or adding **tokens**, never by hard-coding values.

### 11.1 Before building: propose, then wait

For a **new page, section, or reusable component** (skip this for small tweaks and bug fixes):

1. Inspect the existing tokens, `components/ui`, and similar screens. Reuse first.
2. Send a short proposal:
   - Layout: mobile first, then how it changes on larger screens.
   - Which existing tokens and components you will reuse, and any new ones needed.
   - Key interactions and states.
   - **Why** each main choice (hierarchy, spacing, color, typography), in plain language.
3. **Wait for approval.** Only then write code.

### 11.2 Design quality rules

- **Hierarchy**: one clear focal point per section and at most one primary action. Signal importance with size, weight, and color.
- **Spacing rhythm**: related items sit closer together than unrelated ones. Section padding comes from a shared layout component, not copy-pasted classes.
- **Typography**: few weights, body text at least `text-base`, comfortable line length (`max-w-prose` for long text).
- **Color**: never rely on color alone to carry meaning (add an icon or text). Keep the palette small.
- **Consistency**: the same component for the same job.
- **Touch targets**: interactive elements are at least 44x44 px on mobile (`min-h-11 min-w-11`).
- **Layout stability**: reserve space for images (`next/image` with dimensions or `fill` inside a sized container) and async content (skeletons), so the page does not jump while loading.
- **Motion**: short and purposeful. Motion never blocks content.

### 11.3 States checklist

Every interactive or data-driven component covers what applies:

`default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `empty`, `error`, `success`.

Check each component in **light and dark** themes and from small phone width up to wide desktop.

### 11.4 After building

1. Review your own UI against 11.2, 11.3, and the accessibility rules (section 12).
2. If a design-audit skill is available (for example `web-design-guidelines`), run it and report the findings briefly. Do not install skills without permission.
3. Tell the owner what to check by eye (hierarchy, spacing, contrast, keyboard `Tab` order, mobile width) and why it matters.

---

## 12. Semantic HTML, Accessibility & SEO

- Use **semantic elements**: `header`, `nav`, `main`, `section`, `article`, `footer`, `button`, `ul`/`li`. Do not use a `div` where a semantic tag exists.
- **Heading hierarchy in strict order**: one `h1` per page, then `h2`, `h3` with no skipped levels. Choose the heading by meaning, not by size (size is a styling job).
- **Keyboard navigation**: every interactive element must be reachable and usable by keyboard, with a visible focus state and logical tab order. Never remove focus outlines without a replacement.
- Use real `button` and `a` elements for actions and links. Use ARIA only when native HTML cannot do the job.
- Provide meaningful `alt` text (empty `alt=""` for decorative images), and labels for every form control.
- **Contrast**: text needs at least 4.5:1 against its background (3:1 for large text and UI controls). Check this when creating color tokens.
- Respect `prefers-reduced-motion`.
- SEO basics: unique `title` and `description` per page, semantic structure, and descriptive link text.

---

## 13. Clean Code Principles

- **KISS**: choose the simplest approach that solves the problem. Do not reach for heavy patterns early.
- **Write for humans, not compilers.** Prefer clear, explicit names over clever one-liners.
- **Small, single-purpose functions.**
- **Fail fast and exit early.** Use guard clauses at the top of a function instead of deep `if/else` nesting.
- **Do not blindly follow DRY.** Do not force two different features to share code just because it looks identical today. Duplication is cheaper than the wrong abstraction. (Design values are the exception, see 10.)
- **No silent error swallowing.** Never write an empty `catch`. Log it, rethrow it, return a typed error, or report it through the existing Sentry setup.
- **Comments only where logic is complex.** Explain the _why_, not the _what_. Do not over-comment.

---

## 14. Naming, Imports & Lint Conventions

### Naming

| Item                    | Convention           | Example                 |
| :---------------------- | :------------------- | :---------------------- |
| React components        | `PascalCase`         | `ProjectCard`           |
| Functions and variables | `camelCase`          | `getProjectById`        |
| Custom hooks            | `use` + `PascalCase` | `useScrollSpy`          |
| Constants               | `UPPER_SNAKE_CASE`   | `MAX_PROJECTS_PER_PAGE` |
| Types                   | `T` + `PascalCase`   | `TProject`              |
| Files and folders       | `kebab-case`         | `project-card.tsx`      |

Booleans read like questions: `isOpen`, `hasError`, `canSubmit`.

### Imports and lint

- Use the `@/*` alias for anything inside `src/` (e.g. `@/components/...`, `@/lib/...`). No deep relative paths like `../../../`.
- Prefix intentionally unused variables or arguments with `_` (e.g. `_event`, `_index`).
- `console.log` triggers ESLint warnings. Use `console.warn` or `console.error` when logging is needed, and remove debug logs before finishing.
