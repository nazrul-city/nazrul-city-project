import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TGalleryPaginationProps = {
  currentPage: number;
  totalPages: number;
  category: string;
  limit: number;
  basePath: string;
};

export function GalleryPagination({
  currentPage,
  totalPages,
  category,
  limit,
  basePath,
}: Readonly<TGalleryPaginationProps>) {
  if (totalPages <= 1) {
    return null;
  }

  function createPageHref(page: number): string {
    const params = new URLSearchParams();
    if (category && category !== 'ALL') {
      params.set('category', category);
    }
    if (page > 1) {
      params.set('page', String(page));
    }
    if (limit !== 20) {
      params.set('limit', String(limit));
    }
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  // Generate numeric page buttons (sliding window)
  const pageNumbers: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i += 1) {
    pageNumbers.push(i);
  }

  return (
    <nav
      role="navigation"
      aria-label="গ্যালারি পৃষ্ঠা পরিবর্তন"
      className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2 md:mt-12"
    >
      {/* Previous Page */}
      {currentPage > 1 ? (
        <Link
          href={createPageHref(currentPage - 1)}
          aria-label="পূর্ববর্তী পৃষ্ঠা"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'min-h-10 gap-1 rounded-lg px-3'
          )}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">পূর্ববর্তী</span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'pointer-events-none min-h-10 gap-1 rounded-lg px-3 opacity-50'
          )}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">পূর্ববর্তী</span>
        </span>
      )}

      {/* First Page Link if window moved */}
      {startPage > 1 ? (
        <>
          <Link
            href={createPageHref(1)}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'size-10 rounded-lg p-0 font-medium'
            )}
          >
            1
          </Link>
          {startPage > 2 ? <span className="px-1 text-muted-foreground">…</span> : null}
        </>
      ) : null}

      {/* Numbered Page Buttons */}
      {pageNumbers.map((pageNumber) => {
        const isCurrent = pageNumber === currentPage;
        if (isCurrent) {
          return (
            <span
              key={pageNumber}
              aria-current="page"
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'pointer-events-none size-10 rounded-lg bg-primary p-0 font-medium text-primary-foreground'
              )}
            >
              {pageNumber}
            </span>
          );
        }

        return (
          <Link
            key={pageNumber}
            href={createPageHref(pageNumber)}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'size-10 rounded-lg p-0 font-medium'
            )}
          >
            {pageNumber}
          </Link>
        );
      })}

      {/* Last Page Link if window moved */}
      {endPage < totalPages ? (
        <>
          {endPage < totalPages - 1 ? <span className="px-1 text-muted-foreground">…</span> : null}
          <Link
            href={createPageHref(totalPages)}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'size-10 rounded-lg p-0 font-medium'
            )}
          >
            {totalPages}
          </Link>
        </>
      ) : null}

      {/* Next Page */}
      {currentPage < totalPages ? (
        <Link
          href={createPageHref(currentPage + 1)}
          aria-label="পরবর্তী পৃষ্ঠা"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'min-h-10 gap-1 rounded-lg px-3'
          )}
        >
          <span className="hidden sm:inline">পরবর্তী</span>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'pointer-events-none min-h-10 gap-1 rounded-lg px-3 opacity-50'
          )}
        >
          <span className="hidden sm:inline">পরবর্তী</span>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
