'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Home,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from 'lucide-react';

const properties = [
  {
    name: 'Gulshan Heights',
    location: 'Gulshan 2, Dhaka',
    type: 'Apartment',
    status: 'Available',
    price: '৳ 2.85 Cr',
    units: '12 Units',
    occupancy: '92%',
  },
  {
    name: 'Banani Residency',
    location: 'Banani, Dhaka',
    type: 'Luxury Residence',
    status: 'Available',
    price: '৳ 3.40 Cr',
    units: '08 Units',
    occupancy: '87%',
  },
  {
    name: 'Bashundhara Garden',
    location: 'Bashundhara R/A',
    type: 'Family Apartment',
    status: 'Almost Sold',
    price: '৳ 1.95 Cr',
    units: '24 Units',
    occupancy: '96%',
  },
];

const activities = [
  {
    title: 'New property inquiry',
    description: 'Gulshan Heights — Unit 8B',
    time: '12 min ago',
    type: 'primary',
  },
  {
    title: 'Booking confirmed',
    description: 'Banani Residency — Unit 4A',
    time: '42 min ago',
    type: 'success',
  },
  {
    title: 'Property viewing scheduled',
    description: 'Bashundhara Garden — 3:30 PM',
    time: '1 hr ago',
    type: 'info',
  },
];

function StatCard({
  title,
  value,
  description,
  trend,
  positive = true,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  trend: string;
  positive?: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>

        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
            positive ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive',
          ].join(' ')}
        >
          {positive ? (
            <ArrowUpRight className="size-3.5" />
          ) : (
            <ArrowDownRight className="size-3.5" />
          )}
          {trend}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted-foreground">{title}</p>

        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isSuccess = status === 'Available';

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        isSuccess ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary',
      ].join(' ')}
    >
      <span
        className={['size-1.5 rounded-full', isSuccess ? 'bg-secondary' : 'bg-primary'].join(' ')}
      />

      {status}
    </span>
  );
}

function PropertyRow({ property }: { property: (typeof properties)[number] }) {
  return (
    <div className="group flex flex-col gap-4 border-b border-border py-5 last:border-b-0 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Building2 className="size-5 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{property.name}</h3>

            <StatusBadge status={property.status} />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {property.location}
            </span>

            <span>{property.type}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 lg:w-[430px] lg:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="mt-1 text-sm font-semibold">{property.price}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Units</p>
          <p className="mt-1 text-sm font-semibold">{property.units}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Occupancy</p>
          <p className="mt-1 text-sm font-semibold">{property.occupancy}</p>
        </div>
      </div>

      <button
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`More options for ${property.name}`}
      >
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  );
}

function ActivityItem({ activity }: { activity: (typeof activities)[number] }) {
  const iconStyles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-secondary/10 text-secondary',
    info: 'bg-info/10 text-info',
  };

  return (
    <div className="flex gap-3">
      <div
        className={[
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          iconStyles[activity.type as keyof typeof iconStyles],
        ].join(' ')}
      >
        {activity.type === 'primary' && <Users className="size-4" />}

        {activity.type === 'success' && <CheckCircle2 className="size-4" />}

        {activity.type === 'info' && <CalendarDays className="size-4" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{activity.title}</p>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">{activity.description}</p>

        <p className="mt-1 text-[11px] text-muted-foreground">{activity.time}</p>
      </div>
    </div>
  );
}

export default function RealEstateDashboard() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-5 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              Nazrul City
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Property Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Monitor properties, inquiries, bookings and portfolio performance from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
              <CalendarDays className="size-4" />
              This Month
            </button>

            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring">
              <Plus className="size-4" />
              Add Property
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Properties"
            value="128"
            description="Across all locations"
            trend="+12.4%"
            icon={Building2}
          />

          <StatCard
            title="Available Units"
            value="42"
            description="Currently available"
            trend="+8.2%"
            icon={Home}
          />

          <StatCard
            title="Active Inquiries"
            value="86"
            description="Last 30 days"
            trend="+18.6%"
            icon={Users}
          />

          <StatCard
            title="Occupancy Rate"
            value="94.8%"
            description="Portfolio average"
            trend="+4.3%"
            icon={CheckCircle2}
          />
        </section>

        {/* Main Grid */}
        <section className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Properties */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Recent Properties</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your latest property inventory.
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="search"
                    placeholder="Search properties..."
                    className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-56"
                  />
                </div>
              </div>
            </div>

            <div className="px-5">
              {properties.map((property) => (
                <PropertyRow key={property.name} property={property} />
              ))}
            </div>

            <div className="border-t border-border p-4">
              <button className="flex w-full items-center justify-center gap-1 rounded-lg py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring">
                View All Properties
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Activity */}
          <aside className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-lg font-semibold">Recent Activity</h2>

                <p className="mt-1 text-sm text-muted-foreground">Latest portfolio updates.</p>
              </div>

              <button
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="More activity options"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>

            <div className="space-y-6 p-5">
              {activities.map((activity) => (
                <ActivityItem key={`${activity.title}-${activity.time}`} activity={activity} />
              ))}
            </div>

            <div className="border-t border-border p-4">
              <button className="flex w-full items-center justify-center gap-1 rounded-lg py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring">
                View Activity
                <ChevronRight className="size-4" />
              </button>
            </div>
          </aside>
        </section>

        {/* Bottom Section */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Performance */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Portfolio Performance</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Property activity over the last 6 months.
                </p>
              </div>

              <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
                +16.8%
              </span>
            </div>

            <div className="mt-8 flex h-48 items-end gap-3">
              {[42, 55, 48, 70, 64, 88, 76, 94, 82, 100, 91, 108].map((height, index) => (
                <div key={index} className="flex flex-1 flex-col justify-end gap-2">
                  <div
                    className="rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                    style={{
                      height: `${height * 1.35}px`,
                    }}
                  />

                  <span className="text-center text-[10px] text-muted-foreground">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div>
              <h2 className="text-lg font-semibold">Top Locations</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Property distribution by location.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {[
                ['Gulshan', '42 properties', '78%'],
                ['Banani', '31 properties', '64%'],
                ['Bashundhara', '28 properties', '58%'],
                ['Dhanmondi', '19 properties', '46%'],
              ].map(([location, propertiesCount, percentage]) => (
                <div key={location}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{location}</p>

                      <p className="mt-0.5 text-xs text-muted-foreground">{propertiesCount}</p>
                    </div>

                    <span className="text-sm font-semibold">{percentage}</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-secondary"
                      style={{ width: percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
