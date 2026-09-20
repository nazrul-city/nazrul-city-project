'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={cn(
        'group relative flex size-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-foreground transition-all duration-200 hover:border-border hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className
      )}
    >
      {/* Sun icon for Light Mode */}
      <Sun className="size-4 scale-100 rotate-0 text-amber-500 transition-all duration-300 group-hover:text-amber-600 dark:scale-0 dark:-rotate-90" />

      {/* Moon icon for Dark Mode */}
      <Moon className="absolute size-4 scale-0 rotate-90 text-sky-400 transition-all duration-300 group-hover:text-sky-300 dark:scale-100 dark:rotate-0" />

      {showLabel && (
        <span className="ml-2 text-sm font-medium capitalize">
          {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
