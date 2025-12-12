# Clickpost API: Create Order (Rest of World / V4)

**Summary:** This API is used to create orders with international couriers. It caters specifically to international customers or cross-border shipments (e.g., India to USA, or intra-Europe). It supports both Single Piece (SPS) and Multi-Piece (MPS) shipments.

**Geography:**
* North America
* Europe
* Middle East
* South East Asia
* Cross-Border (Any International Shipment)

**Important Note on Field Naming:**
Unlike the India-specific V3 API, this V4 API uses **generic** field names inside objects (e.g., use `name` instead of `pickup_name`).

---

## 1. Endpoint Details

* **Method:** `POST`
* **Endpoint:** `/api/v4/create-order/`
* **Full URL:** `https://www.clickpost.in/api/v4/create-order/`

### Authentication (Query Parameters)
These parameters must be passed directly in the URL.

| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`username`** | String | **Mandatory** | Username of the enterprise. |
| **`key`** | String | **Mandatory** | Unique license key provided by Clickpost. |

---

## 2. Payload Structure

The request body consists of several nested objects defining the shipment's journey, content, and financial details.

### A. Pickup Info (`pickup_info`) [Mandatory]
Describes the warehouse or pickup location.

| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`name`** | String | **Mandatory** | Contact name of the consignor. |
| **`phone`** | String | **Mandatory** | Contact number. |
| **`email`** | String | **Mandatory** | Email of the pickup contact. |
| **`address`** | String | **Mandatory** | Address of the pickup location. |
| **`city`** | String | **Mandatory** | City name. |
| **`state`** | String | **Mandatory** | State/Province. |
| **`postal_code`** | String | **Mandatory** | Postal code. |
| **`country_code`** | String | **Mandatory** | Alpha ISO-2 country code (e.g., "US", "AE"). |
| **`time`** | String | **Mandatory** | Pickup time. Format: `YYYY-MM-DDTHH:MM:SS`. |
| `phone_code` | String | Optional | Country dialing code (e.g., "+1"). |
| `address_type` | String | Optional | `"OFFICE"` or `"RESIDENTIAL"`. |
| `lat` / `long` | Float | Optional | Latitude/Longitude. |

### B. Drop Info (`drop_info`) [Mandatory]
Describes the delivery or consignee location.

| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`name`** | String | **Mandatory** | Contact name of the consignee. |
| **`phone`** | String | **Mandatory** | Contact number. |
| **`address`** | String | **Mandatory** | Address of the drop location. |
| **`city`** | String | **Mandatory** | City name. |
| **`state`** | String | **Mandatory** | State/Province. |
| **`postal_code`** | String | **Mandatory** | Postal code. |
| **`country_code`** | String | **Mandatory** | Alpha ISO-2 country code. |
| `email` | String | Optional | Email of the drop contact. |
| `phone_code` | String | Optional | Country dialing code. |

### C. Shipment Details (`shipment_details`) [Mandatory]
Describes the shipment contents, value, and carrier preference.

| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`order_type`** | String | **Mandatory** | `"PREPAID"` or `"COD"`. |
| **`delivery_type`** | String | **Mandatory** | `"FORWARD"` or `"RVP"`. |
| **`cod_value`** | Float | **Mandatory** | Cash to collect. Must be 0 for PREPAID. |
| **`invoice_value`** | Float | **Mandatory** | Shipment value for customs/invoice. |
| **`invoice_date`** | String | **Mandatory** | Format: `YYYY-MM-DD`. |
| **`currency_code`** | String | **Mandatory** | Currency code (e.g., "USD"). |
| **`courier_partner`** | Integer | **Mandatory** | Partner ID of the carrier. |
| **`reference_number`** | String | **Mandatory** | Unique order reference number. |
| **`weight`** | Integer | **Mandatory** | Total weight (grams). |
| **`length`** | Integer | **Mandatory** | Length (cm). |
| **`breadth`** | Integer | **Mandatory** | Breadth (cm). |
| **`height`** | Integer | **Mandatory** | Height (cm). |
| **`items`** | List | **Mandatory** | List of item objects (see details below). |
| `awb_number` | String | Optional | Pre-generated AWB (if applicable). |
| `vendor_code` | String | Conditional | Required for certain carriers (e.g., FedEx). |

