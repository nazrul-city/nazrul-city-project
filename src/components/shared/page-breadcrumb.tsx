import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from 'cn';

export type TBreadcrumbItem = {
  label: string;
  href?: string;
};

type TPageBreadcrumbProps = {
  items: readonly TBreadcrumbItem[];
  className?: string;
};

type TTrailItemProps = {
  item: TBreadcrumbItem;
  isLast: boolean;
  showSeparator: boolean;
};

const FULL_TRAIL_LIMIT = 3;

type TTrailRow =
  | {
      kind: 'item';
      key: string;
      item: TBreadcrumbItem;
      isLast: boolean;
      showSeparator: boolean;
    }
  | {
      kind: 'ellipsis';
      key: 'ellipsis';
    };

function itemKey(item: TBreadcrumbItem): string {
  return `${item.label}-${item.href ?? 'text'}`;
}

function getTrailRows(items: readonly TBreadcrumbItem[]): TTrailRow[] {
  if (items.length <= FULL_TRAIL_LIMIT) {
    return items.map((item, index) => ({
      kind: 'item',
      key: itemKey(item),
      item,
      isLast: index === items.length - 1,
      showSeparator: index > 0,
    }));
  }

  const first = items[0];
  const previous = items[items.length - 2];
  const last = items[items.length - 1];

  if (!first || !previous || !last) {
    return [];
  }

  return [
    {
      kind: 'item',
      key: itemKey(first),
      item: first,
      isLast: false,
      showSeparator: false,
    },
    { kind: 'ellipsis', key: 'ellipsis' },
    {
      kind: 'item',
      key: itemKey(previous),
      item: previous,
      isLast: false,
      showSeparator: true,
    },
    {
      kind: 'item',
      key: itemKey(last),
      item: last,
      isLast: true,
      showSeparator: true,
    },
  ];
}

function TrailEllipsis() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbEllipsis />
      </BreadcrumbItem>
    </>
  );
}

function TrailItem({ item, isLast, showSeparator }: Readonly<TTrailItemProps>) {
  const href = isLast ? undefined : item.href;

  return (
    <>
      {showSeparator ? <BreadcrumbSeparator /> : null}
      <BreadcrumbItem>
        {(() => {
          if (href) {
            return (
              <BreadcrumbLink
                className="text text-base font-semibold hover:underline"
                render={<Link href={href} />}
              >
                {item.label}
              </BreadcrumbLink>
            );
          }
          if (isLast) {
            return (
              <BreadcrumbPage className="text-base font-semibold text-primary underline">
                {item.label}
              </BreadcrumbPage>
            );
          }
          return <span className="text-base line-through">{item.label}</span>;
        })()}
      </BreadcrumbItem>
    </>
  );
}
/**
 * @example
 * // Example 1: Simple Home > About
 * <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
 *
 * @example
 * // Example 2: Multistep Home > Projects > Details (only last is not clickable)
 * <PageBreadcrumb items={[
 *   { label: "Home", href: "/" },
 *   { label: "Projects", href: "/projects" },
 *   { label: "Details" }
 * ]} />
 */
export function PageBreadcrumb({ items, className }: Readonly<TPageBreadcrumbProps>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={cn('mt-20 lg:mt-22', className)}>
      <BreadcrumbList className="mx-auto max-w-6xl px-2 md:px-4 lg:px-6">
        {getTrailRows(items).map((row) =>
          row.kind === 'ellipsis' ? (
            <TrailEllipsis key={row.key} />
          ) : (
            <TrailItem
              key={row.key}
              item={row.item}
              isLast={row.isLast}
              showSeparator={row.showSeparator}
            />
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
