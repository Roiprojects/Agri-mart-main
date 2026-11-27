'use client';

import { WmsModuleFoundation } from '@/components/wms/WmsModuleFoundation';

export default function OrdersDispatchModulePage() {
  return (
    <WmsModuleFoundation
      moduleCode="06–07"
      title="Orders → Dispatch"
      description="Inspect customer orders, preview nearest warehouse/franchisee stock & shortages, confirm multi-leg routes, and track custody timelines."
      countKey="ordersDispatch"
      emptyTitle="No orders in dispatch queue"
      emptyDescription="Customer orders ready for routing and dispatch will appear here."
      nextStepNote="Implement nearest-location shortage preview, route confirmation, carrier AWB dispatch, and order custody timeline."
    />
  );
}
