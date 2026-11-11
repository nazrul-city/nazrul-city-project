/**
 * Shared API error response types for Route Handlers.
 */

export type TErrorSource = {
  path: string;
  message: string;
};

/**
 * JSON body returned by the global API error handler.
 *
 * - `success` is always false
 * - `statusCode` matches the HTTP status
 * - `errorSources` lists field problems (empty when the failure is not field-level)
 * - `stack` is included only in development
 */
export type TApiErrorBody = {
  success: false;
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
  stack?: string;
};
