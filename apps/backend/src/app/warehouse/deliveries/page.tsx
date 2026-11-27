'use client';

import { WmsModuleFoundation } from '@/components/wms/WmsModuleFoundation';

export default function DeliveriesModulePage() {
  return (
    <WmsModuleFoundation
      moduleCode="08"
      title="My Deliveries"
      description="Manage franchisee direct deliveries, mark shipments Out for Delivery, verify customer OTPs, and record failed delivery attempts."
      countKey="deliveries"
      emptyTitle="No franchisee deliveries assigned"
      emptyDescription="Orders routed to a franchisee for direct doorstep delivery will appear here."
      nextStepNote="Implement Out for Delivery status updates, Customer Delivery OTP verification, and failed attempt / reschedule logging."
    />
  );
}
