import { AdminPortalShell } from '@/components/admin/AdminPortalShell';

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  return <AdminPortalShell portalId="warehouse">{children}</AdminPortalShell>;
}
