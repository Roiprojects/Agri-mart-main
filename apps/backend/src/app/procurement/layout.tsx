import { AdminPortalShell } from '@/components/admin/AdminPortalShell';

export default function ProcurementLayout({ children }: { children: React.ReactNode }) {
  return <AdminPortalShell portalId="procurement">{children}</AdminPortalShell>;
}
