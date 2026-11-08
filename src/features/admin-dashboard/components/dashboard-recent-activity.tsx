import { ArrowRight, Building2, FolderOpen, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PlotStatus } from '@/generated/prisma/client';
import type { TDashboardRecentProject } from '@/features/admin-dashboard/types/dashboard';

type TDashboardRecentActivityProps = {
  projects: readonly TDashboardRecentProject[];
};

function readStatusBadge(status: PlotStatus) {
  if (status === 'AVAILABLE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
        <span className="size-1.5 rounded-full bg-secondary" />
        Available
      </span>
    );
  }

  if (status === 'RESERVED') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
        <span className="size-1.5 rounded-full bg-foreground/60" />
        Reserved
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      <span className="size-1.5 rounded-full bg-primary" />
      Sold
    </span>
  );
}

function formatDate(dateIso: string): string {
  try {
    const date = new Date(dateIso);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateIso;
  }
}

export function DashboardRecentActivity({ projects }: Readonly<TDashboardRecentActivityProps>) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FolderOpen aria-hidden="true" className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-heading text-base font-semibold text-foreground">No projects found</p>
          <p className="text-sm text-muted-foreground">
            Get started by creating your first land plot or apartment listing.
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <Link href="/admin/land-projects/new" className={buttonVariants({ size: 'sm' })}>
            Create land project
          </Link>
          <Link
            href="/admin/flat-projects/new"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Create flat project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="flex flex-col gap-1 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">Recent activity</h2>
          <p className="text-xs text-muted-foreground">
            Latest listings added or updated across land and flats
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <Link
            href="/admin/land-projects"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
          >
            All plots <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
          <Link
            href="/admin/flat-projects"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
          >
            All flats <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3">
                Project
              </th>
              <th scope="col" className="px-4 py-3">
                Category
              </th>
              <th scope="col" className="px-4 py-3">
                Location
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Visibility
              </th>
              <th scope="col" className="px-4 py-3">
                Updated
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => {
              const isPlot = project.category === 'PLOT';

              return (
                <tr key={`${project.category}-${project.id}`} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{project.name}</span>
                      {project.isFeatured ? (
                        <span
                          title="Featured on Homepage"
                          className="inline-flex items-center text-primary"
                        >
                          <Sparkles aria-hidden="true" className="size-3.5" />
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
                        isPlot ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                      )}
                    >
                      {isPlot ? (
                        <MapPin aria-hidden="true" className="size-3" />
                      ) : (
                        <Building2 aria-hidden="true" className="size-3" />
                      )}
                      {isPlot ? 'Land' : 'Flat'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">{project.district}</td>

                  <td className="px-4 py-3">{readStatusBadge(project.status)}</td>

                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium',
                        project.published ? 'text-secondary' : 'text-muted-foreground'
                      )}
                    >
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          project.published ? 'bg-secondary' : 'bg-muted-foreground/40'
                        )}
                      />
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(project.updatedAt)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link
                      href={project.editHref}
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
