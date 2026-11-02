import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';

export interface PortalConfig {
  id: 'warehouse' | 'procurement' | 'sales' | 'repairs' | 'finance' | 'storefront';
  title: string;
  subtitle: string;
  badge: string;
  href: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'READ_ONLY';
  managerName: string;
  managerPhone: string;
  activeHub: string;
  announcementBanner: string;
  allowEdits: boolean;
  autoSyncFrontend: boolean;
  updatedAt: string;
}

const DEFAULT_PORTAL_CONFIGS: PortalConfig[] = [
  {
    id: 'warehouse',
    title: 'Dark Warehouse & Stock Fulfillment',
    subtitle: 'Multi-hub inventory ledger, proximity allocation, packing slips, and carrier dispatch.',
    badge: 'Operations Hub',
    href: '/warehouse',
    status: 'ACTIVE',
    managerName: 'Ramesh Kulkarni (Chief Logistics Officer)',
    managerPhone: '+91 98450 11223',
    activeHub: 'Hubballi Central Dark Warehouse (DWH-HBX-01)',
    announcementBanner: 'All dark warehouse dispatches are synced with Admin Catalogue & Storefront stock.',
    allowEdits: true,
    autoSyncFrontend: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'procurement',
    title: 'Procurement & Agronomy Tracker',
    subtitle: '7-stage farmer crop cycles, input logs, and scheduled agronomist follow-up advisory.',
    badge: 'Agronomy Desk',
    href: '/procurement',
    status: 'ACTIVE',
    managerName: 'Dr. Anand Nadagouda (Lead Agronomist)',
    managerPhone: '+91 98450 22334',
    activeHub: 'Dharwad Agronomy Research & Advisory Cell',
    announcementBanner: 'Kharif & Rabi crop stage advisories controlled by Super Admin.',
    allowEdits: true,
    autoSyncFrontend: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sales',
    title: 'Field Sales CRM & Farm Visits',
    subtitle: '8-stage lead pipeline, sales quotas, quotation generator, and GPS farm visit records.',
    badge: 'Sales CRM',
    href: '/sales',
    status: 'ACTIVE',
    managerName: 'Sunil Kumar (State Field Sales Head)',
    managerPhone: '+91 98450 33445',
    activeHub: 'Mandya & North Karnataka Field Sales Division',
    announcementBanner: 'Field visit GPS logs and monthly executive targets managed via Admin Control.',
    allowEdits: true,
    autoSyncFrontend: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'repairs',
    title: 'Workshop Repairs & Services',
    subtitle: '9-stage job card workflow, multi-complaint intake, spare parts debit, QC sign-off, and GST tax invoice.',
    badge: 'Service Workshop',
    href: '/repairs',
    status: 'ACTIVE',
    managerName: 'S. Kulkarni (Chief Workshop Engineer)',
    managerPhone: '+91 98450 44556',
    activeHub: 'Hubballi Central Agri Workshop',
    announcementBanner: 'Job cards, spare parts pricing, labour rates & warranty claims under Admin supervision.',
    allowEdits: true,
    autoSyncFrontend: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'finance',
    title: 'Finance Incentive & Commission Portal',
    subtitle: 'Dealer commission tiers, net delivered sales reconciliation, return clawbacks, and payout vouchers.',
    badge: 'Finance Desk',
    href: '/finance',
    status: 'ACTIVE',
    managerName: 'R. Vernekar (Finance Controller)',
    managerPhone: '+91 98450 55667',
    activeHub: 'GreenShield Corporate Treasury — Bengaluru / Hubballi',
    announcementBanner: 'Dealer commission tiers, targets, and payout vouchers controlled by Admin.',
    allowEdits: true,
    autoSyncFrontend: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'storefront',
    title: 'Customer Storefront Website',
    subtitle: 'Live customer e-commerce storefront, catalogue, crop advisory, rentals, and checkout.',
    badge: 'Live Storefront',
    href: 'http://localhost:3010',
    status: 'ACTIVE',
    managerName: 'Super Admin Digital Commerce Team',
    managerPhone: '+91 98450 99000',
    activeHub: 'Port 3010 — Public Web Storefront',
    announcementBanner: 'Real-time catalogue, INR pricing, and inventory revalidation active.',
    allowEdits: true,
    autoSyncFrontend: true,
    updatedAt: new Date().toISOString(),
  },
];

