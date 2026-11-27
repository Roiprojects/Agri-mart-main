import { NextRequest, NextResponse } from 'next/server';
import { devDb, readDb, writeDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';
import {
  computeOrderRoutePreview,
  DispatchGroup,
  generateOtp,
  getFullPortalState,
  getLocationName,
  getOrCreateStockRow,
  LocationKind,
  PortalExceptionCase,
  readPortalDb,
  StockTransfer,
  syncCoreWarehouseStock,
  writePortalDb,
} from '@/lib/warehouse-portal-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const previewOrderId = searchParams.get('routePreviewOrderId');
    if (previewOrderId) {
      const preview = computeOrderRoutePreview(previewOrderId);
      return NextResponse.json({ success: true, preview });
    }
    const state = getFullPortalState();
    return NextResponse.json({ success: true, ...state });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    if (!action) {
      return NextResponse.json({ success: false, error: 'action is required' }, { status: 400 });
    }

    const db = readPortalDb();
    const now = new Date().toISOString();

    // -------------------------------------------------------------------------
    // 1. WAREHOUSES (MAIN & BRANCHES)
    // -------------------------------------------------------------------------
    if (action === 'SAVE_WAREHOUSE') {
      const {
        id,
        name,
        code,
        tier,
        address,
        district,
        latitude,
        longitude,
        serviceRadiusKm,
        servicedPincodes,
        managerName,
        operatingContact,
        isActive,
      } = body;
      if (!name?.trim()) {
        return NextResponse.json({ success: false, error: 'Warehouse name is required' }, { status: 400 });
      }
      const core = readDb();
      if (!core.warehouses) core.warehouses = [];
      const whId = id || `wh-${Date.now()}`;
      const whCode = (code || `WH-${name.trim().slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`).toUpperCase();
      const idx = core.warehouses.findIndex((w) => w.id === whId);

      const whRecord = {
        id: whId,
        name: name.trim(),
        code: whCode,
        latitude: Number(latitude) || 15.3647,
        longitude: Number(longitude) || 75.124,
        serviceRadiusKm: Number(serviceRadiusKm) || 60,
        servicedPincodes: servicedPincodes || '',
        address: address || '',
        managerName: managerName || '',
        contactNumber: operatingContact || '',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdAt: idx >= 0 ? core.warehouses[idx].createdAt : now,
      };

      if (idx >= 0) core.warehouses[idx] = whRecord;
      else core.warehouses.push(whRecord);
      writeDb(core);

      const metaIdx = db.warehouseMeta.findIndex((m) => m.warehouseId === whId);
      const metaRecord = {
        warehouseId: whId,
        tier: (tier === 'MAIN' ? 'MAIN' : 'BRANCH') as 'MAIN' | 'BRANCH',
        district: district || '',
        operatingContact: operatingContact || '',
      };
      if (metaIdx >= 0) db.warehouseMeta[metaIdx] = metaRecord;
      else db.warehouseMeta.push(metaRecord);
      writePortalDb(db);

      return NextResponse.json({ success: true, message: 'Warehouse profile saved.', warehouse: whRecord });
    }

    if (action === 'DELETE_WAREHOUSE') {
      const { id } = body;
      const core = readDb();
      core.warehouses = (core.warehouses || []).filter((w) => w.id !== id);
      writeDb(core);
      db.warehouseMeta = db.warehouseMeta.filter((m) => m.warehouseId !== id);
      db.franchisees.forEach((f) => {
        f.linkedWarehouseIds = f.linkedWarehouseIds.filter((wid) => wid !== id);
      });
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Warehouse removed.' });
    }

    // -------------------------------------------------------------------------
    // 2. FRANCHISEES
    // -------------------------------------------------------------------------
    if (action === 'SAVE_FRANCHISEE') {
      const { id, name, code, address, district, latitude, longitude, contact, linkedWarehouseIds, isActive } = body;
      if (!name?.trim()) {
        return NextResponse.json({ success: false, error: 'Franchisee name is required' }, { status: 400 });
      }
      const frId = id || `fr-${Date.now()}`;
      const idx = db.franchisees.findIndex((f) => f.id === frId);
      const record = {
        id: frId,
        name: name.trim(),
        code: (code || `FR-${name.trim().slice(0, 4).toUpperCase()}`).toUpperCase(),
        address: address || '',
        district: district || '',
        latitude: Number(latitude) || 15.4,
        longitude: Number(longitude) || 75.15,
        contact: contact || '',
        linkedWarehouseIds: Array.isArray(linkedWarehouseIds) ? linkedWarehouseIds : [],
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdAt: idx >= 0 ? db.franchisees[idx].createdAt : now,
        updatedAt: now,
      };
      if (idx >= 0) db.franchisees[idx] = record;
      else db.franchisees.push(record);
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Franchisee profile saved.', franchisee: record });
    }

    if (action === 'DELETE_FRANCHISEE') {
      db.franchisees = db.franchisees.filter((f) => f.id !== body.id);
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Franchisee removed.' });
    }

    // -------------------------------------------------------------------------
    // 3. STAFF USERS & ACCESS
    // -------------------------------------------------------------------------
    if (action === 'SAVE_STAFF') {
      const { id, name, email, mobile, status, assignments } = body;
      if (!name?.trim()) {
        return NextResponse.json({ success: false, error: 'Staff name is required' }, { status: 400 });
      }
      const staffId = id || `staff-${Date.now()}`;
      const idx = db.staffUsers.findIndex((u) => u.id === staffId);
      const record = {
        id: staffId,
        name: name.trim(),
        email: email || '',
        mobile: mobile || '',
        status: (status || (idx >= 0 ? db.staffUsers[idx].status : 'ACTIVE')) as 'INVITED' | 'ACTIVE' | 'SUSPENDED',
        assignments: Array.isArray(assignments) ? assignments : [],
        invitedAt: idx >= 0 ? db.staffUsers[idx].invitedAt : now,
        activatedAt: status === 'ACTIVE' ? now : idx >= 0 ? db.staffUsers[idx].activatedAt : now,
      };
      if (idx >= 0) db.staffUsers[idx] = record;
      else db.staffUsers.push(record);
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Staff access saved.', staff: record });
    }

    if (action === 'RESEND_INVITE') {
      const staff = db.staffUsers.find((u) => u.id === body.id);
      if (!staff) return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
      staff.invitedAt = now;
      staff.status = 'ACTIVE';
      staff.activatedAt = now;
      writePortalDb(db);
      return NextResponse.json({ success: true, message: `Invitation resent & login activated for ${staff.name}.` });
    }

    if (action === 'TOGGLE_STAFF_STATUS') {
      const staff = db.staffUsers.find((u) => u.id === body.id);
      if (!staff) return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
      staff.status = staff.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
      writePortalDb(db);
      return NextResponse.json({ success: true, message: `${staff.name} is now ${staff.status}.` });
    }

    if (action === 'DELETE_STAFF') {
      db.staffUsers = db.staffUsers.filter((u) => u.id !== body.id);
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Staff user removed.' });
    }

    // -------------------------------------------------------------------------
    // 4. DELIVERY CHANNEL PARTNERS (CARRIERS)
    // -------------------------------------------------------------------------
    if (action === 'SAVE_CARRIER') {
      const { id, name, code, mode, trackingUrlTemplate, contactMobile, isActive } = body;
      if (!name?.trim()) return NextResponse.json({ success: false, error: 'Carrier name is required' }, { status: 400 });
      const carId = id || `car-${Date.now()}`;
      const idx = db.carriers.findIndex((c) => c.id === carId);
      const record = {
        id: carId,
        name: name.trim(),
        code: (code || name.trim().slice(0, 5)).toUpperCase(),
        mode: (mode === 'CONNECTED' ? 'CONNECTED' : 'MANUAL') as 'MANUAL' | 'CONNECTED',
        trackingUrlTemplate: trackingUrlTemplate || '',
        contactMobile: contactMobile || '',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      };
      if (idx >= 0) db.carriers[idx] = record;
      else db.carriers.push(record);
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Delivery partner saved.', carrier: record });
    }

    if (action === 'DELETE_CARRIER') {
      db.carriers = db.carriers.filter((c) => c.id !== body.id);
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Delivery partner removed.' });
    }

    // -------------------------------------------------------------------------
    // 5. STOCK & AVAILABILITY (OPENING / ADJUST / RELEASE HELD)
    // -------------------------------------------------------------------------
    if (action === 'SET_OPENING_STOCK' || action === 'ADJUST_STOCK') {
      const { locationId, locationKind, productId, variantId, productName, variantName, quantity, delta, reason, reorderThreshold, performedBy } = body;
      if (!locationId || !productId || !variantId) {
        return NextResponse.json({ success: false, error: 'locationId, productId, and variantId are required' }, { status: 400 });
      }
      const kind: LocationKind = locationKind || (db.franchisees.some((f) => f.id === locationId) ? 'FRANCHISEE' : 'WAREHOUSE');
      const row = getOrCreateStockRow(db, locationId, kind, productId, variantId);

      let change = 0;
      if (action === 'SET_OPENING_STOCK') {
        const newOnHand = Math.max(0, Number(quantity) || 0);
        change = newOnHand - row.onHand;
        row.onHand = newOnHand;
      } else {
        if (!reason?.trim()) {
          return NextResponse.json({ success: false, error: 'Reason is required for stock adjustment' }, { status: 400 });
        }
        change = Number(delta) || 0;
        row.onHand = Math.max(row.reserved, row.onHand + change);
      }
      if (reorderThreshold !== undefined) row.reorderThreshold = Math.max(0, Number(reorderThreshold) || 0);
      row.updatedAt = now;

      db.adjustmentLogs.unshift({
        id: `adj-${Date.now()}`,
        locationId,
        productId,
        variantId,
        productName: productName || productId,
        variantName: variantName || 'Standard',
        delta: change,
        type: action === 'SET_OPENING_STOCK' ? 'OPENING' : 'ADJUST',
        reason: reason || 'Opening balance recorded',
        performedBy: performedBy || 'Inventory Operator',
        createdAt: now,
      });

      writePortalDb(db);
      if (kind === 'WAREHOUSE') {
        syncCoreWarehouseStock(locationId, productId, variantId, row.onHand, row.reserved);
      }
      try { await revalidateFrontendPath('/shop'); } catch {}
      return NextResponse.json({ success: true, message: 'Stock balance updated.', stock: row });
    }

    if (action === 'RELEASE_HELD_STOCK') {
      const { locationId, productId, variantId, productName, variantName, qty, toAvailable, reason, performedBy } = body;
      const row = db.stocks.find(
        (s) => s.locationId === locationId && s.productId === productId && s.variantId === variantId
      );
      if (!row || row.held <= 0) {
        return NextResponse.json({ success: false, error: 'No held stock found' }, { status: 400 });
      }
      const releaseQty = Math.min(row.held, Math.max(1, Number(qty) || row.held));
      row.held -= releaseQty;
      if (toAvailable) row.onHand += releaseQty;
      row.updatedAt = now;

      db.adjustmentLogs.unshift({
        id: `adj-${Date.now()}`,
        locationId,
        productId,
        variantId,
        productName: productName || productId,
        variantName: variantName || 'Standard',
        delta: toAvailable ? releaseQty : -releaseQty,
        type: 'RELEASE',
        reason: reason || (toAvailable ? 'Inspected held units released to available stock' : 'Damaged held units written off'),
        performedBy: performedBy || 'Warehouse Manager',
        createdAt: now,
      });
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Held stock updated.' });
    }

    // -------------------------------------------------------------------------
    // 6. STOCK TRANSFERS & BULK TRIPS
    // -------------------------------------------------------------------------
    if (action === 'CREATE_TRANSFER') {
      const { sourceWarehouseId, notes, groups, createdBy, prepareNow } = body;
      if (!sourceWarehouseId || !Array.isArray(groups) || groups.length === 0) {
        return NextResponse.json({ success: false, error: 'Source warehouse and at least one dispatch group are required' }, { status: 400 });
      }
      const sourceName = getLocationName(db, sourceWarehouseId);
      const transferNumber = `TRF-${new Date().getFullYear()}-${String(db.transfers.length + 1).padStart(4, '0')}`;

      const builtGroups: DispatchGroup[] = groups.map((g: any, gIdx: number) => {
        const destKind: LocationKind = db.franchisees.some((f) => f.id === g.destinationId) ? 'FRANCHISEE' : 'WAREHOUSE';
        const items = (g.items || []).map((it: any, iIdx: number) => ({
          id: `tli-${Date.now()}-${gIdx}-${iIdx}`,
          productId: it.productId,
          variantId: it.variantId,
          productName: it.productName,
          variantName: it.variantName,
          sku: it.sku || '',
          requestedQty: Math.max(1, Number(it.requestedQty) || 1),
          packedQty: Math.max(1, Number(it.packedQty || it.requestedQty) || 1),
          receivedGoodQty: 0,
          receivedDamagedQty: 0,
          orderId: it.orderId || undefined,
          orderNumber: it.orderNumber || undefined,
          packageId: it.packageId || `PKG-${transferNumber.slice(-4)}-${gIdx + 1}-${iIdx + 1}`,
        }));

        const hasReplenishment = items.some((i: any) => !i.orderId);
        const hasOrders = items.some((i: any) => Boolean(i.orderId));
        const purpose = hasReplenishment && hasOrders ? 'MIXED' : hasOrders ? 'ORDER_PACKAGES' : 'REPLENISHMENT';

        return {
          id: `grp-${Date.now()}-${gIdx}`,
          destinationId: g.destinationId,
          destinationKind: destKind,
          destinationName: getLocationName(db, g.destinationId),
          transportMethod: g.transportMethod === 'DELIVERY_PARTNER' ? 'DELIVERY_PARTNER' : 'OWN_VEHICLE',
          purpose,
          status: 'DRAFT',
          items,
          vehicleRegistration: g.vehicleRegistration || '',
          vehicleType: g.vehicleType || '',
          driverName: g.driverName || '',
          driverReference: g.driverReference || '',
          driverMobile: g.driverMobile || '',
          carrierId: g.carrierId || '',
          carrierName: g.carrierName || '',
          receipts: [],
        };
      });

      const transfer: StockTransfer = {
        id: `trf-${Date.now()}`,
        transferNumber,
        sourceWarehouseId,
        sourceWarehouseName: sourceName,
        isBulkTrip: builtGroups.length > 1,
        notes: notes || '',
        groups: builtGroups,
        createdBy: createdBy || 'Warehouse Dispatcher',
        createdAt: now,
        updatedAt: now,
      };

      if (prepareNow) {
        for (const grp of transfer.groups) {
          for (const item of grp.items) {
            const row = getOrCreateStockRow(db, sourceWarehouseId, 'WAREHOUSE', item.productId, item.variantId);
            const available = Math.max(0, row.onHand - row.reserved);
            if (available < item.packedQty) {
              return NextResponse.json(
                {
                  success: false,
                  error: `Shortage at ${sourceName} for ${item.productName} (${item.variantName}): available ${available}, requested ${item.packedQty}`,
                },
                { status: 400 }
              );
            }
          }
          for (const item of grp.items) {
            const row = getOrCreateStockRow(db, sourceWarehouseId, 'WAREHOUSE', item.productId, item.variantId);
            row.reserved += item.packedQty;
            row.updatedAt = now;
            syncCoreWarehouseStock(sourceWarehouseId, item.productId, item.variantId, row.onHand, row.reserved);
          }
          grp.status = 'PREPARED';
        }
      }

      db.transfers.unshift(transfer);
      writePortalDb(db);
      return NextResponse.json({ success: true, message: `Transfer ${transferNumber} created.`, transfer });
    }

    if (action === 'PREPARE_TRANSFER_GROUP') {
      const { transferId, groupId } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Transfer group not found' }, { status: 404 });
      if (grp.status !== 'DRAFT') return NextResponse.json({ success: false, error: 'Only draft groups can be prepared' }, { status: 400 });

      for (const item of grp.items) {
        const row = getOrCreateStockRow(db, transfer.sourceWarehouseId, 'WAREHOUSE', item.productId, item.variantId);
        const available = Math.max(0, row.onHand - row.reserved);
        if (available < item.packedQty) {
          return NextResponse.json(
            { success: false, error: `Insufficient available stock for ${item.productName} (${item.variantName}): ${available} < ${item.packedQty}` },
            { status: 400 }
          );
        }
      }
      for (const item of grp.items) {
        const row = getOrCreateStockRow(db, transfer.sourceWarehouseId, 'WAREHOUSE', item.productId, item.variantId);
        row.reserved += item.packedQty;
        row.updatedAt = now;
        syncCoreWarehouseStock(transfer.sourceWarehouseId, item.productId, item.variantId, row.onHand, row.reserved);
      }
      grp.status = 'PREPARED';
      transfer.updatedAt = now;
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Dispatch group prepared and stock reserved.' });
    }

    if (action === 'UPDATE_GROUP_PACKING') {
      const { transferId, groupId, items, transportMethod } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Transfer group not found' }, { status: 404 });

      if (transportMethod) grp.transportMethod = transportMethod;
      if (Array.isArray(items)) {
        for (const upd of items) {
          const item = grp.items.find((i) => i.id === upd.id);
          if (!item) continue;
          const newPacked = Math.max(0, Number(upd.packedQty) || 0);
          if (grp.status === 'PREPARED' && newPacked !== item.packedQty) {
            const row = getOrCreateStockRow(db, transfer.sourceWarehouseId, 'WAREHOUSE', item.productId, item.variantId);
            const delta = newPacked - item.packedQty;
            if (delta > Math.max(0, row.onHand - row.reserved)) {
              return NextResponse.json({ success: false, error: `Not enough available stock to increase ${item.productName}` }, { status: 400 });
            }
            row.reserved = Math.max(0, row.reserved + delta);
            syncCoreWarehouseStock(transfer.sourceWarehouseId, item.productId, item.variantId, row.onHand, row.reserved);
          }
          item.packedQty = newPacked;
        }
      }
      transfer.updatedAt = now;
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Pick & pack quantities updated.' });
    }

    if (action === 'ISSUE_CHALLAN') {
      const { transferId, groupId, vehicleRegistration, vehicleType, driverName, driverReference, driverMobile } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Transfer group not found' }, { status: 404 });

      grp.vehicleRegistration = vehicleRegistration;
      grp.vehicleType = vehicleType;
      grp.driverName = driverName;
      grp.driverReference = driverReference;
      grp.driverMobile = driverMobile;
      grp.driverAcknowledged = true;

      const challanNumber = grp.challan?.challanNumber || `CH-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      grp.challan = {
        challanNumber,
        groupId: grp.id,
        transferNumber: transfer.transferNumber,
        sourceLocationId: transfer.sourceWarehouseId,
        sourceName: transfer.sourceWarehouseName,
        destinationLocationId: grp.destinationId,
        destinationName: grp.destinationName,
        vehicleRegistration,
        vehicleType,
        driverName,
        driverReference: driverReference || '',
        driverMobile,
        deliveryCopyIssued: true,
        acknowledgmentCopyIssued: true,
        issuedAt: now,
      };
      grp.pickupOtpCode = generateOtp();
      grp.pickupOtpVerified = false;
      transfer.updatedAt = now;
      writePortalDb(db);
      return NextResponse.json({
        success: true,
        message: `Two copies of challan ${challanNumber} issued & Pickup OTP generated.`,
        challan: grp.challan,
        pickupOtpCode: grp.pickupOtpCode,
      });
    }

    if (action === 'CONFIRM_OWN_VEHICLE_DISPATCH') {
      const { transferId, groupId, otpCode } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Transfer group not found' }, { status: 404 });
      if (!grp.challan) return NextResponse.json({ success: false, error: 'Issue both challan copies before dispatch' }, { status: 400 });
      if (String(otpCode).trim() !== String(grp.pickupOtpCode)) {
        return NextResponse.json({ success: false, error: 'Invalid driver Pickup OTP' }, { status: 400 });
      }

      grp.pickupOtpVerified = true;
      grp.status = 'IN_TRANSIT';
      grp.dispatchedAt = now;

      for (const item of grp.items) {
        const row = getOrCreateStockRow(db, transfer.sourceWarehouseId, 'WAREHOUSE', item.productId, item.variantId);
        row.onHand = Math.max(0, row.onHand - item.packedQty);
        row.reserved = Math.max(0, row.reserved - item.packedQty);
        row.updatedAt = now;
        syncCoreWarehouseStock(transfer.sourceWarehouseId, item.productId, item.variantId, row.onHand, row.reserved);

        db.adjustmentLogs.unshift({
          id: `adj-${Date.now()}-${item.id}`,
          locationId: transfer.sourceWarehouseId,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          variantName: item.variantName,
          delta: -item.packedQty,
          type: 'TRANSFER_OUT',
          reason: `Dispatched on ${grp.challan.challanNumber} to ${grp.destinationName}`,
          referenceId: transfer.transferNumber,
          performedBy: grp.driverName || 'Driver',
          createdAt: now,
        });

        if (item.orderId) {
          const ful = db.orderFulfillments.find((f) => f.orderId === item.orderId);
          if (ful) {
            ful.status = 'IN_TRANSIT';
            ful.updatedAt = now;
            const leg = ful.legs.find((l) => l.groupId === grp.id);
            if (leg) {
              leg.status = 'IN_TRANSIT';
              leg.challanNumber = grp.challan.challanNumber;
            }
          }
        }
      }

      transfer.updatedAt = now;
      writePortalDb(db);
      return NextResponse.json({ success: true, message: `Dispatch confirmed. Load is now In Transit.` });
    }

    if (action === 'DISPATCH_PARTNER_GROUP') {
      const { transferId, groupId, carrierId, awbNumber, courierRepName, otpCode, generateCourierOtp } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Transfer group not found' }, { status: 404 });

      const carrier = db.carriers.find((c) => c.id === carrierId);
      if (generateCourierOtp) {
        grp.carrierId = carrierId;
        grp.carrierName = carrier?.name || body.carrierName || 'Delivery Partner';
        grp.awbNumber = awbNumber || `AWB-${Date.now().toString().slice(-8)}`;
        grp.trackingUrl = carrier?.trackingUrlTemplate
          ? carrier.trackingUrlTemplate.replace('{AWB}', grp.awbNumber || '')
          : '';
        grp.courierRepName = courierRepName || 'Courier Representative';
        grp.courierOtpCode = generateOtp();
        writePortalDb(db);
        return NextResponse.json({
          success: true,
          message: 'AWB assigned & Courier Pickup OTP generated.',
          courierOtpCode: grp.courierOtpCode,
          awbNumber: grp.awbNumber,
        });
      }

      if (String(otpCode).trim() !== String(grp.courierOtpCode)) {
        return NextResponse.json({ success: false, error: 'Invalid courier representative OTP' }, { status: 400 });
      }
      grp.courierOtpVerified = true;
      grp.status = 'IN_TRANSIT';
      grp.dispatchedAt = now;

      for (const item of grp.items) {
        const row = getOrCreateStockRow(db, transfer.sourceWarehouseId, 'WAREHOUSE', item.productId, item.variantId);
        row.onHand = Math.max(0, row.onHand - item.packedQty);
        row.reserved = Math.max(0, row.reserved - item.packedQty);
        row.updatedAt = now;
        syncCoreWarehouseStock(transfer.sourceWarehouseId, item.productId, item.variantId, row.onHand, row.reserved);

        if (item.orderId) {
          const ful = db.orderFulfillments.find((f) => f.orderId === item.orderId);
          if (ful) {
            ful.status = 'IN_TRANSIT';
            ful.updatedAt = now;
            const leg = ful.legs.find((l) => l.groupId === grp.id);
            if (leg) {
              leg.status = 'IN_TRANSIT';
              leg.awbNumber = grp.awbNumber;
              leg.carrierName = grp.carrierName;
            }
          }
        }
      }
      transfer.updatedAt = now;
      writePortalDb(db);
      return NextResponse.json({ success: true, message: `Carrier handover confirmed (${grp.awbNumber}).` });
    }

    if (action === 'CANCEL_TRANSFER_GROUP') {
      const { transferId, groupId } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Transfer group not found' }, { status: 404 });

      if (grp.status === 'PREPARED') {
        for (const item of grp.items) {
          const row = getOrCreateStockRow(db, transfer.sourceWarehouseId, 'WAREHOUSE', item.productId, item.variantId);
          row.reserved = Math.max(0, row.reserved - item.packedQty);
          syncCoreWarehouseStock(transfer.sourceWarehouseId, item.productId, item.variantId, row.onHand, row.reserved);
        }
      }
      grp.status = 'CANCELLED';
      transfer.updatedAt = now;
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Transfer group cancelled and reserved stock released.' });
    }

    // -------------------------------------------------------------------------
    // 7. INCOMING & RECEIVING
    // -------------------------------------------------------------------------
    if (action === 'REQUEST_RECEIPT_OTP') {
      const { transferId, groupId, receiverUserId } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Incoming load not found' }, { status: 404 });

      grp.assignedReceiverId = receiverUserId || grp.assignedReceiverId;
      grp.receiptOtpCode = generateOtp();
      writePortalDb(db);
      return NextResponse.json({
        success: true,
        message: 'Destination Receipt OTP generated for receiver.',
        receiptOtpCode: grp.receiptOtpCode,
      });
    }

    if (action === 'REASSIGN_RECEIVER') {
      const { transferId, groupId, receiverUserId } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Incoming load not found' }, { status: 404 });
      grp.assignedReceiverId = receiverUserId;
      grp.receiptOtpCode = generateOtp();
      writePortalDb(db);
      return NextResponse.json({
        success: true,
        message: 'Receiver reassigned with fresh Receipt OTP.',
        receiptOtpCode: grp.receiptOtpCode,
      });
    }

    if (action === 'UPLOAD_SIGNED_COPY') {
      const { transferId, groupId, signedCopyAttachment, signedByName, signedByRole } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Transfer group not found' }, { status: 404 });
      if (!grp.challan) return NextResponse.json({ success: false, error: 'No challan found for this group' }, { status: 400 });

      grp.challan.signedCopyAttachment = signedCopyAttachment || 'signed-ack-copy.png';
      grp.challan.signedByName = signedByName || 'Receiver';
      grp.challan.signedByRole = signedByRole || 'RECEIVING_STAFF';
      grp.challan.signedAt = now;

      // If there was a receipt pending signed copy, release those units now
      for (const r of grp.receipts) {
        if (r.status === 'PENDING_SIGNED_COPY') {
          r.signedCopyAttached = true;
          r.signedCopyAttachment = grp.challan.signedCopyAttachment;
          r.status = 'CONFIRMED';
          for (const line of r.lines) {
            if (line.goodQty > 0) {
              const row = getOrCreateStockRow(db, grp.destinationId, grp.destinationKind, line.productName ? grp.items.find((i) => i.id === line.lineId)?.productId || '' : '', grp.items.find((i) => i.id === line.lineId)?.variantId || '');
              row.onHand += line.goodQty;
              if (line.orderId) row.reserved += line.goodQty;
              row.updatedAt = now;
              if (grp.destinationKind === 'WAREHOUSE') {
                syncCoreWarehouseStock(grp.destinationId, row.productId, row.variantId, row.onHand, row.reserved);
              }
            }
          }
        }
      }

      if (grp.status === 'PENDING_SIGNED_COPY') {
        const allReceived = grp.items.every((i) => i.receivedGoodQty + i.receivedDamagedQty >= i.packedQty);
        grp.status = allReceived ? 'RECEIVED' : 'PARTIAL_RECEIPT';
      }

      // Resolve any PENDING_SIGNED_COPY exception
      for (const ex of db.exceptions) {
        if (ex.groupId === grp.id && ex.type === 'PENDING_SIGNED_COPY' && ex.status !== 'RESOLVED') {
          ex.status = 'RESOLVED';
          ex.resolutionNote = `Signed acknowledgment copy uploaded by ${signedByName || 'operator'}.`;
          ex.updatedAt = now;
        }
      }

      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Signed acknowledgment copy uploaded and linked.' });
    }

    if (action === 'ACCEPT_RECEIPT') {
      const { transferId, groupId, receiverUserId, receiverName, receiverRole, otpCode, signedCopyAttachment, notes, counts } = body;
      const transfer = db.transfers.find((t) => t.id === transferId);
      const grp = transfer?.groups.find((g) => g.id === groupId);
      if (!transfer || !grp) return NextResponse.json({ success: false, error: 'Incoming load not found' }, { status: 404 });
      if (grp.status === 'RECEIVED') {
        return NextResponse.json({ success: false, error: 'This load is already fully received.' }, { status: 400 });
      }
      if (String(otpCode).trim() !== String(grp.receiptOtpCode)) {
        return NextResponse.json({ success: false, error: 'Invalid destination Receipt OTP' }, { status: 400 });
      }

      const hasSignedCopy =
        grp.transportMethod !== 'OWN_VEHICLE' ||
        Boolean(signedCopyAttachment) ||
        Boolean(grp.challan?.signedCopyAttachment);

      if (signedCopyAttachment && grp.challan) {
        grp.challan.signedCopyAttachment = signedCopyAttachment;
        grp.challan.signedByName = receiverName;
        grp.challan.signedByRole = receiverRole;
        grp.challan.signedAt = now;
      }

      const receiptLines: ReceiptRecord['lines'] = [];
      let anyDamaged = false;

      for (const item of grp.items) {
        const entry = Array.isArray(counts) ? counts.find((c: any) => c.lineId === item.id) : null;
        const remaining = Math.max(0, item.packedQty - (item.receivedGoodQty + item.receivedDamagedQty));
        const goodQty = Math.min(remaining, Math.max(0, Number(entry?.goodQty) || 0));
        const damagedQty = Math.min(remaining - goodQty, Math.max(0, Number(entry?.damagedQty) || 0));

        if (goodQty === 0 && damagedQty === 0) continue;

        item.receivedGoodQty += goodQty;
        item.receivedDamagedQty += damagedQty;

        receiptLines.push({
          lineId: item.id,
          productName: item.productName,
          variantName: item.variantName,
          goodQty,
          damagedQty,
          orderId: item.orderId,
        });

        const row = getOrCreateStockRow(db, grp.destinationId, grp.destinationKind, item.productId, item.variantId);
        if (hasSignedCopy && goodQty > 0) {
          row.onHand += goodQty;
          if (item.orderId) row.reserved += goodQty;
          row.updatedAt = now;
          if (grp.destinationKind === 'WAREHOUSE') {
            syncCoreWarehouseStock(grp.destinationId, item.productId, item.variantId, row.onHand, row.reserved);
          }
          db.adjustmentLogs.unshift({
            id: `adj-${Date.now()}-${item.id}`,
            locationId: grp.destinationId,
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            delta: goodQty,
            type: 'TRANSFER_IN',
            reason: item.orderId
              ? `Received reserved stock for Order #${item.orderNumber || item.orderId}`
              : `Received replenishment from ${transfer.sourceWarehouseName}`,
            referenceId: transfer.transferNumber,
            performedBy: receiverName || 'Receiver',
            createdAt: now,
          });
        }

        if (damagedQty > 0) {
          anyDamaged = true;
          row.held += damagedQty;
          row.updatedAt = now;
          db.adjustmentLogs.unshift({
            id: `adj-dmg-${Date.now()}-${item.id}`,
            locationId: grp.destinationId,
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            delta: damagedQty,
            type: 'HELD',
            reason: `Damaged / refused on receipt (${notes || 'No notes'})`,
            referenceId: transfer.transferNumber,
            performedBy: receiverName || 'Receiver',
            createdAt: now,
          });
        }

        if (item.orderId && hasSignedCopy && goodQty > 0) {
          const ful = db.orderFulfillments.find((f) => f.orderId === item.orderId);
          if (ful) {
            const leg = ful.legs.find((l) => l.groupId === grp.id);
            if (leg) {
              leg.status = 'RECEIVED';
              leg.signedCopyAttached = hasSignedCopy;
              leg.receiverName = receiverName;
            }
            if (grp.destinationKind === 'FRANCHISEE') {
              ful.status = 'READY_FOR_DELIVERY';
              ful.customerOtpCode = ful.customerOtpCode || generateOtp();
            } else {
              ful.status = 'READY_FOR_DISPATCH';
            }
            ful.updatedAt = now;
          }
        }
      }

      const allAccounted = grp.items.every((i) => i.receivedGoodQty + i.receivedDamagedQty >= i.packedQty);
      const receiptNumber = `RCP-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const receiptStatus = !hasSignedCopy
        ? 'PENDING_SIGNED_COPY'
        : allAccounted
        ? 'CONFIRMED'
        : 'PARTIAL';

      grp.receipts.push({
        id: `rcp-${Date.now()}`,
        receiptNumber,
        transferId: transfer.id,
        groupId: grp.id,
        locationId: grp.destinationId,
        locationName: grp.destinationName,
        receiverUserId: receiverUserId || 'staff-receiver',
        receiverName: receiverName || 'Receiver',
        receiverRole: receiverRole || 'RECEIVING_STAFF',
        receiptOtpVerified: true,
        signedCopyAttached: hasSignedCopy,
        signedCopyAttachment: grp.challan?.signedCopyAttachment,
        notes: notes || '',
        lines: receiptLines,
        status: receiptStatus,
        createdAt: now,
      });

      if (!hasSignedCopy) {
        grp.status = 'PENDING_SIGNED_COPY';
        db.exceptions.unshift({
          id: `ex-${Date.now()}`,
          type: 'PENDING_SIGNED_COPY',
          title: `Signed Acknowledgment Pending (${grp.challan?.challanNumber || transfer.transferNumber})`,
          description: `Receipt ${receiptNumber} was verified by ${receiverName}, but own-vehicle signed copy is missing. Affected units remain unavailable.`,
          transferId: transfer.id,
          transferNumber: transfer.transferNumber,
          groupId: grp.id,
          locationId: grp.destinationId,
          currentHolder: grp.driverName || grp.destinationName,
          status: 'OPEN',
          createdAt: now,
          updatedAt: now,
        });
      } else if (!allAccounted) {
        grp.status = 'PARTIAL_RECEIPT';
        db.exceptions.unshift({
          id: `ex-part-${Date.now()}`,
          type: 'PARTIAL_RECEIPT',
          title: `Partial Receipt on ${transfer.transferNumber}`,
          description: `Accepted partial units on ${receiptNumber}. Remaining quantities stay open for next delivery or resolution.`,
          transferId: transfer.id,
          transferNumber: transfer.transferNumber,
          groupId: grp.id,
          locationId: grp.destinationId,
          currentHolder: grp.destinationName,
          status: 'OPEN',
          createdAt: now,
          updatedAt: now,
        });
      } else {
        grp.status = 'RECEIVED';
      }

      if (anyDamaged) {
        db.exceptions.unshift({
          id: `ex-dmg-${Date.now()}`,
          type: 'DAMAGED_HELD',
          title: `Damaged Goods Held on ${transfer.transferNumber}`,
          description: `Damaged/refused items recorded on ${receiptNumber}: ${notes || 'Inspect held stock.'}`,
          transferId: transfer.id,
          transferNumber: transfer.transferNumber,
          groupId: grp.id,
          locationId: grp.destinationId,
          currentHolder: grp.destinationName,
          status: 'OPEN',
          createdAt: now,
          updatedAt: now,
        });
      }

      transfer.updatedAt = now;
      writePortalDb(db);
      return NextResponse.json({
        success: true,
        message: hasSignedCopy
          ? `Receipt ${receiptNumber} posted.`
          : `Receipt ${receiptNumber} saved as Pending Signed Copy (upload signed challan to release stock).`,
      });
    }

    // -------------------------------------------------------------------------
    // 8. ORDERS -> DISPATCH, MULTI-LEG ROUTING & FRANCHISEE DELIVERY
    // -------------------------------------------------------------------------
    if (action === 'CREATE_DEMO_ORDER') {
      const { customerName, customerMobile, addressLine, district, pincode, latitude, longitude, productId, variantId, quantity } = body;
      const core = readDb();
      const prod = core.products.find((p) => p.id === productId) || core.products[0];
      if (!prod) return NextResponse.json({ success: false, error: 'No products in catalog' }, { status: 400 });
      const variant = core.variants.find((v) => v.id === variantId) || core.variants.find((v) => v.productId === prod.id);
      const qty = Math.max(1, Number(quantity) || 1);
      const unitPrice = variant?.price || prod.price;

      const ordId = `ord-${Date.now()}`;
      const orderNumber = `AG-${Math.floor(10000 + Math.random() * 90000)}`;
      const addrId = `addr-${Date.now()}`;
      const userId = `usr-${Date.now()}`;

      core.users.push({
        id: userId,
        name: customerName || 'Walk-in / Portal Customer',
        mobile: customerMobile || '9845000000',
        role: 'CUSTOMER',
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      });
      core.addresses.push({
        id: addrId,
        userId,
        fullName: customerName || 'Portal Customer',
        mobile: customerMobile || '9845000000',
        addressLine: addressLine || 'Main Road, Sector 2',
        taluk: district || 'Hubballi',
        village: district || 'Hubballi',
        district: district || 'Dharwad',
        state: 'Karnataka',
        pincode: pincode || '580020',
        gpsLatitude: Number(latitude) || 15.38,
        gpsLongitude: Number(longitude) || 75.14,
        isDefaultShipping: true,
        isDefaultBilling: true,
        createdAt: now,
        updatedAt: now,
      });
      core.orders.unshift({
        id: ordId,
        orderNumber,
        userId,
        addressId: addrId,
        subtotalAmount: unitPrice * qty,
        deliveryFee: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: unitPrice * qty,
        status: 'PLACED',
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        assignmentMode: 'MANUAL',
        trackingMilestones: [],
        createdAt: now,
        updatedAt: now,
      });
      core.orderItems.push({
        id: `oi-${Date.now()}`,
        orderId: ordId,
        productId: prod.id,
        variantId: variant?.id || `default-${prod.id}`,
        productName: prod.name,
        variantName: variant?.variantName || variant?.title || 'Standard',
        sku: variant?.sku || prod.sku,
        quantity: qty,
        unitPrice,
        totalPrice: unitPrice * qty,
      });
      writeDb(core);
      return NextResponse.json({ success: true, message: `Order #${orderNumber} created.`, orderId: ordId });
    }

    if (action === 'CONFIRM_ORDER_ROUTE') {
      const { orderId, routePattern, sourceLocationId, branchLocationId, franchiseeId, carrierId } = body;
      const order = devDb.getOrderWithDetails(orderId);
      if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

      const items = (order.items || []).map((it: any) => ({
        productId: it.productId,
        variantId: it.variantId || `default-${it.productId}`,
        productName: it.productName || 'Item',
        variantName: it.variantName || 'Standard',
        sku: it.sku || '',
        qty: Number(it.quantity) || 1,
      }));

      const sourceKind: LocationKind = db.franchisees.some((f) => f.id === sourceLocationId) ? 'FRANCHISEE' : 'WAREHOUSE';
      for (const item of items) {
        const row = getOrCreateStockRow(db, sourceLocationId, sourceKind, item.productId, item.variantId);
        const available = Math.max(0, row.onHand - row.reserved);
        if (available < item.qty) {
          return NextResponse.json(
            { success: false, error: `Stock short at ${getLocationName(db, sourceLocationId)} for ${item.productName}: available ${available}, needed ${item.qty}` },
            { status: 400 }
          );
        }
      }

      // Reserve at source
      for (const item of items) {
        const row = getOrCreateStockRow(db, sourceLocationId, sourceKind, item.productId, item.variantId);
        row.reserved += item.qty;
        row.updatedAt = now;
        if (sourceKind === 'WAREHOUSE') {
          syncCoreWarehouseStock(sourceLocationId, item.productId, item.variantId, row.onHand, row.reserved);
        }
      }

      const legs: OrderFulfillmentRecord['legs'] = [];
      let status: OrderFulfillmentRecord['status'] = 'READY_FOR_DISPATCH';

      const makeTransferForLeg = (fromId: string, toId: string, legIdx: number, prepareImmediately: boolean) => {
        const trfNum = `TRF-${new Date().getFullYear()}-${String(db.transfers.length + 1).padStart(4, '0')}`;
        const grpId = `grp-${Date.now()}-${legIdx}`;
        const toKind: LocationKind = db.franchisees.some((f) => f.id === toId) ? 'FRANCHISEE' : 'WAREHOUSE';
        const trf: StockTransfer = {
          id: `trf-${Date.now()}-${legIdx}`,
          transferNumber: trfNum,
          sourceWarehouseId: fromId,
          sourceWarehouseName: getLocationName(db, fromId),
          isBulkTrip: false,
          notes: `Order #${order.orderNumber} routing leg ${legIdx}`,
          groups: [
            {
              id: grpId,
              destinationId: toId,
              destinationKind: toKind,
              destinationName: getLocationName(db, toId),
              transportMethod: 'OWN_VEHICLE',
              purpose: 'ORDER_PACKAGES',
              status: prepareImmediately ? 'PREPARED' : 'DRAFT',
              items: items.map((it: any, iIdx: number) => ({
                id: `tli-${Date.now()}-${legIdx}-${iIdx}`,
                productId: it.productId,
                variantId: it.variantId,
                productName: it.productName,
                variantName: it.variantName,
                sku: it.sku,
                requestedQty: it.qty,
                packedQty: it.qty,
                receivedGoodQty: 0,
                receivedDamagedQty: 0,
                orderId: order.id,
                orderNumber: order.orderNumber,
                packageId: `PKG-${order.orderNumber}-${legIdx}-${iIdx + 1}`,
              })),
              receipts: [],
            },
          ],
          createdBy: 'Dispatch Operator',
          createdAt: now,
          updatedAt: now,
        };
        db.transfers.unshift(trf);
        legs.push({
          legIndex: legIdx,
          fromId,
          fromName: getLocationName(db, fromId),
          toId,
          toName: getLocationName(db, toId),
          transportMethod: 'OWN_VEHICLE',
          transferId: trf.id,
          transferNumber: trfNum,
          groupId: grpId,
          status: prepareImmediately ? 'PREPARED' : 'WAITING_FOR_STOCK',
        });
      };

      if (routePattern === 'FRANCHISEE_DIRECT') {
        status = 'READY_FOR_DELIVERY';
      } else if (routePattern === 'WAREHOUSE_TO_FRANCHISEE' && franchiseeId) {
        makeTransferForLeg(sourceLocationId, franchiseeId, 1, true);
        status = 'WAITING_FOR_STOCK';
      } else if (routePattern === 'BRANCH_RELAY' && branchLocationId && franchiseeId) {
        makeTransferForLeg(sourceLocationId, branchLocationId, 1, true);
        makeTransferForLeg(branchLocationId, franchiseeId, 2, false);
        status = 'WAITING_FOR_STOCK';
      } else if (routePattern === 'CARRIER_DIRECT') {
        const carrier = db.carriers.find((c) => c.id === carrierId);
        legs.push({
          legIndex: 1,
          fromId: sourceLocationId,
          fromName: getLocationName(db, sourceLocationId),
          toId: 'CUSTOMER',
          toName: order.shippingAddress?.fullName || 'Customer',
          transportMethod: 'DELIVERY_PARTNER',
          carrierName: carrier?.name || '',
          status: 'READY_FOR_DISPATCH',
        });
        status = 'READY_FOR_DISPATCH';
      }

      const customerOtpCode = generateOtp();
      const existingIdx = db.orderFulfillments.findIndex((f) => f.orderId === orderId);
      const record: OrderFulfillmentRecord = {
        orderId,
        orderNumber: order.orderNumber,
        routePattern,
        sourceLocationId,
        branchLocationId,
        franchiseeId,
        carrierId,
        carrierName: db.carriers.find((c) => c.id === carrierId)?.name,
        status,
        customerOtpCode,
        customerOtpVerified: false,
        failedAttempts: existingIdx >= 0 ? db.orderFulfillments[existingIdx].failedAttempts : [],
        legs,
        updatedAt: now,
      };
      if (existingIdx >= 0) db.orderFulfillments[existingIdx] = record;
      else db.orderFulfillments.unshift(record);

      // Update core order assigned warehouse
      const core = readDb();
      const ord = core.orders.find((o) => o.id === orderId);
      if (ord) {
        ord.assignedWarehouseId = sourceLocationId;
        ord.assignedWarehouseName = getLocationName(db, sourceLocationId);
        ord.status = status === 'READY_FOR_DELIVERY' ? 'PACKED' : 'ALLOCATED';
        ord.updatedAt = now;
        writeDb(core);
      }

      writePortalDb(db);
      return NextResponse.json({ success: true, message: `Route confirmed for Order #${order.orderNumber}.`, fulfillment: record });
    }

    if (action === 'DISPATCH_CARRIER_ORDER') {
      const { orderId, carrierId, awbNumber, generateCourierOtp, otpCode } = body;
      const ful = db.orderFulfillments.find((f) => f.orderId === orderId);
      if (!ful) return NextResponse.json({ success: false, error: 'Order fulfillment not found' }, { status: 404 });
      const carrier = db.carriers.find((c) => c.id === (carrierId || ful.carrierId));

      if (generateCourierOtp) {
        ful.carrierId = carrier?.id || carrierId;
        ful.carrierName = carrier?.name || body.carrierName || 'Delivery Partner';
        ful.awbNumber = awbNumber || `AWB-${Date.now().toString().slice(-8)}`;
        ful.trackingUrl = carrier?.trackingUrlTemplate ? carrier.trackingUrlTemplate.replace('{AWB}', ful.awbNumber || '') : '';
        ful.courierOtpCode = generateOtp();
        ful.updatedAt = now;
        writePortalDb(db);
        return NextResponse.json({ success: true, message: `AWB ${ful.awbNumber} saved & Courier OTP generated.`, courierOtpCode: ful.courierOtpCode });
      }

      if (String(otpCode).trim() !== String(ful.courierOtpCode)) {
        return NextResponse.json({ success: false, error: 'Invalid courier pickup OTP' }, { status: 400 });
      }

      ful.courierOtpVerified = true;
      ful.status = 'IN_TRANSIT';
      ful.updatedAt = now;
      if (ful.legs[0]) {
        ful.legs[0].status = 'IN_TRANSIT';
        ful.legs[0].awbNumber = ful.awbNumber;
        ful.legs[0].carrierName = ful.carrierName;
      }

      // Deduct source stock
      const order = devDb.getOrderWithDetails(orderId);
      for (const it of order?.items || []) {
        const row = getOrCreateStockRow(db, ful.sourceLocationId, 'WAREHOUSE', it.productId, it.variantId || `default-${it.productId}`);
        row.onHand = Math.max(0, row.onHand - it.quantity);
        row.reserved = Math.max(0, row.reserved - it.quantity);
        syncCoreWarehouseStock(ful.sourceLocationId, row.productId, row.variantId, row.onHand, row.reserved);
      }

      const core = readDb();
      const ord = core.orders.find((o) => o.id === orderId);
      if (ord) {
        ord.status = 'IN_TRANSIT';
        ord.courierName = ful.carrierName;
        ord.trackingNumber = ful.awbNumber;
        ord.updatedAt = now;
        writeDb(core);
      }

      writePortalDb(db);
      return NextResponse.json({ success: true, message: `Carrier handover confirmed (${ful.awbNumber}).` });
    }

    if (action === 'MARK_OUT_FOR_DELIVERY') {
      const { orderId, staffId, staffName } = body;
      const ful = db.orderFulfillments.find((f) => f.orderId === orderId);
      if (!ful) return NextResponse.json({ success: false, error: 'Order fulfillment not found' }, { status: 404 });
      ful.status = 'OUT_FOR_DELIVERY';
      ful.assignedDeliveryStaffId = staffId;
      ful.assignedDeliveryStaffName = staffName;
      ful.customerOtpCode = ful.customerOtpCode || generateOtp();
      ful.updatedAt = now;

      const core = readDb();
      const ord = core.orders.find((o) => o.id === orderId);
      if (ord) {
        ord.status = 'OUT_FOR_DELIVERY';
        ord.updatedAt = now;
        writeDb(core);
      }
      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Marked Out for Delivery.', customerOtpCode: ful.customerOtpCode });
    }

    if (action === 'VERIFY_CUSTOMER_OTP') {
      const { orderId, otpCode } = body;
      const ful = db.orderFulfillments.find((f) => f.orderId === orderId);
      if (!ful) return NextResponse.json({ success: false, error: 'Order fulfillment not found' }, { status: 404 });
      if (String(otpCode).trim() !== String(ful.customerOtpCode)) {
        return NextResponse.json({ success: false, error: 'Invalid Customer Delivery OTP' }, { status: 400 });
      }

      ful.customerOtpVerified = true;
      ful.status = 'DELIVERED';
      ful.deliveryReceiptNumber = `DLV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      ful.deliveredAt = now;
      ful.updatedAt = now;

      // Consume reserved stock at franchisee if franchisee delivered
      if (ful.franchiseeId) {
        const order = devDb.getOrderWithDetails(orderId);
        for (const it of order?.items || []) {
          const row = getOrCreateStockRow(db, ful.franchiseeId, 'FRANCHISEE', it.productId, it.variantId || `default-${it.productId}`);
          row.onHand = Math.max(0, row.onHand - it.quantity);
          row.reserved = Math.max(0, row.reserved - it.quantity);
        }
      }

      const core = readDb();
      const ord = core.orders.find((o) => o.id === orderId);
      if (ord) {
        ord.status = 'DELIVERED';
        ord.deliveredAt = now;
        ord.updatedAt = now;
        writeDb(core);
      }

      writePortalDb(db);
      return NextResponse.json({
        success: true,
        message: `Customer OTP verified. Final receipt ${ful.deliveryReceiptNumber} created.`,
      });
    }

    if (action === 'RECORD_FAILED_DELIVERY') {
      const { orderId, reason, followUpAction, recordedBy } = body;
      const ful = db.orderFulfillments.find((f) => f.orderId === orderId);
      if (!ful) return NextResponse.json({ success: false, error: 'Order fulfillment not found' }, { status: 404 });

      ful.failedAttempts.push({
        id: `fail-${Date.now()}`,
        reason: reason || 'Customer unavailable / OTP failed',
        action: followUpAction || 'RETRY',
        recordedBy: recordedBy || 'Delivery Staff',
        createdAt: now,
      });
      ful.status = followUpAction === 'RETRY' ? 'READY_FOR_DELIVERY' : 'FAILED_ATTEMPT';
      if (followUpAction === 'RETRY') ful.customerOtpCode = generateOtp();
      ful.updatedAt = now;

      db.exceptions.unshift({
        id: `ex-dlv-${Date.now()}`,
        type: 'DELIVERY_FAILED',
        title: `Failed Delivery Attempt on Order #${ful.orderNumber}`,
        description: `${reason || 'OTP verification failed'} (Action: ${followUpAction || 'RETRY'})`,
        orderId: ful.orderId,
        orderNumber: ful.orderNumber,
        locationId: ful.franchiseeId || ful.sourceLocationId,
        currentHolder: ful.assignedDeliveryStaffName || getLocationName(db, ful.franchiseeId || ful.sourceLocationId),
        status: 'OPEN',
        createdAt: now,
        updatedAt: now,
      });

      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Failed delivery attempt recorded.' });
    }

    if (action === 'CANCEL_ORDER_FULFILLMENT') {
      const { orderId, reason } = body;
      const ful = db.orderFulfillments.find((f) => f.orderId === orderId);
      const order = devDb.getOrderWithDetails(orderId);
      if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

      const prePickup = !ful || ['UNALLOCATED', 'ALLOCATION_REVIEW', 'WAITING_FOR_STOCK', 'READY_FOR_DISPATCH'].includes(ful.status);
      if (ful) {
        if (prePickup) {
          // Release reserved stock at source
          for (const it of order.items || []) {
            const row = getOrCreateStockRow(
              db,
              ful.sourceLocationId,
              db.franchisees.some((f) => f.id === ful.sourceLocationId) ? 'FRANCHISEE' : 'WAREHOUSE',
              it.productId,
              it.variantId || `default-${it.productId}`
            );
            row.reserved = Math.max(0, row.reserved - it.quantity);
            syncCoreWarehouseStock(ful.sourceLocationId, row.productId, row.variantId, row.onHand, row.reserved);
          }
          // Cancel unpicked transfer groups
          for (const leg of ful.legs) {
            if (leg.transferId && leg.groupId) {
              const trf = db.transfers.find((t) => t.id === leg.transferId);
              const grp = trf?.groups.find((g) => g.id === leg.groupId);
              if (grp && (grp.status === 'DRAFT' || grp.status === 'PREPARED')) grp.status = 'CANCELLED';
            }
          }
        } else {
          // Post pickup: create return recovery exception
          db.exceptions.unshift({
            id: `ex-ret-${Date.now()}`,
            type: 'CANCELLED_RETURN',
            title: `Post-Pickup Cancellation Recovery (#${order.orderNumber})`,
            description: `Order cancelled after pickup (${reason || 'Customer cancelled'}). Keep parcel out of available stock until inspected return is posted.`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            locationId: ful.franchiseeId || ful.sourceLocationId,
            currentHolder: ful.assignedDeliveryStaffName || 'In Transit / Driver',
            status: 'OPEN',
            createdAt: now,
            updatedAt: now,
          });
        }
        ful.status = 'CANCELLED';
        ful.updatedAt = now;
      }

      const core = readDb();
      const ord = core.orders.find((o) => o.id === orderId);
      if (ord) {
        ord.status = 'CANCELLED';
        ord.updatedAt = now;
        writeDb(core);
      }

      writePortalDb(db);
      return NextResponse.json({
        success: true,
        message: prePickup
          ? 'Order cancelled before pickup and reserved stock released.'
          : 'Order cancelled after pickup. Return recovery case opened in Exceptions.',
      });
    }

    // -------------------------------------------------------------------------
    // 9. EXCEPTIONS & RETURNS
    // -------------------------------------------------------------------------
    if (action === 'RESOLVE_EXCEPTION') {
      const { exceptionId, resolutionNote, restockLocationId } = body;
      const ex = db.exceptions.find((e) => e.id === exceptionId);
      if (!ex) return NextResponse.json({ success: false, error: 'Exception not found' }, { status: 404 });

      ex.status = 'RESOLVED';
      ex.resolutionNote = resolutionNote || 'Resolved by manager';
      ex.updatedAt = now;

      if (ex.type === 'CANCELLED_RETURN' && ex.orderId && restockLocationId) {
        const order = devDb.getOrderWithDetails(ex.orderId);
        const kind: LocationKind = db.franchisees.some((f) => f.id === restockLocationId) ? 'FRANCHISEE' : 'WAREHOUSE';
        for (const it of order?.items || []) {
          const row = getOrCreateStockRow(db, restockLocationId, kind, it.productId, it.variantId || `default-${it.productId}`);
          row.onHand += it.quantity;
          row.updatedAt = now;
          if (kind === 'WAREHOUSE') {
            syncCoreWarehouseStock(restockLocationId, row.productId, row.variantId, row.onHand, row.reserved);
          }
          db.adjustmentLogs.unshift({
            id: `adj-ret-${Date.now()}-${it.id}`,
            locationId: restockLocationId,
            productId: row.productId,
            variantId: row.variantId,
            productName: it.productName,
            variantName: it.variantName || 'Standard',
            delta: it.quantity,
            type: 'RETURN_INSPECT',
            reason: `Inspected return restocked from cancelled Order #${ex.orderNumber}`,
            referenceId: ex.orderNumber,
            performedBy: 'Warehouse Manager',
            createdAt: now,
          });
        }
      }

      writePortalDb(db);
      return NextResponse.json({ success: true, message: 'Exception marked resolved.' });
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
