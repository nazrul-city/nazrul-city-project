'use client';

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TMarqueeProps = {
  /**
   * Content to scroll in the marquee loop.
   */
  children: ReactNode;

  /**
   * Scroll direction.
   * - 'rtl' (default): right → left
   * - 'ltr': left → right
   */
  direction?: 'rtl' | 'ltr';

  /**
   * Scroll speed in pixels per second. Default: 60.
   * Higher value = faster scroll.
   * Ignored when `duration` is provided.
   */
  speed?: number;

  /**
   * Override animation duration with a fixed CSS time value (e.g. '20s', '100s', or 20).
   * When set, bypasses the speed-based auto-calculation.
   */
  duration?: string | number;

  /**
   * Gap between repeated content items, in pixels. Default: 48.
   */
  gap?: number;

  /**
   * Pause scroll on hover. Default: true.
   */
  pauseOnHover?: boolean;

  /**
   * Number of duplicate copies rendered to fill the loop seamlessly. Default: 4.
   */
  repeat?: number;

  /** Additional classes for the outer wrapper. */
  className?: string;
};

/**
 * Marquee — seamless infinite horizontal scroll.
 *
 * Architecture:
 * - Renders duplicate copies of children flat in a flex track.
 * - Measures the first copy's rendered width (including the trailing gap)
 *   and sets `--marquee-translate` to that exact pixel distance.
 * - Keyframes in globals.css translate by `var(--marquee-translate)`,
 *   ensuring the loop resets seamlessly without visible jumps.
 * - Duration is auto-calculated from measured width / speed (px/s),
 *   or overridden with explicit `duration`.
 * - Sets animationDuration directly so CSS animation timing updates
 *   reactively across all browsers.
 * - Supports hover pause via both CSS classes and container event handlers.
 */
export function Marquee({
  children,
  direction = 'rtl',
  speed = 60,
  duration,
  gap = 48,
  pauseOnHover = true,
  repeat = 4,
  className,
}: Readonly<TMarqueeProps>) {
  const copy1Ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Compute initial duration if static duration prop was provided
  const initialDuration = duration
    ? typeof duration === 'number'
      ? `${duration}s`
      : /^\d+$/.test(duration.trim())
        ? `${duration.trim()}s`
        : duration.trim()
    : undefined;

  useLayoutEffect(() => {
    const copy = copy1Ref.current;
    const track = trackRef.current;
    if (!copy || !track) return;

    const applyMeasurements = () => {
      const singleWidth = copy.getBoundingClientRect().width;
      if (singleWidth === 0) return;

      const resolvedDuration = duration
        ? typeof duration === 'number'
          ? `${duration}s`
          : /^\d+$/.test(duration.trim())
            ? `${duration.trim()}s`
            : duration.trim()
        : `${Math.max(0.1, singleWidth / Math.max(1, speed)).toFixed(2)}s`;

      track.style.setProperty('--marquee-translate', `-${singleWidth}px`);
      track.style.setProperty('--marquee-duration', resolvedDuration);
      track.style.animationDuration = resolvedDuration;
    };

    applyMeasurements();

    const resizeObserver = new ResizeObserver(applyMeasurements);
    resizeObserver.observe(copy);

    return () => {
      resizeObserver.disconnect();
    };
  }, [duration, speed, gap, direction]);

  const handleMouseEnter = () => {
    if (pauseOnHover && trackRef.current) {
      trackRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && trackRef.current) {
      trackRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <div
      className={cn('group w-full overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className={cn(
          'flex w-max',
          direction === 'ltr' ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'group-hover:paused hover:paused'
        )}
        style={
          initialDuration ? ({ animationDuration: initialDuration } as CSSProperties) : undefined
        }
      >
        {Array.from({ length: Math.max(2, repeat) }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? copy1Ref : undefined}
            className="flex shrink-0 items-center"
            style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
            aria-hidden={i > 0 ? 'true' : undefined}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
