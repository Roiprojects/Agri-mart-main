# AGRI MART MEGA PLATFORM: ROLE-BASED OPERATIONS & USER MANUAL
**Project Reference**: Ref No: 2026-27/P163 | **Client**: GreenShield Industries Pvt Ltd, Bangalore  
**Audience**: Farmers, Dealers, Warehouse Operators, Agronomists, Sales Teams, Technicians, Super Admin  
**Platform Version**: v1.0.0-PROD

---

## 1. Role: Farmer / Customer

### 1.1 Mobile Login & Registration
1. Navigate to `https://www.agrimart.in` or launch the mobile portal.
2. Enter your 10-digit mobile number on the login screen.
3. Enter the 6-digit SMS OTP received on your device.
4. Set up your delivery address, village, taluk, district, and pin your farm parcel location using the GPS map selector.

### 1.2 AI Agronomy Consultation
1. Navigate to **Crop Advisory / AI Guidance** (`/crop-guidance`).
2. Answer the 9 interactive diagnostic questions:
   - Primary crop (e.g., Cotton, Sugarcane, Maize, Chili).
   - Soil classification (e.g., Black Clay, Red Sandy Loam).
   - Total acreage under cultivation.
   - Current crop stage (e.g., Sowing, Vegetative, Flowering, Harvest Ready).
   - Observed pest or disease symptoms.
   - Irrigation method (Drip, Sprinkler, Flood).
3. The AI engine instantly calculates and displays customized product recommendations, spray schedules, and dosage instructions.

### 1.3 Equipment Rental Booking
1. Browse available machines in the **Rentals Fleet** (`/rentals`).
2. Review specifications, daily/weekly rates, and required refundable security deposits.
3. Select start date and end date on the **Availability Calendar**.
4. Review calculated rent and security deposit; proceed to pay via UPI or NetBanking.
5. Once approved by Super Admin, track dispatch to your farm gate.
6. Upon completion, hand over the equipment for return inspection; your deposit refund is processed automatically.

### 1.4 On-Field Agricultural Services
1. Select required service (Tractor plowing, Drone spraying, Harvesting, Soil testing) at `/services`.
2. Enter farm parcel size, desired job-work, date, and preferred time slot.
3. Drop your farm GPS pin to guide the machinery operator.
4. Track operator assignment, arrival, and completion directly from your account dashboard.

---

## 2. Role: Dark Warehouse Operator

### 2.1 Warehouse Portal Access (`/warehouse`)
1. Log in with your warehouse operator credentials.
2. The dashboard displays real-time inventory levels, low-stock warnings, and incoming orders allocated to your hub.

### 2.2 Order Fulfillment Workflow
1. **Order Acceptance**: Review new allocated orders. Verify physical shelf stock and click **Accept Order**.
2. **Packing Slip Generation**: The system automatically transitions the order to `PACKED` and generates a barcode packing slip (`PKG-XXX-XXXX`).
3. **Dispatch Manifest**: Select the assigned carrier (VRL Logistics for heavy equipment; Delhivery for parcels), enter the carrier AWB tracking number, and click **Dispatch Shipment**.
4. **Rejection & Failover**: If inventory is damaged or unavailable, click **Reject Order** and enter the formal audit reason. The automated recovery engine immediately re-routes the order to the next nearest regional dark hub without manual admin intervention.

### 2.3 Stock Ledger Transactions
- Record inward purchase orders (PO) via **Stock-In**.
- Perform periodic cycle counts and log discrepancy adjustments.

---

## 3. Role: Agronomist & Procurement Team

### 3.1 Farmer Lifecycle Tracking (`/procurement`)
1. Access the farmer registry displaying active crop cycles.
2. Track farmers across the 7 recognized agronomic stages:
   - Stage 1: Soil Preparation
   - Stage 2: Sowing / Seed Treatment
   - Stage 3: Basal & Organic Nutrition
   - Stage 4: Irrigation & Vegetative Growth
   - Stage 5: Pest & Disease Protection
   - Stage 6: Flowering & Boll/Pod Development
   - Stage 7: Harvesting & Post-Harvest Storage
3. Update crop stages with field notes to trigger automated input recommendations.

### 3.2 Advisory Follow-Up Calendar
1. Review pending scheduled advisory calls.
2. Dial the farmer, verify crop health, and log consultation notes.
3. Click **Complete Follow-Up** to register resolution history on the farmer profile.

