import { PlotAdminRow } from '@/features/land-projects/components/plot-admin-row';
import type { listAdminPlots } from '@/features/land-projects/queries';

type TPlotAdminListProps = {
  plots: Awaited<ReturnType<typeof listAdminPlots>>;
  canDelete: boolean;
};

export function PlotAdminList({ plots, canDelete }: Readonly<TPlotAdminListProps>) {
  if (plots.length === 0) {
    return <p className="text-base text-muted-foreground">No plots yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-foreground">
              Name
            </th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-foreground">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-foreground">
              Published
            </th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-foreground">
              Featured
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-sm font-semibold text-foreground md:text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {plots.map((plot) => (
            <PlotAdminRow
              key={`${plot.id}-${plot.published}-${plot.isFeatured}`}
              plot={plot}
              canDelete={canDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
