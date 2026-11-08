/**
 * JSON body for a successful Route Handler response.
 * `success` is always true. `statusCode` matches the HTTP status.
 * `data` is null when the route has nothing else to return.
 * Errors use `TApiErrorBody` in `api-error.ts`.
 */
export type TApiSuccessBody<TData> = {
  success: true;
  statusCode: number;
  message: string;
  data: TData;
};
