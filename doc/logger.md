# Logger (Pino)

Server-only structured logging for the Nazrul City Next.js App Router app.

**Source:** [`src/lib/logger.ts`](../src/lib/logger.ts)  
**Config:** `LOG_LEVEL` in [`src/config/env/server.ts`](../src/config/env/server.ts)  
**Example usage:** [`src/app/api/health/route.ts`](../src/app/api/health/route.ts)

---

## Goals

- You only pass a **message string** — `logger.info('…')`.
- Every log line automatically includes **level**, **timestamp** (with timezone), **requestId**, **method**, and **path**.
- Production emits **JSON** (NDJSON) for log drains (Vercel, CloudWatch, Datadog, etc.).
- Development uses **pino-pretty** for readable terminal output.
- Secrets are **redacted**; the logger must never run in Client Components or Edge middleware.

---

## Quick start

```ts
import { NextResponse } from 'next/server';
import { logger, withRequestLogging } from '@/lib/logger';

export async function GET(request: Request) {
  return withRequestLogging(request, async () => {
    logger.info('handler started');
    logger.warn('something looks off');
    logger.error('operation failed');
    // logger.fatal('process cannot continue');

    return NextResponse.json({ ok: true });
  });
}
```

**Always wrap Route Handlers in** `withRequestLogging`**.**  
Without it, `requestId`, `method`, and `path` will be missing from the log line.

---

## API

### `logger`

| Method                  | When to use                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| `logger.info(message)`  | Normal successful or noteworthy events                              |
| `logger.warn(message)`  | Recoverable problems, degraded behavior                             |
| `logger.error(message)` | Failures that need attention                                        |
| `logger.fatal(message)` | Unrecoverable conditions (process / request cannot continue safely) |

Only these four levels are part of the app API. Do not use `debug` / `trace` in application code.

Signature for every method:

```ts
(message: string) => void
```

Pass a plain string only. Put ids or extra detail **inside the message** if needed:

```ts
logger.info(`order created: ${orderId}`);
logger.error(`failed to save listing: ${listingId}`);
```

### `withRequestLogging(request, handler)`

1. Resolves a **requestId** (see below).
2. Stores `requestId`, `method`, and `path` for the duration of the handler (via `AsyncLocalStorage`).
3. Runs your handler.
4. Adds the `x-request-id` header on the response.

```ts
export async function POST(request: Request) {
  return withRequestLogging(request, async () => {
    logger.info('create listing');
    return NextResponse.json({ id: '…' }, { status: 201 });
  });
}
```

Works with Server Actions that receive a `Request`, and with Route Handlers. Do **not** import this module into `"use client"` files.

---

## Log shape

Each line is one JSON object (pretty-printed in development).

```json
{
  "level": "info",
  "timestamp": "2026-10-20T17:05:01.234+06:00",
  "requestId": "c4c239c9-b465-4e46-a1f9-3a2671cc9eb5",
  "method": "GET",
  "path": "/api/health",
  "message": "health check ok"
}
```

| Field       | Meaning                                                             |
| ----------- | ------------------------------------------------------------------- |
| `level`     | `info` \| `warn` \| `error` \| `fatal` (string label, not a number) |
| `timestamp` | Local ISO-8601 with timezone offset (e.g. `+06:00`)                 |
| `requestId` | Correlation id for this request                                     |
| `method`    | HTTP method (`GET`, `POST`, …)                                      |
| `path`      | URL pathname only (`/api/health`, not the full origin)              |
| `message`   | Your string                                                         |

---

## Request ID

### Resolution order

1. Incoming header `x-request-id`
2. Else incoming header `x-correlation-id`
3. Else a new `crypto.randomUUID()`

### Response

The same id is always set on the response as:

```http
x-request-id: <id>
```

Clients and support can send that value back when reporting bugs. You can also filter all log lines for one request by `requestId` in your log tools.

### Debugging tip

```bash
curl -i -H "x-request-id: my-debug-001" http://localhost:3000/api/health
```

Look for `my-debug-001` in the terminal / log drain.

---

## Environment

| Variable    | Values                           | Default | Notes                         |
| ----------- | -------------------------------- | ------- | ----------------------------- |
| `LOG_LEVEL` | `fatal`, `error`, `warn`, `info` | `info`  | Minimum level that is printed |

Validated in the server env schema (`@/config/env`). Documented in [`.env.example`](../.env.example).

Examples:

