import { AdminPortalShell } from '@/components/admin/AdminPortalShell';
import { WmsShell } from '@/components/wms/WmsShell';

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminPortalShell portalId="warehouse">
      <WmsShell>{children}</WmsShell>
    </AdminPortalShell>
  );
}