function getPortalConfigsFromDb(): PortalConfig[] {
  const raw = devDb.getRawData();
  if (!raw.portalConfigs || !Array.isArray(raw.portalConfigs) || raw.portalConfigs.length === 0) {
    raw.portalConfigs = DEFAULT_PORTAL_CONFIGS;
    devDb.save();
  }
  return raw.portalConfigs;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const portalId = searchParams.get('portalId');

    const portalConfigs = getPortalConfigsFromDb();
    if (portalId) {
      const config = portalConfigs.find((p) => p.id === portalId) || DEFAULT_PORTAL_CONFIGS[0];
      return NextResponse.json({ success: true, config });
    }

    const raw = devDb.getRawData();
    const warehouses = devDb.getWarehouses();
    const products = devDb.getProducts();
    const orders = devDb.getOrders().map((o) => devDb.getOrderWithDetails(o.id));
    const farmerProfiles = devDb.getFarmerProfiles();
    const followUps = devDb.getAgronomyFollowUps();
    const usageLogs = devDb.getProductUsageLogs();
    const salesLeads = devDb.getSalesLeads();
    const salesVisits = devDb.getSalesVisits();
    const salesTargets = devDb.getSalesTargets();
    const jobCards = devDb.getJobCards();
    const spareParts = devDb.getSpareParts();
    const labourCatalogue = devDb.getLabourCatalogue();
    const warrantyClaims = devDb.getWarrantyClaims();
    const dealers = devDb.getDealerProfiles();
    const commissionTargets = devDb.calculateDealerCommissions('2026-03');
    const payoutRecords = devDb.getPayoutRecords();

    // Build warehouse inventory summary
    const warehouseStocks = raw.warehouseStocks || [];

    return NextResponse.json({
      success: true,
      portalConfigs,
      summary: {
        warehouse: {
          totalHubs: warehouses.length,
          activeHubs: warehouses.filter((w) => w.isActive).length,
          totalOrders: orders.length,
          totalStockRecords: warehouseStocks.length,
        },
        procurement: {
          totalFarmers: farmerProfiles.length,
          pendingFollowUps: followUps.filter((f) => f.status === 'SCHEDULED' || f.status === 'OVERDUE').length,
          totalUsageLogs: usageLogs.length,
        },
        sales: {
          totalLeads: salesLeads.length,
          convertedLeads: salesLeads.filter((l) => l.stage === 'CONVERTED').length,
          totalVisits: salesVisits.length,
          totalExecutives: salesTargets.length,
        },
        repairs: {
          totalJobCards: jobCards.length,
          activeJobCards: jobCards.filter((j) => j.status !== 'DELIVERED').length,
          totalSpareParts: spareParts.length,
          totalLabourOps: labourCatalogue.length,
          totalWarrantyClaims: warrantyClaims.length,
        },
        finance: {
          totalDealers: dealers.length,
          totalPendingPayouts: dealers.reduce((s, d) => s + (d.pendingPayoutBalance || 0), 0),
          totalVouchers: payoutRecords.length,
        },
        storefront: {
          totalProducts: products.length,
          publishedProducts: products.filter((p) => p.isPublished).length,
        },
      },
      data: {
        warehouses,
        warehouseStocks,
        orders: orders.slice(0, 50),
        farmerProfiles,
        followUps,
        usageLogs,
        salesLeads,
        salesVisits,
        salesTargets,
        jobCards,
        spareParts,
        labourCatalogue,
        warrantyClaims,
        dealers,
        commissionTargets,
        payoutRecords,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { panel, action, payload } = body;
    const raw = devDb.getRawData();
    const now = new Date().toISOString();

    // 1. PORTAL CONFIG CONTROL
    if (panel === 'PORTAL_CONFIG') {
      const configs = getPortalConfigsFromDb();
      const idx = configs.findIndex((c) => c.id === payload.id);
      if (idx >= 0) {
        configs[idx] = { ...configs[idx], ...payload, updatedAt: now };
      } else {
        configs.push({ ...payload, updatedAt: now });
      }
      raw.portalConfigs = configs;
      devDb.save();
      return NextResponse.json({
        success: true,
        config: configs[idx >= 0 ? idx : configs.length - 1],
        message: `Portal "${payload.title || payload.id}" configuration saved and synced.`,
      });
    }

    // 2. WAREHOUSE PANEL CONTROLS
    if (panel === 'WAREHOUSE') {
      if (action === 'SAVE_WAREHOUSE') {
        if (!raw.warehouses) raw.warehouses = [];
        const idx = raw.warehouses.findIndex((w: any) => w.id === payload.id);
        if (idx >= 0) {
          raw.warehouses[idx] = { ...raw.warehouses[idx], ...payload };
        } else {
          raw.warehouses.push({
            id: payload.id || `wh-${Date.now()}`,
            name: payload.name || 'New Warehouse Hub',
            code: payload.code || `DWH-${Date.now().toString().slice(-4)}`,
            latitude: Number(payload.latitude) || 15.3647,
            longitude: Number(payload.longitude) || 75.124,
            serviceRadiusKm: Number(payload.serviceRadiusKm) || 120,
            servicedPincodes: payload.servicedPincodes || '580001, 580020, 580030',
            address: payload.address || 'Industrial Area, Karnataka',
            managerName: payload.managerName || 'Hub Manager',
            contactNumber: payload.contactNumber || '+91 98450 00000',
            isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
            createdAt: now,
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, warehouses: raw.warehouses, message: 'Warehouse hub saved.' });
      }

      if (action === 'DELETE_WAREHOUSE') {
        raw.warehouses = (raw.warehouses || []).filter((w: any) => w.id !== payload.id);
        devDb.save();
        return NextResponse.json({ success: true, message: 'Warehouse deleted.' });
      }

      if (action === 'UPDATE_STOCK') {
        const { warehouseId, productId, quantity, reservedQuantity, reorderThreshold } = payload;
        if (!raw.warehouseStocks) raw.warehouseStocks = [];
        const idx = raw.warehouseStocks.findIndex(
          (s: any) => s.warehouseId === warehouseId && s.productId === productId
        );
        if (idx >= 0) {
          raw.warehouseStocks[idx] = {
            ...raw.warehouseStocks[idx],
            quantity: Number(quantity),
            reservedQuantity: reservedQuantity !== undefined ? Number(reservedQuantity) : raw.warehouseStocks[idx].reservedQuantity,
            reorderThreshold: reorderThreshold !== undefined ? Number(reorderThreshold) : raw.warehouseStocks[idx].reorderThreshold,
          };
        } else {
          raw.warehouseStocks.push({
            id: `ws-${Date.now()}`,
            warehouseId,
            productId,
            quantity: Number(quantity),
            reservedQuantity: Number(reservedQuantity) || 0,
            reorderThreshold: Number(reorderThreshold) || 5,
          });
        }
        // Also sync variant stock quantity if needed
        const variants = (raw.productVariants || []).filter((v: any) => v.productId === productId);
        if (variants.length > 0) {
          const totalAcrossHubs = raw.warehouseStocks
            .filter((s: any) => s.productId === productId)
            .reduce((sum: number, s: any) => sum + Number(s.quantity || 0), 0);
          variants[0].stockQuantity = totalAcrossHubs;
        }
        devDb.save();
        try {
          await revalidateFrontendPath('/shop');
          await revalidateFrontendPath('/');
        } catch {}
        return NextResponse.json({ success: true, message: 'Warehouse inventory updated & synced with Storefront.' });
      }

      if (action === 'UPDATE_ORDER') {
        const { orderId, status, paymentStatus, assignedWarehouseId, courierName, trackingNumber } = payload;
        const ord = (raw.orders || []).find((o: any) => o.id === orderId);
        if (!ord) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        if (status) ord.status = status;
        if (paymentStatus) ord.paymentStatus = paymentStatus;
        if (assignedWarehouseId) {
          ord.assignedWarehouseId = assignedWarehouseId;
          const wh = (raw.warehouses || []).find((w: any) => w.id === assignedWarehouseId);
          if (wh) ord.assignedWarehouseName = wh.name;
        }
        if (courierName !== undefined) ord.courierName = courierName;
        if (trackingNumber !== undefined) ord.trackingNumber = trackingNumber;
        ord.updatedAt = now;
        devDb.save();
        return NextResponse.json({ success: true, order: ord, message: 'Warehouse order updated.' });
      }
    }

    // 3. PROCUREMENT & AGRONOMY PANEL CONTROLS
    if (panel === 'PROCUREMENT') {
      if (action === 'SAVE_FARMER') {
        if (!raw.farmerProfiles) raw.farmerProfiles = [];
        const idx = raw.farmerProfiles.findIndex((f: any) => f.id === payload.id);
        const primaryCrops = Array.isArray(payload.primaryCrops)
          ? payload.primaryCrops
          : typeof payload.primaryCrops === 'string'
          ? payload.primaryCrops.split(',').map((s: string) => s.trim()).filter(Boolean)
          : ['Paddy', 'Sugarcane'];

        if (idx >= 0) {
          raw.farmerProfiles[idx] = {
            ...raw.farmerProfiles[idx],
            ...payload,
            totalAcreage: Number(payload.totalAcreage) || raw.farmerProfiles[idx].totalAcreage,
            totalSpend: payload.totalSpend !== undefined ? Number(payload.totalSpend) : raw.farmerProfiles[idx].totalSpend,
            primaryCrops,
          };
        } else {
          raw.farmerProfiles.unshift({
            id: payload.id || `frm-${Date.now()}`,
            farmerName: payload.farmerName || 'New Farmer',
            mobile: payload.mobile || '+91 98450 00000',
            village: payload.village || 'Hubballi Rural',
            taluk: payload.taluk || 'Hubballi',
            district: payload.district || 'Dharwad',
            totalAcreage: Number(payload.totalAcreage) || 5,
            soilType: payload.soilType || 'Black Cotton Soil',
            primaryCrops,
            currentCropStage: payload.currentCropStage || 'LAND_PREPARATION',
            sowingDate: payload.sowingDate || now.split('T')[0],
            expectedHarvestDate: payload.expectedHarvestDate || '2026-12-15',
            totalSpend: Number(payload.totalSpend) || 0,
            successfulOrdersCount: Number(payload.successfulOrdersCount) || 0,
            assignedAgronomist: payload.assignedAgronomist || 'Dr. Anand Nadagouda',
            notes: payload.notes || '',
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, profiles: raw.farmerProfiles, message: 'Farmer profile saved.' });
      }

      if (action === 'DELETE_FARMER') {
        raw.farmerProfiles = (raw.farmerProfiles || []).filter((f: any) => f.id !== payload.id);
        devDb.save();
        return NextResponse.json({ success: true, message: 'Farmer profile deleted.' });
      }

      if (action === 'SAVE_FOLLOWUP') {
        if (!raw.agronomyFollowUps) raw.agronomyFollowUps = [];
        const idx = raw.agronomyFollowUps.findIndex((f: any) => f.id === payload.id);
        if (idx >= 0) {
          raw.agronomyFollowUps[idx] = { ...raw.agronomyFollowUps[idx], ...payload };
        } else {
          raw.agronomyFollowUps.unshift({
            id: payload.id || `fup-${Date.now()}`,
            farmerProfileId: payload.farmerProfileId || (raw.farmerProfiles?.[0]?.id ?? 'frm-01'),
            farmerName: payload.farmerName || 'Farmer',
            mobile: payload.mobile || '+91 98450 00000',
            crop: payload.crop || 'Paddy',
            cropStage: payload.cropStage || 'GERMINATION',
            scheduledDate: payload.scheduledDate || now.split('T')[0],
            purpose: payload.purpose || 'Scheduled Crop Stage Advisory',
            status: payload.status || 'SCHEDULED',
            agronomistNotes: payload.agronomistNotes || '',
            assignedAgronomist: payload.assignedAgronomist || 'Dr. Anand Nadagouda',
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, followUps: raw.agronomyFollowUps, message: 'Agronomy follow-up saved.' });
      }

      if (action === 'DELETE_FOLLOWUP') {
        raw.agronomyFollowUps = (raw.agronomyFollowUps || []).filter((f: any) => f.id !== payload.id);
        devDb.save();
        return NextResponse.json({ success: true, message: 'Follow-up deleted.' });
      }

      if (action === 'SAVE_USAGE_LOG') {
        if (!raw.productUsageLogs) raw.productUsageLogs = [];
        const idx = raw.productUsageLogs.findIndex((u: any) => u.id === payload.id);
        if (idx >= 0) {
          raw.productUsageLogs[idx] = { ...raw.productUsageLogs[idx], ...payload };
        } else {
          raw.productUsageLogs.unshift({
            id: payload.id || `ulog-${Date.now()}`,
            farmerProfileId: payload.farmerProfileId || (raw.farmerProfiles?.[0]?.id ?? 'frm-01'),
            productName: payload.productName || 'Agri Input Product',
            crop: payload.crop || 'Paddy',
            quantityUsed: payload.quantityUsed || '2 Litres / Acre',
            appliedDate: payload.appliedDate || now.split('T')[0],
            season: payload.season || 'Kharif 2026',
            notes: payload.notes || '',
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, usageLogs: raw.productUsageLogs, message: 'Product usage log saved.' });
      }
    }

    // 4. FIELD SALES CRM PANEL CONTROLS
    if (panel === 'SALES') {
      if (action === 'SAVE_LEAD') {
        if (!raw.salesLeads) raw.salesLeads = [];
        const idx = raw.salesLeads.findIndex((l: any) => l.id === payload.id);
        if (idx >= 0) {
          raw.salesLeads[idx] = {
            ...raw.salesLeads[idx],
            ...payload,
            estimatedValue: Number(payload.estimatedValue) || raw.salesLeads[idx].estimatedValue,
          };
        } else {
          raw.salesLeads.unshift({
            id: payload.id || `lead-${Date.now()}`,
            leadNumber: payload.leadNumber || `SL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            customerName: payload.customerName || 'New Prospect',
            mobile: payload.mobile || '+91 98450 00000',
            village: payload.village || 'Mandya Rural',
            taluk: payload.taluk || 'Mandya',
            district: payload.district || 'Mandya',
            leadSource: payload.leadSource || 'ADMIN_DIRECT',
            interestedCategory: payload.interestedCategory || 'Farm Machinery',
            interestedProductTitle: payload.interestedProductTitle || '7HP Power Weeder',
            estimatedValue: Number(payload.estimatedValue) || 35000,
            stage: payload.stage || 'NEW',
            assignedExecutiveId: payload.assignedExecutiveId || 'exec-01',
            assignedExecutiveName: payload.assignedExecutiveName || 'Sunil Kumar (Mandya Belt)',
            nextFollowUpDate: payload.nextFollowUpDate || now.split('T')[0],
            remarks: payload.remarks || 'Created by Admin',
            communicationLog: [
              { type: 'ADMIN_ENTRY', note: payload.remarks || 'Created via Admin Control Panel', timestamp: now },
            ],
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, leads: raw.salesLeads, message: 'Sales lead saved.' });
      }

      if (action === 'DELETE_LEAD') {
        raw.salesLeads = (raw.salesLeads || []).filter((l: any) => l.id !== payload.id);
        devDb.save();
        return NextResponse.json({ success: true, message: 'Sales lead deleted.' });
      }

      if (action === 'SAVE_TARGET') {
        if (!raw.salesTargets) raw.salesTargets = [];
        const idx = raw.salesTargets.findIndex((t: any) => t.executiveId === payload.executiveId);
        if (idx >= 0) {
          raw.salesTargets[idx] = {
            ...raw.salesTargets[idx],
            ...payload,
            targetAmount: Number(payload.targetAmount),
            achievedAmount: Number(payload.achievedAmount),
            leadsTarget: Number(payload.leadsTarget),
            leadsConverted: Number(payload.leadsConverted),
          };
        } else {
          raw.salesTargets.push({
            executiveId: payload.executiveId || `exec-${Date.now()}`,
            executiveName: payload.executiveName || 'Field Executive',
            month: payload.month || '2026-10',
            targetAmount: Number(payload.targetAmount) || 500000,
            achievedAmount: Number(payload.achievedAmount) || 0,
            leadsTarget: Number(payload.leadsTarget) || 50,
            leadsConverted: Number(payload.leadsConverted) || 0,
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, targets: raw.salesTargets, message: 'Sales target saved.' });
      }

      if (action === 'SAVE_VISIT') {
        if (!raw.salesVisits) raw.salesVisits = [];
        const idx = raw.salesVisits.findIndex((v: any) => v.id === payload.id);
        if (idx >= 0) {
          raw.salesVisits[idx] = {
            ...raw.salesVisits[idx],
            ...payload,
            gpsLatitude: Number(payload.gpsLatitude) || raw.salesVisits[idx].gpsLatitude,
            gpsLongitude: Number(payload.gpsLongitude) || raw.salesVisits[idx].gpsLongitude,
            acreage: Number(payload.acreage) || raw.salesVisits[idx].acreage,
          };
        } else {
          raw.salesVisits.unshift({
            id: payload.id || `vis-${Date.now()}`,
            leadId: payload.leadId || 'lead-01',
            leadNumber: payload.leadNumber || 'SL-2026-0101',
            farmerName: payload.farmerName || 'Farmer',
            executiveId: payload.executiveId || 'exec-01',
            executiveName: payload.executiveName || 'Sunil Kumar',
            visitDate: payload.visitDate || now.split('T')[0],
            gpsLatitude: Number(payload.gpsLatitude) || 12.5218,
            gpsLongitude: Number(payload.gpsLongitude) || 76.8951,
            cropObserved: payload.cropObserved || 'Sugarcane',
            acreage: Number(payload.acreage) || 5,
            visitSummary: payload.visitSummary || 'Farm visit logged',
            outcome: payload.outcome || 'PROPOSAL_SUBMITTED',
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, visits: raw.salesVisits, message: 'Sales visit record saved.' });
      }
    }

    // 5. WORKSHOP & REPAIRS PANEL CONTROLS
    if (panel === 'REPAIRS') {
      if (action === 'SAVE_JOB_CARD') {
        if (!raw.jobCards) raw.jobCards = [];
        const idx = raw.jobCards.findIndex((j: any) => j.id === payload.id);
        if (idx >= 0) {
          raw.jobCards[idx] = {
            ...raw.jobCards[idx],
            ...payload,
            updatedAt: now,
          };
          devDb.save();
          return NextResponse.json({ success: true, jobCard: raw.jobCards[idx], message: 'Job card updated.' });
        } else {
          const newJc = devDb.createJobCard({
            customerName: payload.customerName || 'Walk-in Farmer',
            customerMobile: payload.customerMobile || '+91 98450 00000',
            customerVillage: payload.customerVillage || 'Hubballi',
            equipmentModel: payload.equipmentModel || 'AgriPro 7HP Power Weeder',
            serialNumber: payload.serialNumber || `SN-${Date.now().toString().slice(-6)}`,
            category: payload.category || 'Power Weeder',
            warrantyStatus: payload.warrantyStatus || 'IN_WARRANTY',
            complaintText: payload.complaintText || 'General service & inspection',
          });
          return NextResponse.json({ success: true, jobCard: newJc, message: 'Job card created.' });
        }
      }

      if (action === 'DELETE_JOB_CARD') {
        raw.jobCards = (raw.jobCards || []).filter((j: any) => j.id !== payload.id);
        devDb.save();
        return NextResponse.json({ success: true, message: 'Job card deleted.' });
      }

      if (action === 'SAVE_SPARE_PART') {
        if (!raw.spareParts) raw.spareParts = [];
        const idx = raw.spareParts.findIndex((p: any) => p.id === payload.id);
        if (idx >= 0) {
          raw.spareParts[idx] = {
            ...raw.spareParts[idx],
            ...payload,
            unitPrice: Number(payload.unitPrice),
            stockQuantity: Number(payload.stockQuantity),
            reorderLevel: Number(payload.reorderLevel ?? raw.spareParts[idx].reorderLevel ?? 5),
          };
        } else {
          raw.spareParts.push({
            id: payload.id || `sp-${Date.now()}`,
            partNumber: payload.partNumber || `SP-${Date.now().toString().slice(-4)}`,
            name: payload.name || 'New Spare Part',
            category: payload.category || 'Engine Components',
            compatibleModels: payload.compatibleModels || ['All 7HP Weeders'],
            unitPrice: Number(payload.unitPrice) || 450,
            gstRate: Number(payload.gstRate) || 18,
            stockQuantity: Number(payload.stockQuantity) || 20,
            reorderLevel: Number(payload.reorderLevel) || 5,
            locationRack: payload.locationRack || 'Rack A-1',
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, spareParts: raw.spareParts, message: 'Spare part saved.' });
      }

      if (action === 'DELETE_SPARE_PART') {
        raw.spareParts = (raw.spareParts || []).filter((p: any) => p.id !== payload.id);
        devDb.save();
        return NextResponse.json({ success: true, message: 'Spare part deleted.' });
      }

      if (action === 'SAVE_LABOUR') {
        if (!raw.labourCatalogue) raw.labourCatalogue = [];
        const idx = raw.labourCatalogue.findIndex((l: any) => l.id === payload.id);
        if (idx >= 0) {
          const standardHours = Number(payload.standardHours) || raw.labourCatalogue[idx].standardHours;
          const baseRatePerHour = Number(payload.baseRatePerHour) || raw.labourCatalogue[idx].baseRatePerHour;
          raw.labourCatalogue[idx] = {
            ...raw.labourCatalogue[idx],
            ...payload,
            standardHours,
            baseRatePerHour,
            totalStandardCharge: Math.round(standardHours * baseRatePerHour),
          };
        } else {
          const standardHours = Number(payload.standardHours) || 1.5;
          const baseRatePerHour = Number(payload.baseRatePerHour) || 350;
          raw.labourCatalogue.push({
            id: payload.id || `lab-${Date.now()}`,
            code: payload.code || `LAB-${Date.now().toString().slice(-3)}`,
            name: payload.name || 'New Service Operation',
            category: payload.category || 'Engine Overhaul',
            standardHours,
            baseRatePerHour,
            totalStandardCharge: Math.round(standardHours * baseRatePerHour),
            gstRate: 18,
          });
        }
        devDb.save();
        return NextResponse.json({ success: true, labourCatalogue: raw.labourCatalogue, message: 'Labour operation saved.' });
      }

      if (action === 'SAVE_WARRANTY') {
        if (!raw.warrantyClaims) raw.warrantyClaims = [];
        const idx = raw.warrantyClaims.findIndex((w: any) => w.id === payload.id);
        if (idx >= 0) {
          raw.warrantyClaims[idx] = {
            ...raw.warrantyClaims[idx],
            ...payload,
            claimAmount: Number(payload.claimAmount ?? raw.warrantyClaims[idx].claimAmount),
          };
          devDb.save();
        }
        return NextResponse.json({ success: true, warrantyClaims: raw.warrantyClaims, message: 'Warranty claim updated.' });
      }
    }

    // 6. FINANCE & DEALERS PANEL CONTROLS
    if (panel === 'FINANCE') {
      if (action === 'SAVE_DEALER') {
        if (!raw.dealerProfiles) raw.dealerProfiles = [];
        const idx = raw.dealerProfiles.findIndex((d: any) => d.id === payload.id);
        if (idx >= 0) {
          raw.dealerProfiles[idx] = {
            ...raw.dealerProfiles[idx],
            ...payload,
            monthlyTarget: Number(payload.monthlyTarget ?? raw.dealerProfiles[idx].monthlyTarget),
            mtdGrossSales: Number(payload.mtdGrossSales ?? raw.dealerProfiles[idx].mtdGrossSales),
            mtdDeliveredSales: Number(payload.mtdDeliveredSales ?? raw.dealerProfiles[idx].mtdDeliveredSales),
            baseCommissionRate: Number(payload.baseCommissionRate ?? raw.dealerProfiles[idx].baseCommissionRate),
            targetBonusRate: Number(payload.targetBonusRate ?? raw.dealerProfiles[idx].targetBonusRate),
            pendingPayoutBalance: Number(payload.pendingPayoutBalance ?? raw.dealerProfiles[idx].pendingPayoutBalance),
            updatedAt: now,
          };
        } else {
          raw.dealerProfiles.push({
            id: payload.id || `dlr-${Date.now()}`,
            dealerCode: payload.dealerCode || `DLR-KA-${Math.floor(100 + Math.random() * 900)}`,
            businessName: payload.businessName || 'New Agri Dealer Kendra',
            contactPerson: payload.contactPerson || 'Dealer Principal',
            mobile: payload.mobile || '+91 98450 00000',
            email: payload.email || 'dealer@agrimart.in',
            district: payload.district || 'Hubballi',
            taluk: payload.taluk || 'Hubballi',
            gstin: payload.gstin || '29AAAAA0000A1Z5',
            tier: payload.tier || 'GOLD',
            baseCommissionRate: Number(payload.baseCommissionRate) || 8.0,
            targetBonusRate: Number(payload.targetBonusRate) || 2.0,
            monthlyTarget: Number(payload.monthlyTarget) || 500000,
            mtdGrossSales: Number(payload.mtdGrossSales) || 0,
            mtdDeliveredSales: Number(payload.mtdDeliveredSales) || 0,
            mtdReturnsAndCancellations: 0,
            earnedBaseCommission: 0,
            earnedTargetBonus: 0,
            clawbackDeductions: 0,
            totalEarnedCommission: 0,
            pendingPayoutBalance: Number(payload.pendingPayoutBalance) || 0,
            disbursedLifetime: 0,
            status: payload.status || 'ACTIVE',
            joinedAt: now.split('T')[0],
            updatedAt: now,
          });
        }
        devDb.calculateDealerCommissions('2026-03');
        devDb.save();
        return NextResponse.json({ success: true, dealers: raw.dealerProfiles, message: 'Dealer profile saved & commissions recalculated.' });
      }

      if (action === 'DELETE_DEALER') {
        raw.dealerProfiles = (raw.dealerProfiles || []).filter((d: any) => d.id !== payload.id);
        devDb.save();
        return NextResponse.json({ success: true, message: 'Dealer deleted.' });
      }

      if (action === 'SAVE_PAYOUT') {
        if (!raw.payoutRecords) raw.payoutRecords = [];
        const idx = raw.payoutRecords.findIndex((p: any) => p.id === payload.id);
        if (idx >= 0) {
          raw.payoutRecords[idx] = {
            ...raw.payoutRecords[idx],
            ...payload,
            amount: Number(payload.amount ?? raw.payoutRecords[idx].amount),
          };
          devDb.save();
        }
        return NextResponse.json({ success: true, payoutRecords: raw.payoutRecords, message: 'Payout voucher updated.' });
      }
    }

    return NextResponse.json({ success: false, error: `Unknown panel (${panel}) or action (${action})` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
