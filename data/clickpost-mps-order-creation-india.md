# Clickpost API: Create B2B Order (India)

**Summary:** This API is designed for **B2B (Business-to-Business)** shipments within India. It supports Multi-Piece Shipments (MPS), complex Invoice/PO mapping, and Appointment-based deliveries.

**Key Features:**
* **Async by Default:** The API returns an acknowledgment (102) immediately; you must poll for the final result.
* **Invoice/PO Linking:** Link specific invoices or purchase orders to specific boxes within a shipment.
* **Appointment Management:** Pass start/end times for slot-based deliveries.

---

## 1. Endpoint Details

* **Method:** `POST`
* **Endpoint:** `/api/v1/create-b2b-order/`
* **Full URL:** `https://www.clickpost.in/api/v1/create-b2b-order/`

### Authentication (Query Parameters)
These must be passed in the URL.
* **`username`** (String, Mandatory): Enterprise username.
* **`key`** (String, Mandatory): UUID License key.

---

## 2. Asynchronous Workflow (Important)

This API operates in **Async Mode** by default to handle large B2B payloads efficiently.

1.  **Initiate:** Send `POST` request.
2.  **Acknowledge:** Receive **HTTP 102** response (Order Processing).
3.  **Poll:** Periodically call the **GET** endpoint (see section 6) using the `reference_number`.
4.  **Result:** Eventually receive **HTTP 200** (Success/Label generated) or **HTTP 420** (Failure).

*Note: To force Sync mode (not recommended for large orders), set `is_async: false` in `additional_info`.*

---

## 3. Payload Schema

The payload consists of 5 high-level objects.

### A. Pickup Info (`pickup_info`) & Drop Info (`drop_info`)
**Mandatory.** Defines the Origin and Destination.

| Field | Type | Description | Rules |
| :--- | :--- | :--- | :--- |
| **`name`** | String | Contact Person Name. | Mandatory. |
| **`phone`** | String | Contact Number. | Mandatory (10-12 digits). |
| **`organisation`** | String | Company Name. | Mandatory. |
| **`address`** | String | Street Address. | Mandatory (unless using Location Code). |
| **`city`, `state`** | String | City & State. | Mandatory. |
| **`pincode`** | String | 6-digit Pincode. | Mandatory. |
| **`country`** | String | Country Code. | Must be `"India"`. |
| **`time`** | String | Pickup Time. | **Format:** `YYYY-MM-DDTHH:MM:SS+0530` (IST). |
| `location_code` | String | Location Master Code. | **Rule:** If provided, leave address/city/state/pincode empty. |
| `tin` | String | Taxpayer ID / GST. | Optional. |

### B. Shipment Info (`shipment_info`)
**Mandatory.** This object contains the core logistics data, nested boxes, and financial documents.

#### Top Level Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| **`reference_number`** | String | Unique Order Ref. **Bluedart Max:** 20 chars. |
| **`courier_partner`** | Integer | Carrier Partner ID. |
| **`account_code`** | String | Carrier Account Name configured in Clickpost. |
| **`order_type`** | String | `"PREPAID"` or `"COD"`. |
| **`delivery_type`** | String | `"FORWARD"` or `"RVP"`. |
| `cod_value` | Float | **Must be 0** for PREPAID. |
| `weight` | Integer | Total shipment weight (gms). |

#### Nested Objects (Linking Logic)

**1. Invoice Info (`invoice_info`) - List**
*Details of ALL invoices involved in this shipment.*
* `number` (String, Mandatory): Invoice ID.
* `value` (Float, Mandatory): Invoice Value.
* `date` (Date, Mandatory): `YYYY-MM-DD`.
* `ewaybill_serial_number` (String): Mandatory if value >= 50k INR.
* `ewaybill_expiry_date` (Date)

**2. Purchase Order Info (`purchase_order_info`) - List**
*Details of ALL POs involved.*
* `number` (String): PO Number.
* `expiry_date` (String).

**3. GST Info (`gst_info`) - Object**
* `enterprise_gstin` (String, Mandatory).
* `consignee_gstin` (String, Mandatory).
* `taxable_value`, `gst_total_tax`, `sgst_amount`, `cgst_amount`, `igst_amount`.

