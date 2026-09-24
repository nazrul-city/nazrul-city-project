'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'How we work', href: '#how-we-work' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Observe sections on scroll to update active nav link
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    NAV_ITEMS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (href: string) => {
    setActiveSection(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-90"
        >
          {/* Logo image swaps automatically based on theme */}
          <span className="flex size-12 items-center justify-center rounded-lg p-0.5 shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/images/nc-logo.png"
              alt="Nazrul City Logo"
              className="hidden h-10 w-10 object-contain dark:block"
              width={32}
              height={32}
              priority
            />
            <Image
              src="/images/nc-logo-dark.png"
              alt="Nazrul City Logo"
              className="block h-10 w-10 object-contain dark:hidden"
              width={32}
              height={32}
              priority
            />
          </span>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-semibold tracking-tight text-foreground sm:text-base">
              Nazrul City
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Land, plots &amp; flats</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links with Underline */}
        <nav className="hidden items-center gap-1 sm:gap-2 md:flex" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group relative px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span>{item.label}</span>
                {/* Active Underline Indicator */}
                <span
                  className={cn(
                    'absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary transition-all duration-300 ease-out',
                    isActive
                      ? 'scale-x-100 opacity-100'
                      : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-40'
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA, Theme Toggle & Mobile Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link
            href="#contact"
            onClick={() => handleLinkClick('#contact')}
            className={cn(buttonVariants({ size: 'sm' }), 'hidden gap-1.5 sm:inline-flex')}
          >
            <span>Contact us</span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="flex size-9 items-center justify-center rounded-lg border border-border/50 text-foreground transition-colors hover:bg-muted md:hidden"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-md flex-col gap-4 p-6">
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'group relative flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-muted font-semibold text-foreground'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )}
                  >
                    <div className="relative flex flex-col">
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="mt-1 h-0.5 w-6 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <ArrowUpRight
                      className={cn(
                        'size-4 transition-transform',
                        isActive
                          ? 'translate-x-0.5 -translate-y-0.5 text-primary'
                          : 'text-muted-foreground'
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-4 py-2.5">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <ThemeToggle />
              </div>

              <Link
                href="#contact"
                onClick={() => handleLinkClick('#contact')}
                className={cn(buttonVariants({ size: 'lg' }), 'w-full justify-center gap-2')}
              >
                <span>Contact us</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
