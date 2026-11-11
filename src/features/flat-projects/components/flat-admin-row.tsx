'use client';

import { useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { updateFlatVisibility } from '@/features/flat-projects/actions';
import { DeleteFlatDialog } from '@/features/flat-projects/components/delete-flat-dialog';
import { FLAT_STATUS_OPTIONS } from '@/features/flat-projects/components/flat-form-schema';
import type { listAdminFlats } from '@/features/flat-projects/queries';
import { cn } from '@/lib/utils';

type TFlatAdminRowProps = {
  flat: Awaited<ReturnType<typeof listAdminFlats>>[number];
  canDelete: boolean;
};

function readStatusLabel(status: TFlatAdminRowProps['flat']['status']): string {
  return FLAT_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export function FlatAdminRow({ flat, canDelete }: Readonly<TFlatAdminRowProps>) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [published, setPublished] = useState(flat.published);
  const [isFeatured, setIsFeatured] = useState(flat.isFeatured);

  async function saveVisibility(next: { published?: boolean; isFeatured?: boolean }) {
    const previousPublished = published;
    const previousFeatured = isFeatured;

    if (next.published !== undefined) {
      setPublished(next.published);
    }

    if (next.isFeatured !== undefined) {
      setIsFeatured(next.isFeatured);
    }

    setIsUpdating(true);
    setErrorMessage(null);

    const result = await updateFlatVisibility({
      flatId: flat.id,
      ...next,
    });

    setIsUpdating(false);

    if (!result.ok) {
      setPublished(previousPublished);
      setIsFeatured(previousFeatured);
      setErrorMessage(result.message);
      return;
    }

    router.refresh();
  }

  function handlePublishedChange(event: ChangeEvent<HTMLInputElement>) {
    void saveVisibility({ published: event.target.checked });
  }

  function handleFeaturedChange(event: ChangeEvent<HTMLInputElement>) {
    void saveVisibility({ isFeatured: event.target.checked });
  }

  return (
    <tr className="border-t border-border align-top">
      <td className="px-4 py-3">
        <p className="truncate text-base font-medium text-foreground">{flat.name}</p>
        <p className="truncate text-sm text-muted-foreground">{flat.district}</p>
        {errorMessage ? (
          <p role="alert" className="mt-1 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </td>
      <td className="px-4 py-3 align-middle text-base text-muted-foreground">
        {readStatusLabel(flat.status)}
      </td>
      <td className="px-4 py-3">
        <label className="inline-flex min-h-11 min-w-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={published}
            disabled={isUpdating}
            onChange={handlePublishedChange}
            aria-label={`Published: ${flat.name}`}
          />
          <span className="text-sm text-foreground md:sr-only">Published</span>
        </label>
      </td>
      <td className="px-4 py-3">
        <label className="inline-flex min-h-11 min-w-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={isFeatured}
            disabled={isUpdating}
            onChange={handleFeaturedChange}
            aria-label={`Featured: ${flat.name}`}
          />
          <span className="text-sm text-foreground md:sr-only">Featured</span>
        </label>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
          <Link
            href={`/admin/flat-projects/${flat.id}`}
            className={cn(buttonVariants({ variant: 'outline' }), 'justify-center')}
          >
            Edit
          </Link>
          {canDelete ? <DeleteFlatDialog flatId={flat.id} name={flat.name} /> : null}
        </div>
      </td>
    </tr>
  );
}
