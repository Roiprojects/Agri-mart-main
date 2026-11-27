'use client';

import { WmsModuleFoundation } from '@/components/wms/WmsModuleFoundation';

export default function IncomingModulePage() {
  return (
    <WmsModuleFoundation
      moduleCode="05"
      title="Incoming"
      description="Receive inbound loads by transfer, challan, or package ID, record good/damaged counts, attach signed copies, and verify receipt OTP."
      countKey="incoming"
      emptyTitle="No incoming loads pending"
      emptyDescription="There are currently no in-transit or pending-receipt shipments for this location."
      nextStepNote="Implement incoming load search, partial/damaged receiving form, signed acknowledgment upload, and destination receipt OTP verification."
    />
  );
}