#### Item Level Details (Inside `shipment_details.items`)
| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`description`** | String | **Mandatory** | Brief description of the item. |
| **`quantity`** | Integer | **Mandatory** | Number of units. |
| **`price`** | Float | **Mandatory** | Unit price. |
| **`weight`** | Integer | **Mandatory** | Weight per unit (grams). |
| **`height`/`length`/`breadth`** | Integer | **Mandatory** | Dimensions per unit (cm). |
| `sku` | String | Optional | Stock Keeping Unit. |
| `hs_code` | String | Optional | Harmonized System Code (Recommended for Cross-Border). |
| `manufacture_country` | String | Optional | Country of manufacture. |
| `images` | String | Optional | URL(s) for product images. |
| `carta_porte` | Object | Conditional | **Mexico Only.** See "Carta Porte" section. |

### D. Tax Info (`tax_info`) [Conditional]
Required for cross-border shipments involving customs/duties.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `shipper_tax_id` | String | Tax ID of the shipper. |
| `consignee_tax_id` | String | Tax ID of the consignee. |
| `consignee_tax_type` | String | Type of tax (e.g., "VAT", "GST"). |
| `consignee_tax_type_country_code` | String | ISO-2 Country Code for tax jurisdiction. |
| `exporter_tax_id` | String | Tax ID of the exporter. |
| `shipping_charges` | String | Freight charges. |
| `import_duty_vat_charges` | String | Additional duties/VAT. |

### E. Additional Fields (`additional`) [Optional]
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `label` | Boolean | Defaults to `true`. |
| `priority` | String | `"NORMAL"` (default) or `"URGENT"`. |
| **`rvp_reason`** | String | **Mandatory if `delivery_type` is "RVP"**. |
| `qc_type` | String | Set to `"doorstep"` for RVP with Quality Check. |
| `return_info` | Object | Details for return address (Latitude, Longitude, Address, etc.). |

---

## 3. Special Logic

### Reverse Shipment (RVP) Requirements
To place a return order:
1.  **Carrier:** The `courier_partner` ID must support RVP flows.
2.  **Type:** Set `shipment_details.delivery_type` to `"RVP"`.
3.  **Reason:** You must provide `additional.rvp_reason` (e.g., "Defective").

### Mexico: Carta Porte (Bill of Lading)
For shipments involving **Mexican couriers**, the `carta_porte` object is required inside each Item object.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `bienesTransp` | String | Government SKU categorization code (e.g., "10257"). |
| `materialPeligroso` | Boolean | Is the item dangerous/hazardous? |
| `embalaje` | String | Packaging type code. |
| `claveUnidad` | String | Unit key code. |

---

## 4. Sample Payload (Cross-Border)

```json
{
  "pickup_info": {
    "name": "Dubai Warehouse",
    "phone": "971500000000",
    "email": "dispatch@store.ae",
    "address": "Jebel Ali Free Zone",
    "city": "Dubai",
    "state": "Dubai",
    "postal_code": "00000",
    "country_code": "AE",
    "time": "2023-10-27T10:00:00",
    "phone_code": "+971"
  },
  "drop_info": {
    "name": "John Doe",
    "phone": "12125551234",
    "email": "john.doe@example.com",
    "address": "123 Broadway",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country_code": "US",
    "phone_code": "+1"
  },
  "shipment_details": {
    "order_type": "PREPAID",
    "delivery_type": "FORWARD",
    "cod_value": 0,
    "invoice_value": 150.00,
    "invoice_date": "2023-10-26",
    "currency_code": "USD",
    "courier_partner": 123,
    "reference_number": "INTL-ORD-001",
    "weight": 1000,
    "length": 30,
    "breadth": 20,
    "height": 10,
    "items": [
      {
        "description": "Running Shoes - Size 10",
        "sku": "SHOE-RUN-001",
        "quantity": 1,
        "price": 150.00,
        "weight": 1000,
        "height": 10,
        "length": 30,
        "breadth": 20,
        "hs_code": "6404.11",
        "manufacture_country_code": "CN"
      }
    ]
  },
  "tax_info": {
    "shipper_tax_id": "AE-VAT-12345",
    "consignee_tax_id": "US-SSN-98765",
    "shipping_charges": "20.00"
  },
  "additional": {
    "label": true
  }
}