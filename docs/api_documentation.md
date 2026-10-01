# AGRI MART MEGA PLATFORM: COMPLETE REST API DOCUMENTATION
**Project Reference**: Ref No: 2026-27/P163 | **Client**: GreenShield Industries Pvt Ltd, Bangalore  
**Document Classification**: Enterprise Architecture Specification | **Specification Version**: v1.0.0-PROD  
**Base URL**: `https://www.agrimart.in/api` (Production) | `http://localhost:3000/api` (Local Development)

---

## 1. Authentication & Session Architecture

Agri Mart implements mobile-first OTP authentication tailored for Indian farmers, combined with role-based access control (RBAC) cookies (`agri_auth_user`).

### Roles Supported:
- `CUSTOMER` / `FARMER`: E-Commerce, Rentals, On-field Services, Farm Profile.
- `DEALER`: Retail equipment sales, commission dashboards, job card submissions.
- `WAREHOUSE_OPERATOR`: Dark hub stock ledger, packing, manifest generation, dispatch.
- `AGRONOMIST` / `PROCUREMENT`: 7-stage crop tracker, advisory follow-up calendar.
- `SALES_EXECUTIVE`: 8-stage CRM lead pipeline, GPS farm visits.
- `SERVICE_TECHNICIAN` / `INSPECTOR`: Workshop 9-stage repair pipeline, spare parts debit, QC sign-off.
- `SUPER_ADMIN` / `FINANCE_CONTROLLER`: Platform-wide governance, voucher authorization, payout settlement.

---

## 2. API Endpoints Reference

### 2.1 Authentication & Profile Endpoints

#### POST `/api/auth/otp/send`
Requests a 6-digit SMS OTP for farmer login/registration.
- **Request Body**:
  ```json
  {
    "mobile": "9886099991"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully via SMS to +91 98860 99991.",
    "expiresIn": 600
  }
  ```

#### POST `/api/auth/otp/verify`
Verifies OTP, establishes authenticated cookie session, and registers new farmers automatically.
- **Request Body**:
  ```json
  {
    "mobile": "9886099991",
    "code": "123456"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Authentication successful.",
    "user": {
      "id": "usr-1789710451699",
      "name": "Farmer 9991",
      "mobile": "9886099991",
      "role": "CUSTOMER",
      "isVerified": true
    }
  }
  ```

---

### 2.2 Orders & Warehouse Allocation Endpoints

#### POST `/api/orders/create`
Places an order with automated dark warehouse proximity allocation.
- **Request Body**:
  ```json
  {
    "userId": "usr-1789710451699",
    "items": [
      {
        "productId": "prod-003",
        "variantId": "var-003-1",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "fullName": "Shivanand Patil",
      "mobile": "9886099991",
      "addressLine": "Farm Plot #28, Near Kelageri Lake",
      "village": "Kelageri",
      "taluk": "Dharwad",
      "district": "Dharwad",
      "pincode": "580007",
      "gpsLatitude": 15.4589,
      "gpsLongitude": 75.0078
    },
    "paymentMethod": "UPI"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "order": {
      "id": "ord-1789710451700",
      "orderNumber": "AGM-2026-4890",
      "status": "CONFIRMED",
      "totalAmount": 1700,
      "allocationStatus": "ALLOCATED",
      "assignedWarehouseId": "wh-dharwad",
      "assignedWarehouseName": "Dharwad Rural Fulfillment Hub",
      "trackingNumber": "AGM-TRK-4890"
    }
  }
  ```

#### POST `/api/warehouse/accept`
Warehouse operator accepts an order, transitioning status to `PACKED` and generating a printable packing slip.
- **Request Body**:
  ```json
  {
    "orderId": "ord-1789710451700",
    "warehouseId": "wh-dharwad",
    "operatorName": "Suresh Patil"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "allocationStatus": "ACCEPTED",
    "status": "PACKED",
    "packingSlipNumber": "PKG-DHA-4890"
  }
  ```

#### POST `/api/warehouse/dispatch`
Dispatches order via regional logistics carrier with AWB assignment.
- **Request Body**:
  ```json
  {
    "orderId": "ord-1789710451700",
    "warehouseId": "wh-dharwad",
    "courierName": "VRL Express Rural",
    "trackingNumber": "VRL-DWD-8910472",
    "estimatedDeliveryDate": "2026-10-02"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "status": "DISPATCHED",
    "trackingNumber": "VRL-DWD-8910472"
  }
  ```

---

### 2.3 Equipment Rentals & Returns Endpoints

#### POST `/api/rentals/book`
Creates an equipment rental booking with security deposit calculation.
- **Request Body**:
  ```json
  {
    "rentalProductId": "rnt-001",
    "productTitle": "AgriPro 7HP Multi-Speed Power Weeder",
    "userId": "usr-1789710451699",
    "customerName": "Shivanand Patil",
    "customerMobile": "9886099991",
    "deliveryAddress": "Farm Plot #28, Kelageri, Dharwad",
    "pincode": "580007",
    "startDate": "2026-10-15",
    "endDate": "2026-10-18",
    "totalDays": 4,
    "pricingTier": "DAILY",
    "paymentMethod": "UPI"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "booking": {
      "id": "rnt-bk-1789710451710",
      "bookingNumber": "RNT-2026-4401",
      "status": "PENDING_APPROVAL",
      "rentAmount": 2800,
      "securityDeposit": 3000,
      "totalPaid": 5800
    }
  }
  ```

