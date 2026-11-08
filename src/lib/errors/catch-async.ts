import { globalErrorHandler } from './global-error-handler';

/**
 * Wraps an async Route Handler body so any thrown error
 * (AppError, Zod, Prisma, unknown) becomes a JSON response
 * via `globalErrorHandler`.
 *
 * Always nest inside `withRequestLogging` so logs share the request id:
 *
 * @example
 * export async function GET(request: Request) {
 *   return withRequestLogging(
 *     request,
 *     catchAsync(async () => {
 *       // throw AppError / Zod / Prisma…
 *       return NextResponse.json({ ok: true });
 *     })
 *   );
 * }
 */
export function catchAsync(handler: () => Promise<Response>): () => Promise<Response> {
  return async () => {
    try {
      return await handler();
    } catch (error) {
      return globalErrorHandler(error);
    }
  };
}
