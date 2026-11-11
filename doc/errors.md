# API Error Handling

Production-grade error handling for Next.js **Route Handlers** (`src/app/api/`**).

**Source:** [`src/lib/errors/`](../src/lib/errors/)  
**Types:** [`src/types/api-error.ts`](../src/types/api-error.ts)  
**Example usage:** [`src/app/api/health/`](../src/app/api/health/)

See also: [Logger](./logger.md), [Environment variables](./env.md)

---

## Goals

- One JSON error shape for every API failure.
- Throw typed errors (`AppError` family) from handlers; never hand-roll `try/catch` in every route.
- `catchAsync` catches everything and sends it through `globalErrorHandler`.
- Zod and Prisma failures are mapped automatically.
- **Pino** logs all failures; **Sentry** only for real 5xx / non-operational errors.
- Production clients never see raw Prisma/SQL or stack traces.

---

## Quick start

Always nest `catchAsync` **inside** `withRequestLogging` so logs share the request id:

```ts
import { NextResponse } from 'next/server';
import { catchAsync } from '@/lib/errors';
import { logger, withRequestLogging } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  return withRequestLogging(
    request,
    catchAsync(async () => {
      await prisma.$queryRaw`SELECT 1`;
      logger.info('health check ok');

      return NextResponse.json(
        {
          success: true,
          statusCode: 200,
          message: 'The server is healthy.',
          data: null,
        },
        { status: 200 }
      );
    })
  );
}
```

For Zod: call `schema.parse(body)` inside the handler. Do **not** map `ZodError` yourself — the global handler does it.

---

## Response envelope

```ts
{
  success: false,                                          // always false
  statusCode: number,                                      // matches the HTTP status
  message: string,
  errorSources: { path: string; message: string }[],       // empty when not field-level
  stack?: string                                           // development only
}
```

