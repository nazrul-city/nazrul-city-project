import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * Returns `true` once mounted on the client, `false` during SSR and initial hydration.
 * Uses `useSyncExternalStore` to avoid cascading re-renders and ESLint warnings.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
