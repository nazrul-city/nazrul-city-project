import {
  BarChart3,
  Building2,
  Inbox,
  LayoutDashboard,
  Map,
  Megaphone,
  Phone,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type TAdminRole = 'ADMIN' | 'SUPER_ADMIN';

export type TAdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/land-projects', label: 'Land projects', icon: Map },
  { href: '/admin/flat-projects', label: 'Flat projects', icon: Building2 },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/site-notice', label: 'Hero notice', icon: Megaphone },
  { href: '/admin/hero-stats', label: 'Hero stats', icon: BarChart3 },
  { href: '/admin/contact', label: 'Website contact', icon: Phone },
  { href: '/admin/team', label: 'Team photos', icon: Users },
] as const satisfies readonly TAdminNavItem[];

export const ADMINS_NAV_ITEM = {
  href: '/admin/admins',
  label: 'Admins',
  icon: Shield,
} as const satisfies TAdminNavItem;

export const ADMIN_ROLE_LABELS = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
} as const satisfies Record<TAdminRole, string>;