- Production: `LOG_LEVEL=info` (or `warn` if you want less noise)
- Local debugging of failures: keep `info`, or temporarily use a more verbose host setting if you raise the enum later

Pino only prints messages at **level ≥** `LOG_LEVEL`.  
If `LOG_LEVEL=error`, then `info` and `warn` are silent.

---

## Architecture

```text
Route Handler
    │
    ▼
withRequestLogging(request, …)
    │  stores { requestId, method, path } in AsyncLocalStorage
    │
    ├── logger.info / warn / error / fatal  ──► Pino root logger
    │                                              │
    │                                              ├─ mixin: request fields
    │                                              ├─ redact: secrets
    │                                              └─ stdout (JSON or pretty)
    │
    └── Response + header x-request-id
```

| Concern                          | Tool                                   |
| -------------------------------- | -------------------------------------- |
| Operational logs (what happened) | **Pino** (`@/lib/logger`)              |
| Error tracking / alerting        | **Sentry** (`Sentry.captureException`) |

Use both when a user-facing failure matters:

```ts
try {
  // …
} catch (error) {
  logger.error('failed to create listing');
  Sentry.captureException(error);
  throw error;
}
```

Optional later: `Sentry.setTag('requestId', …)` so Sentry events match log lines. Prefer reading `requestId` from the response header or from ALS if you expose a small getter — today the id is on the response and inside each log object.

---

## Rules (do / don’t)

### Do

- Import from `@/lib/logger` only on the **server** (Route Handlers, Server Actions, Server Components, `instrumentation.ts`).
- Wrap each HTTP handler with `withRequestLogging`.
- Log short, clear messages: what happened, not a novel.
- Put business ids in the message string when useful.

### Don’t

- Import the logger into Client Components (`"use client"`).
- Use Pino in Edge middleware (Node streams / workers are not a good fit).
- Log passwords, tokens, cookies, full `Request` objects, or `DATABASE_URL`.
- Pass objects as the first argument — the public API is **string message only**.
- Use `console.log` / `console.error` for new server code (prefer `logger`).

---

## Redaction

These paths are replaced with `[Redacted]` if they appear on a logged object (defense in depth; your public API is message-only):

- `password`, `secret`, `token`, `authorization`, `cookie`, `DATABASE_URL`
- `req.headers.authorization`, `req.headers.cookie`
- Nested `*.password`, `*.secret`, `*.token`

Still avoid putting secrets into the message string itself — redaction cannot scrub free text reliably.

---

## Next.js config

[`next.config.ts`](../next.config.ts) keeps Pino outside the server bundle:

```ts
serverExternalPackages: ['pino', 'pino-pretty'],
```

Required so the pretty transport (worker) works in development.

---

## Packages

| Package       | Role                                                   |
| ------------- | ------------------------------------------------------ |
| `pino`        | Logger runtime                                         |
| `pino-pretty` | Dev-only pretty printing (devDependency)               |
| `server-only` | Build fails if this module is imported from the client |

---

## Production vs development

|           | Development                               | Production                         |
| --------- | ----------------------------------------- | ---------------------------------- |
| Output    | Colorized, human-readable (`pino-pretty`) | One JSON object per line on stdout |
| Consumers | Your terminal                             | Host log drain / aggregator        |
| Timestamp | Same ISO-with-offset field                | Same                               |

Do **not** enable `pino-pretty` in production — it slows the process and breaks machine parsing.

---

## Checklist for a new Route Handler

1. Import `logger` and `withRequestLogging` from `@/lib/logger`.
2. Return `withRequestLogging(request, async () => { … })`.
3. Call `logger.info` / `warn` / `error` / `fatal` with a string only.
4. Return a normal `NextResponse` (request id header is added for you).
5. On catch paths that matter to users, also report to Sentry.

---

## Related files

| File                                                                      | Purpose                  |
| ------------------------------------------------------------------------- | ------------------------ |
| [`src/lib/logger.ts`](../src/lib/logger.ts)                               | Logger implementation    |
| [`src/config/env/server.ts`](../src/config/env/server.ts)                 | `LOG_LEVEL` validation   |
| [`.env.example`](../.env.example)                                         | Env documentation        |
| [`next.config.ts`](../next.config.ts)                                     | `serverExternalPackages` |
| [`src/app/api/health/route.ts`](../src/app/api/health/route.ts)           | Reference Route Handler  |
| [`src/app/api/health/[id]/route.ts`](../src/app/api/health/[id]/route.ts) | Reference dynamic route  |
