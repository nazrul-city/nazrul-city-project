import * as React from 'react';
import { cn } from '@/lib/utils';

export type TSectionLayoutProps = React.ComponentPropsWithoutRef<'section'> & {
  /** Optional class overrides for the inner centered container */
  containerClassName?: string;
  /** Whether to add top padding to the section */
  needTopPadding?: boolean;
};

export function SectionLayout({
  children,
  className,
  containerClassName,
  needTopPadding = false,
  ...props
}: TSectionLayoutProps) {
  return (
    <section
      className={cn(
        'w-full scroll-mt-20 pb-15 md:scroll-mt-24 md:pb-20',
        className,
        needTopPadding && 'pt-15 md:pt-20'
      )}
      {...props}
    >
      <div className={cn('mx-auto max-w-6xl px-4 md:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
}
