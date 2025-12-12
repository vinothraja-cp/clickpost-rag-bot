# Clickpost API: Create Order (India / V3)

**Summary:** This API is used to create Forward and Reverse (RVP) shipments specifically for **India**. It supports Single-Piece and Multi-Piece shipments (SPS/MPS).

**Important Note on V3 vs V4:** Unlike the Global V4 API, this V3 API uses **prefixed field names** inside objects.
* **Correct:** `pickup_info.pickup_name`
* **Incorrect:** `pickup_info.name`

---

## Endpoint Details
* **Method:** `POST`
* **Endpoint:** `/v3/create-order/`
* **Full URL:** `https://www.clickpost.in/api/v3/create-order/`

---

## Authentication (Query Parameters)
These parameters must be passed in the URL string.
* **`username`** (String, Mandatory): Username of the enterprise.
* **`key`** (String, Mandatory): Unique API license key provided by Clickpost.

---

## Payload Structure & Schema

The request body is a JSON object containing the following top-level objects.

### 1. Pickup Info (`pickup_info`) [Mandatory]
Describes where the shipment is picked up.

| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`pickup_name`** | String | **Mandatory** | Contact name of the consignor. |
| **`pickup_phone`** | String | **Mandatory** | 10-digit contact number. |
| **`email`** | String | **Mandatory** | Email of the pickup contact. |
| **`pickup_address`** | String | **Mandatory** | Full street address. |
| **`pickup_city`** | String | **Mandatory** | City name (e.g., "Mumbai"). |
| **`pickup_state`** | String | **Mandatory** | State name (e.g., "Maharashtra"). |
| **`pickup_pincode`** | String | **Mandatory** | 6-digit Indian pincode. |
| **`pickup_country`** | String | **Mandatory** | Must be `"IN"`. |
| **`pickup_time`** | String | **Mandatory** | Format: `YYYY-MM-DDTHH:MM:SSZ` |
| `tin` | String | Mandatory | Taxpayer Identification Number or GST number. |
| `pickup_lat` / `pickup_long` | Float | Conditional | Required for hyper-local carriers. |

### 2. Drop Info (`drop_info`) [Mandatory]
Describes where the shipment is delivered.

| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`drop_name`** | String | **Mandatory** | Contact name of the consignee. |
| **`drop_phone`** | String | **Mandatory** | 10-digit contact number. |
| **`drop_address`** | String | **Mandatory** | Full street address. |
| **`drop_city`** | String | **Mandatory** | City name. |
| **`drop_state`** | String | **Mandatory** | State name. |
| **`drop_pincode`** | String | **Mandatory** | 6-digit Indian pincode. |
| **`drop_country`** | String | **Mandatory** | Must be `"IN"`. |
| `drop_start_time` | String | Optional | Format: `YYYY-MM-DDThh:mm:ss+0530` (Bluedart/Shipsy only). |

### 3. Shipment Details (`shipment_details`) [Mandatory]
Contains order specifics, dimensions, and items.

| Field Name | Type | Requirement | Description & Rules |
| :--- | :--- | :--- | :--- |
| **`order_type`** | String | **Mandatory** | Values: `"PREPAID"`, `"COD"`, or `"EXCHANGE"`. |
| **`delivery_type`** | String | **Mandatory** | Values: `"FORWARD"` or `"RVP"`. |
| **`cod_value`** | Float | **Mandatory** | **Must be 0** if `order_type` is "PREPAID". <br> **Must be > 0** if `order_type` is "COD". |
| **`invoice_value`** | Float | **Mandatory** | Value of shipment in invoice. |
| **`invoice_date`** | String | **Mandatory** | Format: `YYYY-MM-DD`. |
| **`courier_partner`** | Integer | **Mandatory** | The Partner ID (e.g., Bluedart is 5). |
| **`reference_number`** | String | **Mandatory** | Unique Order Ref. <br> **Note:** Max 20 chars for Bluedart. |
| `weight` | Integer | Mandatory | Weight in grams. **Bluedart minimum: 10g**. |
| `length` / `breadth` / `height` | Integer | Mandatory | Dimensions in cm. |
| `awb_number` | String | Conditional | Mandatory for Shadowfax, Fareye, Gati, Trackon, etc. |
| **`items`** | List | **Mandatory** | List of item objects (see below). |