#### POST `/api/rentals/return`
Processes equipment return inspection and calculates deposit refund.
- **Request Body**:
  ```json
  {
    "bookingId": "rnt-bk-1789710451710",
    "actualReturnDate": "2026-10-18",
    "condition": "ON_TIME",
    "damageCharge": 0,
    "damageNotes": "No damage. Blades intact."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "booking": {
      "status": "RETURNED_ON_TIME",
      "lateFee": 0,
      "damageFee": 0,
      "depositRefundAmount": 3000,
      "depositRefundStatus": "PROCESSED"
    }
  }
  ```

---

### 2.4 Agricultural Services Endpoints

#### POST `/api/services/book`
Submits a mechanization or agronomist field service request with GPS coordinates.
- **Request Body**:
  ```json
  {
    "userId": "usr-1789710451699",
    "customerName": "Shivanand Patil",
    "customerMobile": "9886099991",
    "serviceId": "srv-tractor-plowing",
    "serviceName": "Heavy Tractor Plowing & Cultivation",
    "jobWorkId": "jw-plowing",
    "jobWorkName": "Deep Summer Plowing",
    "farmAcreage": 3.5,
    "cropType": "Cotton",
    "district": "Dharwad",
    "taluk": "Dharwad",
    "village": "Kelageri",
    "address": "Sy. No 89, Kelageri",
    "pincode": "580007",
    "gpsLatitude": 15.4589,
    "gpsLongitude": 75.0078,
    "preferredDate": "2026-10-20",
    "preferredTime": "07:30 AM - 11:30 AM",
    "notes": "Heavy black cotton soil"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "request": {
      "id": "srv-req-1789710451720",
      "requestNumber": "REQ-SRV-2026-782",
      "status": "REQUESTED",
      "estimatedCost": 4200
    }
  }
  ```

---

### 2.5 Equipment Repairs & Workshop Endpoints

#### POST `/api/repairs/job-cards/create`
Creates a formal workshop job card (Intake Stage 1: `PRODUCT_RECEIVED`).
- **Request Body**:
  ```json
  {
    "customerName": "Shivanand Patil",
    "customerMobile": "9886099991",
    "customerVillage": "Kelageri, Dharwad",
    "equipmentModel": "AgriPro 7HP Power Weeder",
    "serialNumber": "TST-EQ-1775",
    "category": "Power Weeder",
    "powerType": "4-Stroke Petrol",
    "usageHours": 45,
    "complaints": [
      "Recoil starter cord broken",
      "Carburettor fuel overflow"
    ],
    "accessoriesReceived": ["Extra Rotary Blades"],
    "fuelOrBatteryLevel": "65% Petrol",
    "expectedDeliveryDate": "2026-10-25"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "jobCard": {
      "id": "jc-1789710451730",
      "jobCardNumber": "JC-2026-877",
      "status": "PRODUCT_RECEIVED"
    }
  }
  ```

#### POST `/api/repairs/job-cards/invoice`
Generates a GST tax invoice upon completing repair and quality check.
- **Request Body**:
  ```json
  {
    "jobCardId": "jc-1789710451730",
    "discountAmount": 25,
    "paymentMode": "UPI",
    "paymentStatus": "PAID",
    "transactionRef": "UPI-SBI-2026-991823"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "invoice": {
      "invoiceNumber": "INV-WS-2026-877",
      "taxableAmount": 530,
      "cgstAmount": 47.7,
      "sgstAmount": 47.7,
      "totalAmount": 600.4,
      "paymentStatus": "PAID"
    }
  }
  ```

---

### 2.6 Dealer Finance & Commissions Endpoints

#### GET `/api/finance/commissions?period=2026-03`
Calculates dealer commission statements strictly based on net delivered sales.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "period": "2026-03",
    "dealers": [
      {
        "dealerId": "dlr-01",
        "dealerName": "Patil Kisan Seva Kendra",
        "tier": "PLATINUM",
        "grossSales": 1850000,
        "refundedSales": 50000,
        "cancelledSales": 20000,
        "netDeliveredSales": 1780000,
        "baseCommissionRate": 9.0,
        "baseCommission": 160200,
        "bonusCommission": 35600,
        "clawbackDeductions": 4500,
        "netPayableCommission": 191300
      }
    ]
  }
  ```

#### POST `/api/finance/payout-vouchers/record`
Records an internal treasury mandate voucher.
- **Request Body**:
  ```json
  {
    "dealerId": "dlr-01",
    "period": "2026-03 Mid-Month Cycle",
    "amount": 191300,
    "recordedBy": "Accounts Executive R. Vernekar"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "voucher": {
      "id": "vch-1789710451740",
      "voucherNumber": "VCH-PAY-2026-0050",
      "status": "RECORDED_FOR_DISBURSEMENT",
      "disbursementNotice": "INTERNAL RECORD ONLY: Recording this payout voucher registers a disbursement mandate on Agri Mart ledger. It does NOT imply that a bank transfer occurred."
    }
  }
  ```
