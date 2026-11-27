'use client';

import { WmsModuleFoundation } from '@/components/wms/WmsModuleFoundation';

export default function StockModulePage() {
  return (
    <WmsModuleFoundation
      moduleCode="02"
      title="Stock & Availability"
      description="Track On hand, Reserved, Available, Held, and Incoming balances per location and product variant."
      countKey="stockVariants"
      emptyTitle="No product variants found"
      emptyDescription="Catalog variants will appear here once products are added."
      nextStepNote="Implement location-filtered stock grid with interactive balance pills, opening balances, stock adjustments, and ledger history."
    />
  );
}
