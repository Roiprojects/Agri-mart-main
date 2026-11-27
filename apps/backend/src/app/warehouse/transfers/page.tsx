'use client';

import { WmsModuleFoundation } from '@/components/wms/WmsModuleFoundation';

export default function TransfersModulePage() {
  return (
    <WmsModuleFoundation
      moduleCode="03–04"
      title="Stock Transfers & Challans"
      description="Prepare single or multi-stop bulk transfers, issue two-copy delivery challans, and verify driver pickup OTPs."
      countKey="transfers"
      emptyTitle="No stock transfers yet"
      emptyDescription="No internal transfers or bulk trips have been created for the selected view."
      nextStepNote="Implement the multi-stop transfer builder, stock reservation on Prepare, two-copy challan print view, and pickup OTP confirmation."
    />
  );
}
