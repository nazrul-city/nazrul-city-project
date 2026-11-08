'use client';

import { useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { updatePlotVisibility } from '@/features/land-projects/actions';
import { DeletePlotDialog } from '@/features/land-projects/components/delete-plot-dialog';
import { PLOT_STATUS_OPTIONS } from '@/features/land-projects/components/plot-form-schema';
import type { listAdminPlots } from '@/features/land-projects/queries';
import { cn } from '@/lib/utils';

type TPlotAdminRowProps = {
  plot: Awaited<ReturnType<typeof listAdminPlots>>[number];
  canDelete: boolean;
};

function readStatusLabel(status: TPlotAdminRowProps['plot']['status']): string {
  return PLOT_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export function PlotAdminRow({ plot, canDelete }: Readonly<TPlotAdminRowProps>) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [published, setPublished] = useState(plot.published);
  const [isFeatured, setIsFeatured] = useState(plot.isFeatured);

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

    const result = await updatePlotVisibility({
      plotId: plot.id,
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
        <p className="truncate text-base font-medium text-foreground">{plot.name}</p>
        <p className="truncate text-sm text-muted-foreground">{plot.district}</p>
        {errorMessage ? (
          <p role="alert" className="mt-1 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </td>
      <td className="px-4 py-3 align-middle text-base text-muted-foreground">
        {readStatusLabel(plot.status)}
      </td>
      <td className="px-4 py-3">
        <label className="inline-flex min-h-11 min-w-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={published}
            disabled={isUpdating}
            onChange={handlePublishedChange}
            aria-label={`Published: ${plot.name}`}
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
            aria-label={`Featured: ${plot.name}`}
          />
          <span className="text-sm text-foreground md:sr-only">Featured</span>
        </label>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
          <Link
            href={`/admin/land-projects/${plot.id}`}
            className={cn(buttonVariants({ variant: 'outline' }), 'justify-center')}
          >
            Edit
          </Link>
          {canDelete ? <DeletePlotDialog plotId={plot.id} name={plot.name} /> : null}
        </div>
      </td>
    </tr>
  );
}