---

## 4. Role: Sales Team

### 4.1 CRM 8-Stage Lead Management (`/sales`)
1. Manage leads originated from website inquiries, dealer referrals, and AI advisory drop-offs.
2. Progress leads across the pipeline:
   - `NEW` $\rightarrow$ `CONTACTED` $\rightarrow$ `NEED_ANALYSIS` $\rightarrow$ `DEMO_SCHEDULED` $\rightarrow$ `QUOTATION_SENT` $\rightarrow$ `NEGOTIATION` $\rightarrow$ `CONVERTED` $\rightarrow$ `LOST`
3. Send official quotations directly via WhatsApp.

### 4.2 GPS Field Visit Logging
1. Open the field visit module on mobile when visiting a farm.
2. The app captures device GPS coordinates, observed crop health, and demo outcome.
3. Submit the visit report to automatically attach the visit trail to the customer lead record.

---

## 5. Role: Workshop Technician & Quality Inspector

### 5.1 9-Stage Job Card Workflow (`/repairs`)
1. **Stage 1: Intake (`PRODUCT_RECEIVED`)**:
   - Register equipment serial number, power type, engine number, usage hours, and warranty/AMC status.
   - Record multiple customer complaints, received accessories, and intake fuel/battery level.
   - Capture customer intake signature.
2. **Stage 2: Inspection (`INSPECTION`)**:
   - Conduct multi-point inspection.
   - Enter diagnosis, root cause, required spare parts from inventory, and standard labour operations.
3. **Stage 3: Estimate (`ESTIMATE`)**:
   - System calculates parts subtotal, labour subtotal, 18% GST split, and applicable discounts.
4. **Stage 4: Customer Approval (`CUSTOMER_APPROVAL`)**:
   - Send estimate to farmer via SMS/WhatsApp.
   - Customer signs digitally via OTP. *(Note: Stage guard strictly blocks advancing to REPAIR without customer approval).*
5. **Stage 5: Repair (`REPAIR`)**:
   - Assign qualified technician and service bay.
   - Entering REPAIR atomically deducts required spare parts from the workshop parts ledger.
6. **Stage 6: Quality Check (`QUALITY_CHECK`)**:
   - Certified Quality Inspector tests engine RPM, blade balance, electrical circuits, and safety shut-offs.
   - Inspector certifies PASS with formal notes. *(Note: Stage guard strictly blocks advancing to BILLING without inspector sign-off).*
7. **Stage 7: Cleaning (`CLEANING`)**:
   - High-pressure washing, greasing, and cosmetic cleanup.
8. **Stage 8: Billing (`BILLING`)**:
   - Generate official Workshop GST Tax Invoice (`INV-WS-XXXX`).
   - Record payment via UPI, cash, or dealer ledger debit.
9. **Stage 9: Delivery (`DELIVERED`)**:
   - Hand over machine to farmer with 90-day warranty certificate.
   - System schedules an automated 100-hour next-service reminder in the notification matrix.

---

## 6. Role: Super Admin & Finance Controller

### 6.1 Admin Command Center (`/admin`)
- Platform-wide telemetry: gross order volume, active rental fleet utilization, dark hub stock levels, open repair cards.
- Master catalogue management: products, categories, rental fleet units, service rates.
- Order routing controls: manual warehouse re-allocation, split order execution, and fraud hold.

### 6.2 Finance Incentive Commission Portal (`/finance`)
1. **Commission Reconciliation**:
   - System computes dealer commissions strictly on **Net Delivered Sales** ($\text{Gross} - \text{Refunds} - \text{Cancellations}$).
   - Automatically deducts prior-cycle return clawbacks.
2. **Payout Mandate Vouchers**:
   - Generate payout voucher (`VCH-PAY-XXXX`) in status `RECORDED_FOR_DISBURSEMENT`.
   - Prominently displays mandatory treasury notice: *Recording an internal payout voucher does NOT imply that a bank transfer occurred*.
3. **Multi-Tier Authorization & Bank Settlement**:
   - Finance Controller reviews statement and grants `FINANCE_APPROVED`.
   - Allocate bank CMS batch reference.
   - Following confirmed bank RTGS transfer, mark status as `EXTERNALLY_SETTLED` with UTR number.
