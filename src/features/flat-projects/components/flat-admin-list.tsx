import { FlatAdminRow } from '@/features/flat-projects/components/flat-admin-row';
import type { listAdminFlats } from '@/features/flat-projects/queries';

type TFlatAdminListProps = {
  flats: Awaited<ReturnType<typeof listAdminFlats>>;
  canDelete: boolean;
};

export function FlatAdminList({ flats, canDelete }: Readonly<TFlatAdminListProps>) {
  if (flats.length === 0) {
    return <p className="text-base text-muted-foreground">No flats yet.</p>;
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
          {flats.map((flat) => (
            <FlatAdminRow
              key={`${flat.id}-${flat.published}-${flat.isFeatured}`}
              flat={flat}
              canDelete={canDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
