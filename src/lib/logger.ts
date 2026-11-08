import 'server-only';
import { AsyncLocalStorage } from 'node:async_hooks';
import pino from 'pino';
import { env } from '@/config/env';
import { redactConnectionUrls } from '@/utils/redact-connection-url';

const REQUEST_ID_HEADERS = ['x-request-id', 'x-correlation-id'] as const;

/**
 * Incoming ids are echoed into logs and the response header.
 * Only a single token is accepted, so a caller cannot inject a new log line.
 */
const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export type TRequestLogContext = {
  requestId: string;
  method: string;
  path: string;
};

type TAppLogger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  fatal: (message: string) => void;
};

const requestLogContext = new AsyncLocalStorage<TRequestLogContext>();

/**
 * Timestamp with local timezone offset, e.g. 2026-10-20T17:05:01.234+06:00
 */
function formatTimestampWithTimezone(): string {
  const date = new Date();
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absolute = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0');
  const minutes = String(absolute % 60).padStart(2, '0');
  const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, -1);

  return `${localIso}${sign}${hours}:${minutes}`;
}

function resolveRequestId(request: Request): string {
  for (const headerName of REQUEST_ID_HEADERS) {
    const value = request.headers.get(headerName)?.trim();
    if (value && REQUEST_ID_PATTERN.test(value)) {
      return value;
    }
  }

  return crypto.randomUUID();
}

const rootLogger = pino({
  level: env.LOG_LEVEL,
  base: undefined,
  messageKey: 'message',
  timestamp: () => `,"timestamp":${JSON.stringify(formatTimestampWithTimezone())}`,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  mixin() {
    return requestLogContext.getStore() ?? {};
  },
  redact: {
    paths: [
      'password',
      'secret',
      'token',
      'authorization',
      'cookie',
      'DATABASE_URL',
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.secret',
      '*.token',
    ],
    censor: '[Redacted]',
  },
  ...(env.NODE_ENV === 'production'
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: false,
            messageKey: 'message',
            ignore: 'pid,hostname',
          },
        },
      }),
});

function writeLog(level: 'info' | 'warn' | 'error' | 'fatal', message: string): void {
  const safeMessage = redactConnectionUrls(message);

  switch (level) {
    case 'info':
      rootLogger.info(safeMessage);
      return;
    case 'warn':
      rootLogger.warn(safeMessage);
      return;
    case 'error':
      rootLogger.error(safeMessage);
      return;
    case 'fatal':
      rootLogger.fatal(safeMessage);
      return;
  }
}

/**
 * App logger — pass only a message string.
 * level, timestamp, requestId, method, and path are attached automatically
 * when the handler runs inside `withRequestLogging`.
 *
 * @example
 * logger.info('health check ok');
 * logger.warn('rate limit approaching');
 * logger.error('failed to create record');
 * logger.fatal('database unreachable');
 */
export const logger: TAppLogger = {
  info(message) {
    writeLog('info', message);
  },
  warn(message) {
    writeLog('warn', message);
  },
  error(message) {
    writeLog('error', message);
  },
  fatal(message) {
    writeLog('fatal', message);
  },
};

/**
 * Read-only request log context for the current async scope
 * (set by `withRequestLogging`). Used by the API error handler
 * to tag Sentry events with `requestId`.
 */
export function getRequestLogContext(): TRequestLogContext | undefined {
  return requestLogContext.getStore();
}

/**
 * Bind requestId / method / path for the duration of a Route Handler,
 * and echo `x-request-id` on the response.
 *
 * @example
 * export async function GET(request: Request) {
 *   return withRequestLogging(request, async () => {
 *     logger.info('handler start');
 *     return NextResponse.json({ ok: true });
 *   });
 * }
 */
export async function withRequestLogging(
  request: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  const requestId = resolveRequestId(request);
  const { pathname } = new URL(request.url);
  const context: TRequestLogContext = {
    requestId,
    method: request.method,
    path: pathname,
  };

  return requestLogContext.run(context, async () => {
    const response = await handler();
    const headers = new Headers(response.headers);
    headers.set('x-request-id', requestId);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });
}
