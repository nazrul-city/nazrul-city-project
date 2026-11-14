import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type TBorderBeamProps = ComponentProps<'span'>;

/**
 * Animated light beam travelling along the perimeter of a container.
 *
 * Requirements on parent element:
 * - Needs `relative` positioning.
 * - Needs `overflow-hidden`.
 * - Needs a matching `rounded-*` (e.g. `rounded-full` or `rounded-xl`), which `rounded-[inherit]` adopts.
 * - Works best when the parent has `p-px` (or `p-[1.5px]`) so the rotating conic beam shines
 *   through the outer border channel around an inner surface.
 */
export function BorderBeam({ className, ...props }: Readonly<TBorderBeamProps>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        'motion-reduce:hidden',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'absolute inset-[-150%] animate-border-beam',
          '[background:conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_180deg,var(--primary)_360deg)]'
        )}
      />
    </span>
  );
}