**4. Box Info (`box_info`) - List [Critical]**
*Details of specific boxes (cartons) and what is inside them.*

| Field | Type | Description |
| :--- | :--- | :--- |
| **`count`** | Integer | Number of identical boxes. |
| **`height`, `length`, `breadth`** | Integer | Dimensions (cm). **Leave empty if `box_master_code` is used.** |
| **`weight`** | Integer | Weight of this box (gms). |
| `reference_number_prefix` | String | Prefix for box IDs. System adds .001, .002. **Must be unique.** |
| `invoice_info` | List | **Linking:** List `{ "number": "inv-1" }`. Must exist in top-level `invoice_info`. |
| `purchase_order_info` | List | **Linking:** List `{ "number": "po-1" }`. Must exist in top-level `purchase_order_info`. |
| `product_info` | List | Details of SKUs inside this box (sku, count, price, etc). |

### C. Appointment Info (`appointment_info`)
**Optional.** Used for slot-based deliveries (e.g., Q-Commerce, Amazon FC).
* `start_time`: `YYYY-MM-DDTHH:MM:SS+0530`
* `end_time`: `YYYY-MM-DDTHH:MM:SS+0530`
* `id`: Appointment ID.

### D. Additional Info (`additional_info`)
* `is_async` (Boolean): Default `true`.
* `is_label_required` (Boolean): Default `true`.
* `is_box_sticker_required` (Boolean): Default `true`.

---

## 4. Business Rules & Validations

1.  **Linking Validation:** If you link an Invoice or PO inside `box_info`, that Invoice/PO **must** be defined in the top-level `shipment_info`.
2.  **Unlinked Invoices:** You can have shipment-level invoices that are NOT linked to any specific box (consumed as-is).
3.  **Location Master:** You cannot send *both* `location_code` AND address details (lat/long, city, state). It is one or the other.
4.  **Box Master:** If `box_master_code` is provided (pre-saved dimensions), `length`, `breadth`, and `height` must be **empty**.
5.  **Ref Prefix:** If you use `reference_number_prefix` in one box object, you must use it in all. It must be unique per box object.

---

## 5. Sample Payload (B2B MPS)

```json
{
  "pickup_info": {
    "name": "Warehouse Manager",
    "phone": "9999999999",
    "organisation": "Acme Corp",
    "address": "Plot 101, Industrial Area",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600034",
    "country": "India",
    "time": "2024-10-27T11:00:00+0530",
    "email": "warehouse@acme.in"
  },
  "drop_info": {
    "name": "Retail Store Manager",
    "phone": "8888888888",
    "organisation": "Retail Org",
    "address": "Shop 5, Mall Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India",
    "email": "store@retail.in"
  },
  "shipment_info": {
    "reference_number": "B2B-ORD-001",
    "courier_partner": 129,
    "account_code": "Bluedart-Surface",
    "order_type": "PREPAID",
    "delivery_type": "FORWARD",
    "cod_value": 0,
    "weight": 5000,
    "invoice_info": [
      {
        "number": "INV-001",
        "value": 50000,
        "date": "2024-10-01",
        "ewaybill_serial_number": "123456789012"
      }
    ],
    "gst_info": {
      "enterprise_gstin": "29ABCDE1234F1Z5",
      "consignee_gstin": "27VWXYZ1234F1Z5",
      "taxable_value": 50000
    },
    "box_info": [
      {
        "count": 2,
        "reference_number_prefix": "BOX-A",
        "height": 20,
        "length": 20,
        "breadth": 20,
        "weight": 2500,
        "description": "Apparel Box",
        "invoice_info": [ { "number": "INV-001" } ],
        "product_info": [
          { "sku": "SHIRT-L", "sku_count": 10, "price": 1000 }
        ]
      }
    ]
  },
  "appointment_info": {
    "start_time": "2024-10-30T10:00:00+0530",
    "end_time": "2024-10-30T12:00:00+0530"
  },
  "additional_info": {
    "is_async": true,
    "is_label_required": true,
    "is_box_sticker_required": true
  }
}