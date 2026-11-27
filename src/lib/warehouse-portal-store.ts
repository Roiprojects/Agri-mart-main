import fs from 'fs';
import path from 'path';
import { devDb, readDb, writeDb } from './dev-db';
import { calculateDistanceKm } from './warehouse-assignment';

export type StaffRole =
  | 'CENTRAL_ADMIN'
  | 'WAREHOUSE_MANAGER'
  | 'DISPATCH_STAFF'
  | 'RECEIVING_STAFF'
  | 'FRANCHISEE_MANAGER'
  | 'FRANCHISEE_DELIVERY';

export type LocationKind = 'WAREHOUSE' | 'FRANCHISEE';
export type WarehouseTier = 'MAIN' | 'BRANCH';
export type TransportMethod = 'OWN_VEHICLE' | 'DELIVERY_PARTNER';
export type TransferPurpose = 'REPLENISHMENT' | 'ORDER_PACKAGES' | 'MIXED';
export type TransferStatus =
  | 'DRAFT'
  | 'PREPARED'
  | 'IN_TRANSIT'
  | 'PARTIAL_RECEIPT'
  | 'RECEIVED'
  | 'PENDING_SIGNED_COPY'
  | 'CANCELLED';

export type RoutePattern =
  | 'FRANCHISEE_DIRECT'
  | 'WAREHOUSE_TO_FRANCHISEE'
  | 'BRANCH_RELAY'
  | 'CARRIER_DIRECT';

export type ExceptionType =
  | 'ALLOCATION_REVIEW'
  | 'PARTIAL_RECEIPT'
  | 'DAMAGED_HELD'
  | 'PENDING_SIGNED_COPY'
  | 'DELIVERY_FAILED'
  | 'CANCELLED_RETURN';

export interface PortalWarehouseMeta {
  warehouseId: string;
  tier: WarehouseTier;
  district: string;
  operatingContact: string;
}

export interface FranchiseeProfile {
  id: string;
  name: string;
  code: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  contact: string;
  linkedWarehouseIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffAssignment {
  locationId: string;
  locationKind: LocationKind;
  roles: StaffRole[];
}

export interface PortalStaffUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED';
  assignments: StaffAssignment[];
  invitedAt: string;
  activatedAt?: string;
}

export interface DeliveryCarrier {
  id: string;
  name: string;
  code: string;
  mode: 'MANUAL' | 'CONNECTED';
  trackingUrlTemplate: string;
  contactMobile: string;
  isActive: boolean;
}

export interface LocationVariantStock {
  id: string;
  locationId: string;
  locationKind: LocationKind;
  productId: string;
  variantId: string;
  onHand: number;
  reserved: number;
  held: number;
  reorderThreshold: number;
  updatedAt: string;
}

export interface StockAdjustmentLog {
  id: string;
  locationId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  delta: number;
  type: 'OPENING' | 'ADJUST' | 'TRANSFER_PREPARE' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'HELD' | 'RELEASE' | 'RETURN_INSPECT';
  reason: string;
  referenceId?: string;
  performedBy: string;
  createdAt: string;
}

export interface TransferLineItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  requestedQty: number;
  packedQty: number;
  receivedGoodQty: number;
  receivedDamagedQty: number;
  orderId?: string;
  orderNumber?: string;
  packageId: string;
}

export interface ChallanRecord {
  challanNumber: string;
  groupId: string;
  transferNumber: string;
  sourceLocationId: string;
  sourceName: string;
  destinationLocationId: string;
  destinationName: string;
  vehicleRegistration: string;
  vehicleType: string;
  driverName: string;
  driverReference: string;
  driverMobile: string;
  deliveryCopyIssued: boolean;
  acknowledgmentCopyIssued: boolean;
  signedCopyAttachment?: string;
  signedByName?: string;
  signedByRole?: string;
  signedAt?: string;
  issuedAt: string;
}

