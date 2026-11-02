import { AdminPortalShell } from '@/components/admin/AdminPortalShell';

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return <AdminPortalShell portalId="sales">{children}</AdminPortalShell>;
}
