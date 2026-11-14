'use client';

import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';

type THeroCtaButtonProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function HeroCtaButton({ href, className, children }: Readonly<THeroCtaButtonProps>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith('#')) {
      return;
    }

    const targetElement = document.querySelector(href);

    if (!(targetElement instanceof HTMLElement)) {
      return;
    }

    // Prevent default so the browser scrolls to the section even when
    // window.location.hash already matches href (e.g. user scrolled back up).
    event.preventDefault();
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (window.location.hash !== href) {
      window.history.replaceState(null, '', href);
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
