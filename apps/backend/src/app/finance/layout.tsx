import { AdminPortalShell } from '@/components/admin/AdminPortalShell';

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return <AdminPortalShell portalId="finance">{children}</AdminPortalShell>;
}
