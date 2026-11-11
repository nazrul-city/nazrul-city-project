'use client';

import { useEffect, useState } from 'react';

/** Keep the bar visible while still near the top of the page. */
const TOP_OFFSET_PX = 8;

/** Ignore tiny scroll jitter from touch bounce. */
const SCROLL_DELTA_PX = 8;

/**
 * Returns true after the user scrolls down, false when they scroll up.
 * When `enabled` is false (desktop, open menu), always returns false and
 * does not listen to scroll.
 *
 * Hidden state is only meaningful while enabled — we derive the return
 * value instead of resetting state inside the effect (avoids cascading renders).
 */
export function useHideOnScrollDown(enabled: boolean): boolean {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let lastScrollY = window.scrollY;
    let isTicking = false;

    function updateVisibility() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= TOP_OFFSET_PX) {
        setIsHidden(false);
      } else if (delta > SCROLL_DELTA_PX) {
        setIsHidden(true);
      } else if (delta < -SCROLL_DELTA_PX) {
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
      isTicking = false;
    }

    function handleScroll() {
      if (isTicking) {
        return;
      }

      isTicking = true;
      window.requestAnimationFrame(updateVisibility);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);

  return enabled && isHidden;
}