#### Item Object (Inside `shipment_details.items`)
| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`sku`** | String | **Mandatory** | Stock Keeping Unit ID. |
| **`description`** | String | **Mandatory** | Item description. |
| **`quantity`** | Integer | **Mandatory** | Number of units. |
| **`price`** | Float | **Mandatory** | Unit price. |
| `weight` | Integer | Mandatory | Weight per unit (grams). |
| `additional` | Object | Optional | Contains `return_reason`, `color`, `brand` (Vital for QC/RVP). |

### 4. Additional Info (`additional`) [Optional]
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `async` | Boolean | Set `true` for background processing (useful for high volume). |
| `label` | Boolean | Defaults to `true`. Set `false` if label URL is not needed immediately. |
| `rvp_reason` | String | **MANDATORY** if `delivery_type` is "RVP". Max 500 chars. |
| `qc_type` | String | Set to `"doorstep"` if QC is required (RVP only). |

### 5. GST Info (`gst_info`) [Conditional]
Required for compliance, specifically for marketplaces or multi-seller shipments.
* **`seller_gstin`**: Mandatory for Amazon Transportation Services (ATS).
* **`ewaybill_serial_number`**: Optional.
* **`hsn_code`**: Optional.
* **`taxable_value`**, **`gst_total_tax`**, **`sgst_amount`**, **`cgst_amount`**, **`igst_amount`**.

---

## Business Logic & Common Errors

### Async Order Processing
If the carrier API is slow or `async: true` is set:
1.  **Response 202:** "Order Registered".
2.  **Action:** You must poll (retry) the API with the same `reference_number`.
3.  **Response 102:** "Processing".
4.  **Response 200:** "Success" (Order created).

### Error Codes
* **301:** Authentication Failed (Check username/key).
* **302:** Invalid Courier Partner ID (Must be an integer).
* **310:** RVP Reason missing (Mandatory for RVP).
* **315:** COD Value Mismatch (You sent COD value for a PREPAID order, or 0 for a COD order).
* **323:** Duplicate Order (Reference number already exists).
* **355:** Vendor Code missing (Required for specific carriers).

---

## Example Payload (JSON)

```json
{
  "pickup_info": {
    "pickup_name": "Warehouse Manager",
    "pickup_phone": "9876543210",
    "email": "warehouse@example.com",
    "pickup_address": "Building 12, Tech Park",
    "pickup_city": "Bengaluru",
    "pickup_state": "Karnataka",
    "pickup_pincode": "560001",
    "pickup_country": "IN",
    "pickup_time": "2023-10-25T10:00:00Z",
    "tin": "GSTIN123456"
  },
  "drop_info": {
    "drop_name": "Rohan Das",
    "drop_phone": "9988776655",
    "drop_address": "Flat 4B, Green Apartments",
    "drop_city": "Mumbai",
    "drop_state": "Maharashtra",
    "drop_pincode": "400001",
    "drop_country": "IN"
  },
  "shipment_details": {
    "order_type": "PREPAID",
    "delivery_type": "FORWARD",
    "cod_value": 0,
    "invoice_value": 1500,
    "invoice_date": "2023-10-24",
    "weight": 500,
    "length": 10,
    "breadth": 10,
    "height": 5,
    "courier_partner": 5,
    "reference_number": "ORD-2023-001",
    "items": [
      {
        "sku": "SKU_ABC_123",
        "description": "Cotton T-Shirt",
        "quantity": 1,
        "price": 1500,
        "weight": 500,
        "length": 10,
        "breadth": 10,
        "height": 5
      }
    ]
  },
  "additional": {
    "async": false,
    "label": true
  }
}