export interface ReceiptRecord {
  id: string;
  receiptNumber: string;
  transferId: string;
  groupId: string;
  locationId: string;
  locationName: string;
  receiverUserId: string;
  receiverName: string;
  receiverRole: string;
  receiptOtpVerified: boolean;
  signedCopyAttached: boolean;
  signedCopyAttachment?: string;
  notes: string;
  lines: {
    lineId: string;
    productName: string;
    variantName: string;
    goodQty: number;
    damagedQty: number;
    orderId?: string;
  }[];
  status: 'CONFIRMED' | 'PARTIAL' | 'PENDING_SIGNED_COPY';
  createdAt: string;
}

export interface DispatchGroup {
  id: string;
  destinationId: string;
  destinationKind: LocationKind;
  destinationName: string;
  transportMethod: TransportMethod;
  purpose: TransferPurpose;
  status: TransferStatus;
  items: TransferLineItem[];
  // Own vehicle fields
  vehicleRegistration?: string;
  vehicleType?: string;
  driverName?: string;
  driverReference?: string;
  driverMobile?: string;
  driverAcknowledged?: boolean;
  challan?: ChallanRecord;
  pickupOtpCode?: string;
  pickupOtpVerified?: boolean;
  // Delivery partner fields
  carrierId?: string;
  carrierName?: string;
  awbNumber?: string;
  trackingUrl?: string;
  carrierDocsNote?: string;
  courierRepName?: string;
  courierOtpCode?: string;
  courierOtpVerified?: boolean;
  // Receipt fields
  assignedReceiverId?: string;
  receiptOtpCode?: string;
  receipts: ReceiptRecord[];
  dispatchedAt?: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  isBulkTrip: boolean;
  notes: string;
  groups: DispatchGroup[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderLegSummary {
  legIndex: number;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  transportMethod: TransportMethod;
  transferId?: string;
  transferNumber?: string;
  groupId?: string;
  challanNumber?: string;
  awbNumber?: string;
  carrierName?: string;
  status: string;
  signedCopyAttached?: boolean;
  receiverName?: string;
}

export interface OrderFulfillmentRecord {
  orderId: string;
  orderNumber: string;
  routePattern: RoutePattern;
  sourceLocationId: string;
  branchLocationId?: string;
  franchiseeId?: string;
  carrierId?: string;
  carrierName?: string;
  awbNumber?: string;
  trackingUrl?: string;
  courierOtpCode?: string;
  courierOtpVerified?: boolean;
  status:
    | 'UNALLOCATED'
    | 'ALLOCATION_REVIEW'
    | 'WAITING_FOR_STOCK'
    | 'READY_FOR_DISPATCH'
    | 'IN_TRANSIT'
    | 'READY_FOR_DELIVERY'
    | 'OUT_FOR_DELIVERY'
    | 'PARTIALLY_DELIVERED'
    | 'DELIVERED'
    | 'FAILED_ATTEMPT'
    | 'CANCELLED';
  assignedDeliveryStaffId?: string;
  assignedDeliveryStaffName?: string;
  customerOtpCode?: string;
  customerOtpVerified?: boolean;
  deliveryReceiptNumber?: string;
  deliveredAt?: string;
  failedAttempts: {
    id: string;
    reason: string;
    action: 'RETRY' | 'RESCHEDULE' | 'RETURN' | 'EXCEPTION';
    recordedBy: string;
    createdAt: string;
  }[];
  legs: OrderLegSummary[];
  updatedAt: string;
}

export interface PortalExceptionCase {
  id: string;
  type: ExceptionType;
  title: string;
  description: string;
  orderId?: string;
  orderNumber?: string;
  transferId?: string;
  transferNumber?: string;
  groupId?: string;
  locationId?: string;
  currentHolder: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehousePortalDb {
  warehouseMeta: PortalWarehouseMeta[];
  franchisees: FranchiseeProfile[];
  staffUsers: PortalStaffUser[];
  carriers: DeliveryCarrier[];
  stocks: LocationVariantStock[];
  adjustmentLogs: StockAdjustmentLog[];
  transfers: StockTransfer[];
  orderFulfillments: OrderFulfillmentRecord[];
  exceptions: PortalExceptionCase[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'warehouse-portal-db.json');

function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function buildInitialPortalDb(): WarehousePortalDb {
  const warehouses = devDb.getWarehouses();
  const products = devDb.getProducts();
  const variants = readDb().variants || [];
  const now = new Date().toISOString();

  const mainWh = warehouses[0];
  const branchWh = warehouses[1];

  const warehouseMeta: PortalWarehouseMeta[] = warehouses.map((w, idx) => ({
    warehouseId: w.id,
    tier: idx === 0 ? 'MAIN' : 'BRANCH',
    district: w.address.split(',').pop()?.trim() || 'Central District',
    operatingContact: w.contactNumber || '+91 94800 00000',
  }));

  const franchisees: FranchiseeProfile[] = [
    {
      id: 'fr-lake-01',
      name: 'Lake Agro Franchisee',
      code: 'FR-LAKE-01',
      address: 'Lake View Market Road, Sector 4',
      district: mainWh ? mainWh.address.split(',').pop()?.trim() || 'Hubballi' : 'Hubballi',
      latitude: mainWh ? mainWh.latitude + 0.04 : 15.4,
      longitude: mainWh ? mainWh.longitude + 0.03 : 75.15,
      contact: '+91 98450 11223',
      linkedWarehouseIds: [mainWh?.id, branchWh?.id].filter(Boolean) as string[],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const staffUsers: PortalStaffUser[] = [
    {
      id: 'staff-central-01',
      name: 'Central Operations Admin',
      email: 'central.admin@agrimart.in',
      mobile: '9480100001',
      status: 'ACTIVE',
      assignments: mainWh
        ? [{ locationId: mainWh.id, locationKind: 'WAREHOUSE', roles: ['CENTRAL_ADMIN'] }]
        : [],
      invitedAt: now,
      activatedAt: now,
    },
    ...(mainWh
      ? [
          {
            id: 'staff-wh-mgr-01',
            name: mainWh.managerName || 'Main Warehouse Manager',
            email: 'main.manager@agrimart.in',
            mobile: '9480100002',
            status: 'ACTIVE' as const,
            assignments: [
              {
                locationId: mainWh.id,
                locationKind: 'WAREHOUSE' as const,
                roles: ['WAREHOUSE_MANAGER', 'DISPATCH_STAFF', 'RECEIVING_STAFF'] as StaffRole[],
              },
            ],
            invitedAt: now,
            activatedAt: now,
          },
        ]
      : []),
    {
      id: 'staff-fr-01',
      name: 'Lake Franchisee Operator',
      email: 'lake.franchisee@agrimart.in',
      mobile: '9845011223',
      status: 'ACTIVE',
      assignments: [
        {
          locationId: 'fr-lake-01',
          locationKind: 'FRANCHISEE',
          roles: ['FRANCHISEE_MANAGER', 'FRANCHISEE_DELIVERY'],
        },
      ],
      invitedAt: now,
      activatedAt: now,
    },
  ];

  const carriers: DeliveryCarrier[] = [
    {
      id: 'car-01',
      name: 'Delhivery Surface Cargo',
      code: 'DLV-SURF',
      mode: 'CONNECTED',
      trackingUrlTemplate: 'https://www.delhivery.com/track/package/{AWB}',
      contactMobile: '9880011223',
      isActive: true,
    },
    {
      id: 'car-02',
      name: 'Regional Parcel Express',
      code: 'RPX-MANUAL',
      mode: 'MANUAL',
      trackingUrlTemplate: 'https://track.regionalparcel.in/{AWB}',
      contactMobile: '9880044556',
      isActive: true,
    },
  ];

  // Seed variant stock rows from existing devDb warehouseStocks
  const coreDb = readDb();
  const stocks: LocationVariantStock[] = [];
  for (const ws of coreDb.warehouseStocks || []) {
    const prod = products.find((p) => p.id === ws.productId);
    const prodVariants = variants.filter((v) => v.productId === ws.productId);
    const variantId = ws.variantId || prodVariants[0]?.id || `default-${ws.productId}`;
    if (!prod) continue;
    stocks.push({
      id: `lvs-${ws.warehouseId}-${ws.productId}-${variantId}`,
      locationId: ws.warehouseId,
      locationKind: 'WAREHOUSE',
      productId: ws.productId,
      variantId,
      onHand: ws.quantity,
      reserved: ws.reservedQuantity || 0,
      held: 0,
      reorderThreshold: ws.reorderThreshold || 5,
      updatedAt: now,
    });
  }

  return {
    warehouseMeta,
    franchisees,
    staffUsers,
    carriers,
    stocks,
    adjustmentLogs: [],
    transfers: [],
    orderFulfillments: [],
    exceptions: [],
  };
}

export function readPortalDb(): WarehousePortalDb {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    const initial = buildInitialPortalDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as WarehousePortalDb;
  } catch {
    const initial = buildInitialPortalDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

export function writePortalDb(data: WarehousePortalDb) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function getLocationName(db: WarehousePortalDb, locationId: string): string {
  const wh = devDb.getWarehouses().find((w) => w.id === locationId);
  if (wh) return wh.name;
  const fr = db.franchisees.find((f) => f.id === locationId);
  if (fr) return fr.name;
  return locationId;
}

export function getIncomingQtyForVariant(
  db: WarehousePortalDb,
  locationId: string,
  productId: string,
  variantId: string
): number {
  let total = 0;
  for (const t of db.transfers) {
    for (const g of t.groups) {
      if (
        g.destinationId === locationId &&
        (g.status === 'IN_TRANSIT' || g.status === 'PARTIAL_RECEIPT' || g.status === 'PENDING_SIGNED_COPY')
      ) {
        for (const item of g.items) {
          if (item.productId === productId && item.variantId === variantId) {
            const accounted = (item.receivedGoodQty || 0) + (item.receivedDamagedQty || 0);
            total += Math.max(0, item.packedQty - accounted);
          }
        }
      }
    }
  }
  return total;
}

export function getOrCreateStockRow(
  db: WarehousePortalDb,
  locationId: string,
  locationKind: LocationKind,
  productId: string,
  variantId: string
): LocationVariantStock {
  let row = db.stocks.find(
    (s) => s.locationId === locationId && s.productId === productId && s.variantId === variantId
  );
  if (!row) {
    row = {
      id: `lvs-${locationId}-${productId}-${variantId}`,
      locationId,
      locationKind,
      productId,
      variantId,
      onHand: 0,
      reserved: 0,
      held: 0,
      reorderThreshold: 5,
      updatedAt: new Date().toISOString(),
    };
    db.stocks.push(row);
  }
  return row;
}

function syncCoreWarehouseStock(warehouseId: string, productId: string, variantId: string, onHand: number, reserved: number) {
  const core = readDb();
  if (!core.warehouseStocks) core.warehouseStocks = [];
  const idx = core.warehouseStocks.findIndex(
    (s) => s.warehouseId === warehouseId && s.productId === productId && (!s.variantId || s.variantId === variantId)
  );
  if (idx >= 0) {
    core.warehouseStocks[idx].quantity = onHand;
    core.warehouseStocks[idx].reservedQuantity = reserved;
  } else {
    core.warehouseStocks.push({
      id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      warehouseId,
      productId,
      variantId,
      quantity: onHand,
      reservedQuantity: reserved,
      reorderThreshold: 5,
    });
  }
  writeDb(core);
}

export function getFullPortalState() {
  const db = readPortalDb();
  const warehouses = devDb.getWarehouses();
  const products = devDb.getProducts();
  const variants = readDb().variants || [];
  const rawOrders = devDb.getOrders();

  // Merge warehouse metadata
  const enrichedWarehouses = warehouses.map((w) => {
    const meta = db.warehouseMeta.find((m) => m.warehouseId === w.id);
    return {
      ...w,
      tier: meta?.tier || 'BRANCH',
      district: meta?.district || w.address.split(',').pop()?.trim() || '',
      operatingContact: meta?.operatingContact || w.contactNumber,
    };
  });

  // Build product-variant catalog rows
  const catalogVariants = products.flatMap((p) => {
    const pVars = variants.filter((v) => v.productId === p.id);
    if (pVars.length === 0) {
      return [
        {
          productId: p.id,
          variantId: `default-${p.id}`,
          productName: p.name,
          variantName: 'Standard',
          sku: p.sku,
          price: p.price,
        },
      ];
    }
    return pVars.map((v) => ({
      productId: p.id,
      variantId: v.id,
      productName: p.name,
      variantName: v.variantName || v.title || 'Standard',
      sku: v.sku || p.sku,
      price: v.price || p.price,
    }));
  });

  // Enrich orders with details and fulfillment record
  const orders = rawOrders.map((ord) => {
    const details = devDb.getOrderWithDetails(ord.id);
    const fulfillment = db.orderFulfillments.find((f) => f.orderId === ord.id);
    return {
      ...details,
      fulfillment: fulfillment || null,
    };
  });

  return {
    warehouses: enrichedWarehouses,
    franchisees: db.franchisees,
    staffUsers: db.staffUsers,
    carriers: db.carriers,
    catalogVariants,
    stocks: db.stocks,
    adjustmentLogs: db.adjustmentLogs.slice(0, 100),
    transfers: db.transfers,
    orders,
    orderFulfillments: db.orderFulfillments,
    exceptions: db.exceptions,
  };
}

export function computeOrderRoutePreview(orderId: string) {
  const db = readPortalDb();
  const warehouses = devDb.getWarehouses().filter((w) => w.isActive);
  const order = devDb.getOrderWithDetails(orderId);
  if (!order) return null;

  const addr = order.shippingAddress || {};
  const lat = Number(addr.gpsLatitude) || 15.3647;
  const lon = Number(addr.gpsLongitude) || 75.124;

  const items = (order.items || []).map((it: any) => ({
    productId: it.productId,
    variantId: it.variantId || `default-${it.productId}`,
    productName: it.productName || 'Item',
    variantName: it.variantName || 'Standard',
    qty: Number(it.quantity) || 1,
  }));

  const checkLocationStock = (locationId: string) => {
    const shortages: { productName: string; variantName: string; needed: number; available: number }[] = [];
    let canFulfillAll = true;
    for (const item of items) {
      const row = db.stocks.find(
        (s) => s.locationId === locationId && s.productId === item.productId && s.variantId === item.variantId
      );
      const available = row ? Math.max(0, row.onHand - row.reserved) : 0;
      if (available < item.qty) {
        canFulfillAll = false;
        shortages.push({
          productName: item.productName,
          variantName: item.variantName,
          needed: item.qty,
          available,
        });
      }
    }
    return { canFulfillAll, shortages };
  };

  const warehousePreviews = warehouses
    .map((w) => {
      const meta = db.warehouseMeta.find((m) => m.warehouseId === w.id);
      const distanceKm = calculateDistanceKm(lat, lon, w.latitude, w.longitude);
      const stockCheck = checkLocationStock(w.id);
      return {
        locationId: w.id,
        locationKind: 'WAREHOUSE' as LocationKind,
        tier: meta?.tier || 'BRANCH',
        name: w.name,
        code: w.code,
        distanceKm,
        serviceable: distanceKm <= (w.serviceRadiusKm || 75) * 2,
        ...stockCheck,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const franchiseePreviews = db.franchisees
    .filter((f) => f.isActive)
    .map((f) => {
      const distanceKm = calculateDistanceKm(lat, lon, f.latitude, f.longitude);
      const stockCheck = checkLocationStock(f.id);
      return {
        locationId: f.id,
        locationKind: 'FRANCHISEE' as LocationKind,
        name: f.name,
        code: f.code,
        distanceKm,
        serviceable: distanceKm <= 60,
        linkedWarehouseIds: f.linkedWarehouseIds,
        ...stockCheck,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // Build eligible routes, prioritizing routes that can fulfill every line
  const routes: {
    id: string;
    pattern: RoutePattern;
    label: string;
    canFulfillAll: boolean;
    sourceLocationId: string;
    sourceName: string;
    branchLocationId?: string;
    branchName?: string;
    franchiseeId?: string;
    franchiseeName?: string;
    shortages: any[];
    distanceKm: number;
  }[] = [];

  for (const fr of franchiseePreviews) {
    if (fr.canFulfillAll) {
      routes.push({
        id: `route-fr-${fr.locationId}`,
        pattern: 'FRANCHISEE_DIRECT',
        label: `${fr.name} → Customer`,
        canFulfillAll: true,
        sourceLocationId: fr.locationId,
        sourceName: fr.name,
        franchiseeId: fr.locationId,
        franchiseeName: fr.name,
        shortages: [],
        distanceKm: fr.distanceKm,
      });
    }

    // Linked warehouses -> franchisee -> customer
    for (const whId of fr.linkedWarehouseIds) {
      const wh = warehousePreviews.find((w) => w.locationId === whId);
      if (!wh) continue;
      routes.push({
        id: `route-wh-fr-${wh.locationId}-${fr.locationId}`,
        pattern: 'WAREHOUSE_TO_FRANCHISEE',
        label: `${wh.name} → ${fr.name} → Customer`,
        canFulfillAll: wh.canFulfillAll,
        sourceLocationId: wh.locationId,
        sourceName: wh.name,
        franchiseeId: fr.locationId,
        franchiseeName: fr.name,
        shortages: wh.shortages,
        distanceKm: wh.distanceKm,
      });
    }

    // Branch relay: stocked warehouse -> linked branch -> franchisee -> customer
    const linkedBranches = warehousePreviews.filter(
      (b) => b.tier === 'BRANCH' && fr.linkedWarehouseIds.includes(b.locationId)
    );
    const stockedMains = warehousePreviews.filter((m) => m.tier === 'MAIN' && m.canFulfillAll);
    for (const branch of linkedBranches) {
      for (const main of stockedMains) {
        routes.push({
          id: `route-relay-${main.locationId}-${branch.locationId}-${fr.locationId}`,
          pattern: 'BRANCH_RELAY',
          label: `${main.name} → ${branch.name} → ${fr.name} → Customer`,
          canFulfillAll: true,
          sourceLocationId: main.locationId,
          sourceName: main.name,
          branchLocationId: branch.locationId,
          branchName: branch.name,
          franchiseeId: fr.locationId,
          franchiseeName: fr.name,
          shortages: [],
          distanceKm: branch.distanceKm,
        });
      }
    }
  }

  // Carrier direct routes from warehouses
  for (const wh of warehousePreviews) {
    routes.push({
      id: `route-carrier-${wh.locationId}`,
      pattern: 'CARRIER_DIRECT',
      label: `${wh.name} → Customer (Delivery Channel Partner)`,
      canFulfillAll: wh.canFulfillAll,
      sourceLocationId: wh.locationId,
      sourceName: wh.name,
      shortages: wh.shortages,
      distanceKm: wh.distanceKm,
    });
  }

  // Sort: full fulfillment first, then shortest distance
  routes.sort((a, b) => {
    if (a.canFulfillAll !== b.canFulfillAll) return a.canFulfillAll ? -1 : 1;
    return a.distanceKm - b.distanceKm;
  });

  return {
    orderId,
    orderNumber: order.orderNumber,
    warehousePreviews,
    franchiseePreviews,
    routes,
  };
}

export { generateOtp, syncCoreWarehouseStock };
