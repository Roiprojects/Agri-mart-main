'use client';

import { WmsModuleFoundation } from '@/components/wms/WmsModuleFoundation';

export default function ExceptionsModulePage() {
  return (
    <WmsModuleFoundation
      moduleCode="10"
      title="Exceptions & Returns"
      description="Resolve allocation reviews, partial receipts, damaged/held goods, pending signed copies, failed deliveries, and post-pickup returns."
      countKey="exceptions"
      emptyTitle="No open exceptions or returns"
      emptyDescription="All fulfillment exceptions and return recovery cases are currently resolved."
      nextStepNote="Implement exception filtering, resolution notes, and inspected return restocking."
    />
  );
}
