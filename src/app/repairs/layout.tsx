import { AdminPortalShell } from '@/components/admin/AdminPortalShell';

export default function RepairsLayout({ children }: { children: React.ReactNode }) {
  return <AdminPortalShell portalId="repairs">{children}</AdminPortalShell>;
}