Examples:

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Duplicate value for: email",
  "errorSources": []
}
```

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errorSources": [{ "path": "email", "message": "Required" }]
}
```

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Something went wrong",
  "errorSources": []
}
```

---

## AppError family

| Class             | HTTP | When to throw                                                |
| ----------------- | ---- | ------------------------------------------------------------ |
| `AppError`        | any  | Generic operational error — `new AppError('Forbidden', 403)` |
| `CastError`       | 400  | Bad id / type that cannot be cast                            |
| `DuplicateError`  | 409  | Unique conflict (also from Prisma `P2002`)                   |
| `NotFoundError`   | 404  | Missing resource (also from Prisma `P2025` and related)      |
| `ValidationError` | 400  | Domain rule failed (not a Zod schema)                        |

Import from `@/lib/errors`.

---

## Zod validation

| Input      | HTTP | Client body                                                                                                   |
| ---------- | ---- | ------------------------------------------------------------------------------------------------------------- |
| `ZodError` | 400  | `success: false`, `statusCode: 400`, `message: 'Validation failed'`, `errorSources: [{ path, message }, ...]` |

Mapped in [`map-zod-error.ts`](../src/lib/errors/map-zod-error.ts).

---

## Prisma errors

Mapped in [`map-prisma-error.ts`](../src/lib/errors/map-prisma-error.ts).  
Import Prisma error classes via `Prisma` from `@/generated/prisma/client`.

### Known request codes (`PrismaClientKnownRequestError`)

| Code                    | Mapped to            | Client message                           |
| ----------------------- | -------------------- | ---------------------------------------- |
| `P2002`                 | `DuplicateError` 409 | `Duplicate value for: {target}`          |
| `P2025`, `P2001`        | `NotFoundError` 404  | `Record not found`                       |
| `P2015`                 | `NotFoundError` 404  | `Related record not found`               |
| `P2018`                 | `NotFoundError` 404  | `Required connected records not found`   |
| `P2003`                 | `AppError` 400       | `Related record not found`               |
| `P2014`                 | `AppError` 400       | `Invalid relation for this operation`    |
| `P2011`                 | `AppError` 400       | `Required field cannot be null: {field}` |
| `P2012`                 | `AppError` 400       | `Missing required value`                 |
| `P2021`, `P2022`, other | 500 non-operational  | `Something went wrong` (prod)            |

### Other Prisma classes

| Class                             | HTTP | Client (prod)                  | Sentry |
| --------------------------------- | ---- | ------------------------------ | ------ |
| `PrismaClientValidationError`     | 400  | `Invalid database query input` | no     |
| `PrismaClientInitializationError` | 500  | `Something went wrong`         | yes    |
| `PrismaClientUnknownRequestError` | 500  | `Something went wrong`         | yes    |
| `PrismaClientRustPanicError`      | 500  | `Something went wrong`         | yes    |

### Route vs mapper

| Situation                       | Who handles it                          |
| ------------------------------- | --------------------------------------- |
| `findUnique` returns `null`     | Route throws `NotFoundError`            |
| `update` / `delete` missing row | Prisma `P2025` → mapper                 |
| Insert duplicate unique         | Prisma `P2002` → mapper                 |
| Bad FK on create                | Prisma `P2003` → mapper                 |
| DB down / engine failure        | Initialization / unknown → 500 + Sentry |

---

## Logging vs Sentry

| Kind                  | Log            | Sentry                    |
| --------------------- | -------------- | ------------------------- |
| Operational 4xx       | `logger.warn`  | no                        |
| 5xx / non-operational | `logger.error` | `Sentry.captureException` |

Ops logs = Pino. Alerting = Sentry. Same split as the logger doc.

---

## Pipeline

1. Handler throws (or Zod/Prisma throws).
2. `catchAsync` catches.
3. `globalErrorHandler` maps → logs → JSON `NextResponse`.

```ts
withRequestLogging(
  request,
  catchAsync(async () => {
    /* … */
  })
);
```

---

## Sentry

Route handlers report a 5xx through `Sentry.captureException`, as the table above says. This section is the app setup: browser, Node.js server, and edge.

**Browser:** [`src/instrumentation-client.ts`](../src/instrumentation-client.ts)  
**Server:** [`src/sentry.server.config.ts`](../src/sentry.server.config.ts)  
**Edge:** [`src/sentry.edge.config.ts`](../src/sentry.edge.config.ts)  
**Register:** [`src/instrumentation.ts`](../src/instrumentation.ts)

[`src/instrumentation.ts`](../src/instrumentation.ts) loads the server config when `NEXT_RUNTIME` is `nodejs`, and the edge config when it is `edge`. `onRequestError` is `Sentry.captureRequestError`.

The server and edge DSNs prefer `SENTRY_DSN` and fall back to `NEXT_PUBLIC_SENTRY_DSN`. The browser uses `NEXT_PUBLIC_SENTRY_DSN`. Why a blank value stops the app is in [Environment variables](./env.md).

All three inits set `environment` from `NODE_ENV`. The release is left unset in these files. `withSentryConfig` injects it from the git commit at build time.

Trace sample rate is `1.0` in development and `0.1` in production. Server init turns `includeLocalVariables` off so passwords and the database URL are not attached from local variable capture. `beforeSend` runs `redactSentryEvent` from [`src/utils/redact-connection-url.ts`](../src/utils/redact-connection-url.ts).

### Browser replay

Configured in [`src/instrumentation-client.ts`](../src/instrumentation-client.ts):

| Setting                    | Development | Production |
| -------------------------- | ----------- | ---------- |
| `tracesSampleRate`         | 100%        | 10%        |
| `replaysSessionSampleRate` | 0%          | 10%        |
| `replaysOnErrorSampleRate` | 100%        | 100%       |

Replay uses `maskAllText` and `blockAllMedia`. Browser console `warn` and `error` calls are forwarded to Sentry logs. The server and edge configs forward those same console levels.

### Build

[`next.config.ts`](../next.config.ts) wraps the Next config with `withSentryConfig`. It reads `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN`. The tunnel route is `/monitoring`, so the browser sends events to this app and the app forwards them to Sentry.

Dev and production builds use Webpack. The Sentry options in `next.config.ts` are written for Webpack. The package scripts pass `--webpack`.

---

## Related files

| File                                                                                  | Purpose                                      |
| ------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`src/lib/errors/app-error.ts`](../src/lib/errors/app-error.ts)                       | Error classes                                |
| [`src/lib/errors/map-zod-error.ts`](../src/lib/errors/map-zod-error.ts)               | Zod → AppError                               |
| [`src/lib/errors/map-prisma-error.ts`](../src/lib/errors/map-prisma-error.ts)         | Prisma → AppError                            |
| [`src/lib/errors/global-error-handler.ts`](../src/lib/errors/global-error-handler.ts) | JSON + log/Sentry                            |
| [`src/lib/errors/catch-async.ts`](../src/lib/errors/catch-async.ts)                   | Handler wrapper                              |
| [`src/lib/logger.ts`](../src/lib/logger.ts)                                           | `getRequestLogContext`, `withRequestLogging` |
| [`src/instrumentation.ts`](../src/instrumentation.ts)                                 | Loads the Sentry server or edge config       |
| [`src/instrumentation-client.ts`](../src/instrumentation-client.ts)                   | Browser Sentry init and replay               |
| [`src/sentry.server.config.ts`](../src/sentry.server.config.ts)                       | Node.js Sentry init                          |
| [`src/sentry.edge.config.ts`](../src/sentry.edge.config.ts)                           | Edge Sentry init                             |
| [`src/utils/redact-connection-url.ts`](../src/utils/redact-connection-url.ts)         | Strips database URLs from Sentry events      |
| [`next.config.ts`](../next.config.ts)                                                 | Source map upload and `/monitoring` tunnel   |
