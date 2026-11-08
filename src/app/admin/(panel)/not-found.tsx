import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminNotFound() {
  return (
    <section className="flex max-w-prose flex-col gap-4" aria-labelledby="admin-not-found-heading">
      <p className="text-base font-semibold text-primary">404</p>
      <h1 id="admin-not-found-heading">Page not found</h1>
      <p className="text-base text-muted-foreground">
        This admin page does not exist, or the item may have been deleted.
      </p>
      <Link href="/admin" className={cn(buttonVariants(), 'min-h-11 w-fit')}>
        Back to dashboard
      </Link>
    </section>
  );
}
