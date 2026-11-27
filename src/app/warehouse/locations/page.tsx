'use client';

import { WmsModuleFoundation } from '@/components/wms/WmsModuleFoundation';

export default function LocationsModulePage() {
  return (
    <WmsModuleFoundation
      moduleCode="01"
      title="Locations & Access"
      description="Manage Main & Branch Warehouses, Franchisees with Linked Warehouses, Staff Profiles & Roles, and Delivery Channel Partners."
      countKey="locations"
      emptyTitle="No locations configured yet"
      emptyDescription="Add your Main Warehouse, Branch hubs, Franchisees, and staff access profiles in Phase 2."
      nextStepNote="Build CRUD tables and forms for Warehouses, Franchisees, Staff Users & Role assignments, and Delivery Partners."
    />
  );
}
