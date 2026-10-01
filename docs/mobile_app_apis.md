# AGRI MART MEGA — Future Native Mobile Applications API Specifications

This specification documents the REST/OpenAPI contracts required for the future native mobile applications:
1. **Technician & Service Advisor App** (Workshop repair execution, offline checklists, photo uploads, bay time-tracking)
2. **Dealer Mobile App** (Sales targets, commission ledger, warranty claims, equipment registration)
3. **Customer / Farmer App** (Equipment registry, repair request booking, live 9-stage tracking, estimate approval, invoice download)

All mobile API endpoints use JSON payloads, Bearer Token (`Authorization: Bearer <jwt_token>`), and idempotent client mutation headers (`X-Idempotency-Key`).

---

## 1. Technician & Service Advisor Mobile App APIs

### `GET /api/v1/mobile/technician/jobs`
- **Purpose**: Fetch all job cards assigned to the authenticated technician or active workshop bay.
- **Headers**: `Authorization: Bearer <tech_token>`
- **Query Parameters**:
  - `status`: Filter by stage (`PRODUCT_RECEIVED`, `INSPECTION`, `REPAIR`, `QUALITY_CHECK`)
  - `bayNumber`: Filter by specific service station
- **Response**:
```json
{
  "success": true,
  "assignedJobs": [
    {
      "id": "jc-001",
      "jobCardNumber": "JC-2026-0891",
      "equipmentModel": "AgriPro 7HP Power Weeder",
      "serialNumber": "AP7001-2025-9482",
      "customerName": "Kallappa Bellad",
      "customerMobile": "+91 98860 12345",
      "status": "INSPECTION",
      "serviceBayNumber": "Bay 1 - Power Tillers",
      "complaints": ["Engine starting issue", "Heavy white smoke"],
      "expectedDeliveryDate": "2026-03-18"
    }
  ]
}
```

### `POST /api/v1/mobile/technician/jobs/{id}/photos`
- **Purpose**: Multi-part upload of machine condition photos from the device camera.
- **Form Data**: `file` (image/jpeg, max 5MB), `caption` (e.g. "Snapped recoil pull starter cord")
- **Response**:
```json
{
  "success": true,
  "photoUrl": "https://cdn.agrimart.in/repairs/jc-001/intake_01.jpg",
  "uploadedAt": "2026-03-18T09:30:00Z"
}
```

### `POST /api/v1/mobile/technician/jobs/{id}/checklist`
- **Purpose**: Submit digital inspection checklist findings with toggles (`Good` | `Repair` | `Replace` | `N/A`).
- **Body**:
```json
{
  "checklist": [
    { "item": "Engine Oil Level", "status": "Replace", "notes": "Degraded viscosity" },
    { "item": "Spark Plug Gap", "status": "Replace", "notes": "Fouled carbon" },
    { "item": "Rotary Blades", "status": "Repair", "notes": "Edges dull" }
  ]
}
```

### `POST /api/v1/mobile/technician/jobs/{id}/requisition-parts`
- **Purpose**: Requisition replacement parts from the local store rack.
- **Body**:
```json
{
  "parts": [
    { "partNumber": "SP-PLUG-NGK", "qty": 1 },
    { "partNumber": "SP-BELT-B42", "qty": 1 }
  ]
}
```

### `PATCH /api/v1/mobile/technician/jobs/{id}/stage`
- **Purpose**: Advance repair stage or submit for Quality Check.
- **Body**:
```json
{
  "action": "ADVANCE_STAGE",
  "targetStage": "QUALITY_CHECK",
  "technicianNotes": "Carburetor cleaned and pilot jet reset. Replaced drive V-belt."
}
```

### `POST /api/v1/mobile/technician/jobs/{id}/time-log`
- **Purpose**: Start and pause bay timer to log actual labor duration.
- **Body**:
```json
{
  "action": "STOP",
  "timestamp": "2026-03-18T11:45:00Z",
  "durationMinutes": 115
}
```

---

## 2. Dealer Mobile App APIs

### `GET /api/v1/mobile/dealer/dashboard`
- **Purpose**: Real-time overview of monthly target progress, net delivered sales, active job cards, and commission earned.
- **Headers**: `Authorization: Bearer <dealer_token>`
- **Response**:
```json
{
  "dealerCode": "DLR-HUB-01",
  "businessName": "Patil Kisan Seva Kendra",
  "tier": "PLATINUM",
  "monthlyTarget": 2000000,
  "mtdGrossSales": 1850000,
  "mtdRefunds": 50000,
  "mtdCancelled": 20000,
  "mtdNetDeliveredSales": 1780000,
  "targetAchievementPercentage": 89,
  "earnedCommission": 160200,
  "pendingPayoutBalance": 32000,
  "activeJobCardsCount": 4
}
```

