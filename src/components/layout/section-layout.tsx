import * as React from 'react';
import { cn } from '@/lib/utils';

export type TSectionLayoutProps = React.ComponentPropsWithoutRef<'section'> & {
  /** Optional class overrides for the inner centered container */
  containerClassName?: string;
};

export function SectionLayout({
  children,
  className,
  containerClassName,
  ...props
}: TSectionLayoutProps) {
  return (
    <section
      className={cn('w-full scroll-mt-20 py-12 md:scroll-mt-24 md:py-16 lg:py-20', className)}
      {...props}
    >
      <div className={cn('mx-auto max-w-6xl px-4 md:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
}