### `GET /api/v1/mobile/dealer/commissions`
- **Purpose**: Complete commission statement and clawback breakdown.
- **Response**:
```json
{
  "period": "2026-03",
  "baseRate": "9.0%",
  "baseCommission": 160200,
  "bonusCommission": 0,
  "clawbackDeductions": 4500,
  "clawbackExplanation": "Deducted ₹4,500 due to returned customer order #AGM-ORD-7712",
  "netPayableCommission": 155700
}
```

### `POST /api/v1/mobile/dealer/warranty-claims`
- **Purpose**: Submit warranty reimbursement claim for parts and labor replaced under warranty.
- **Body**:
```json
{
  "jobCardId": "jc-002",
  "equipmentSerial": "KK-16-2025-11029",
  "claimAmount": 802,
  "failureDescription": "Micro-switch internal short within 5 months of purchase",
  "partsReplaced": ["SP-SWITCH-110"]
}
```

### `POST /api/v1/mobile/dealer/warranty-claims/{id}/escalate-hq`
- **Purpose**: Escalate high-value warranty replacement or casting failure to AgriMart Mega Central HQ.
- **Body**:
```json
{
  "escalationReason": "Engine block casting flaw exceeds dealer ₹5,000 threshold. Requesting factory replacement."
}
```

---

## 3. Customer / Farmer Mobile App APIs

### `GET /api/v1/mobile/customer/equipment`
- **Purpose**: List all equipment owned by the farmer with warranty & AMC status.
- **Headers**: `Authorization: Bearer <customer_token>`
- **Response**:
```json
{
  "registeredEquipment": [
    {
      "serialNumber": "AP7001-2025-9482",
      "modelName": "AgriPro 7HP Power Weeder",
      "category": "Power Weeder",
      "warrantyStatus": "AMC_COVERED",
      "amcValidUntil": "2027-06-09",
      "usageHours": 185
    }
  ]
}
```

### `POST /api/v1/mobile/customer/repairs/book`
- **Purpose**: Book an authorized service or repair with GPS location and photo upload.
- **Body**:
```json
{
  "equipmentSerialNumber": "AP7001-2025-9482",
  "complaints": ["Engine starting problem", "Rotary blade slipping"],
  "gpsLatitude": 15.4589,
  "gpsLongitude": 75.0078,
  "preferredDate": "2026-03-20",
  "pickupRequired": true
}
```

### `GET /api/v1/mobile/customer/repairs/{id}/track`
- **Purpose**: Live 9-stage tracker for customer with real-time timestamps.
- **Response**:
```json
{
  "jobCardNumber": "JC-2026-0891",
  "equipmentModel": "AgriPro 7HP Power Weeder",
  "currentStage": "REPAIR",
  "stageProgress": [
    { "stage": "PRODUCT_RECEIVED", "completed": true, "timestamp": "2026-03-14T10:00:00Z" },
    { "stage": "INSPECTION", "completed": true, "timestamp": "2026-03-14T10:45:00Z" },
    { "stage": "ESTIMATE", "completed": true, "timestamp": "2026-03-14T11:15:00Z" },
    { "stage": "CUSTOMER_APPROVAL", "completed": true, "timestamp": "2026-03-14T11:30:00Z" },
    { "stage": "REPAIR", "completed": false, "timestamp": "2026-03-14T12:00:00Z" },
    { "stage": "QUALITY_CHECK", "completed": false },
    { "stage": "CLEANING", "completed": false },
    { "stage": "BILLING", "completed": false },
    { "stage": "DELIVERED", "completed": false }
  ],
  "assignedWorkshop": "Patil Kisan Seva Kendra (Hubballi Central)",
  "expectedDelivery": "2026-03-18"
}
```

### `POST /api/v1/mobile/customer/repairs/{id}/estimate-decision`
- **Purpose**: Customer digital sign-off to approve, reject, or partially approve repair estimate.
- **Body**:
```json
{
  "decision": "APPROVED", // or "PARTIALLY_APPROVED" | "REJECTED"
  "signatureToken": "SIG-AUTH-KB-9482",
  "approvedPartIds": ["sp-001", "sp-002", "sp-003"],
  "approvedLabourIds": ["lbr-002", "lbr-003"]
}
```

### `GET /api/v1/mobile/customer/repairs/{id}/invoice`
- **Purpose**: Retrieve PDF URL and line-item breakdown of the GST workshop invoice.
- **Response**:
```json
{
  "invoiceNumber": "INV-WS-2026-0412",
  "invoiceDate": "2026-03-12",
  "partsTaxable": 1250,
  "labourTaxable": 350,
  "cgst": 144,
  "sgst": 144,
  "discount": 88,
  "finalPayable": 1800,
  "paymentStatus": "PAID",
  "downloadPdfUrl": "https://cdn.agrimart.in/invoices/INV-WS-2026-0412.pdf"
}
```
