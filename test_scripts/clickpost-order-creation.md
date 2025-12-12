# Clickpost API Documentation

**Version:** 1.0
**Base URL:** `https://www.clickpost.in/api`

---

## Authentication
Authentication is primarily handled via Query Parameters.
* **username**: Username, unique to the enterprise profile.
* **key**: Unique key to verify/authenticate the enterprise profile.

---

## Order Creation (Rest of the World)

### Create Order: Rest of the World
**Endpoint:** `POST /v4/create-order/`
**Description:** Creates an order with a specified carrier partner. Applies to shipments within North America, Europe, Middle East, South-East Asia, and cross-border shipments.

#### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | string | Yes | Username unique to the enterprise profile. |
| `key` | string | Yes | Unique key to verify/authenticate the enterprise profile. |

#### Request Payload
The payload must be a JSON object containing `RAW_BODY` (stringified JSON) or a direct JSON object depending on integration preference, containing the following fields:

**Root Object**
| Field Name | Data Type | Mandatory | Description |
| :--- | :--- | :--- | :--- |
| `pickup_info` | Object | Yes | Information for where the shipment will be picked up. |
| `drop_info` | Object | Yes | Information for where the shipment will be delivered. |
| `shipment_details` | Object | Yes | Information about the shipment itself. |
| `additional` | Object | No | Additional optional information (e.g., label generation). |
| `tax_info` | Object | No | Required only for cross-border shipments having tax/customs requirements. |
| `courier_custom_fields` | Object | Conditional | Required for specific carriers (e.g., Fedex MPS Cross-Border ID: 330). |

**Pickup Info (`pickup_info`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `name` | String | **Mandatory.** Contact name of the consignor. |
| `address` | String | **Mandatory.** Address of the pickup location. |
| `city` | String | **Mandatory.** City of the pickup location. |
| `state` | String | **Mandatory.** State/province of the pickup location. |
| `postal_code` | String | **Mandatory.** Postal code (use blank string if not applicable). |
| `country_code` | String | **Mandatory.** Alpha ISO-2 country code. |
| `email` | String | **Mandatory.** Email of the pickup contact. |
| `phone` | String | **Mandatory.** Contact number of the pickup contact. |
| `time` | String | **Mandatory.** Time of pickup (YYYY-MM-DDTHH:MM:SS). |
| `lat` | Float | Optional. Latitude of the pickup location. |
| `long` | Float | Optional. Longitude of the pickup location. |
| `district` | String | Optional. District of the pickup location. |
| `landmark` | String | Optional. Landmarks to help find the location. |
| `phone_code` | String | Optional. Country phone dialing code. |
| `address_type` | String | Optional. `OFFICE` or `RESIDENTIAL`. |

**Drop Info (`drop_info`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `name` | String | **Mandatory.** Contact name of the consignee. |
| `address` | String | **Mandatory.** Address of the drop location. |
| `city` | String | **Mandatory.** City of the drop location. |
| `state` | String | **Mandatory.** State/province of the drop location. |
| `postal_code` | String | **Mandatory.** Postal code (use blank string if not applicable). |
| `country_code` | String | **Mandatory.** Alpha ISO-2 country code. |
| `phone` | String | **Mandatory.** Contact number of the drop contact. |
| `lat` | Float | Optional. Latitude of the drop location. |
| `long` | Float | Optional. Longitude of the drop location. |
| `district` | String | Optional. District of the drop location. |
| `landmark` | String | Optional. Landmarks to help find the location. |
| `email` | String | Optional. Email of the drop contact. |
| `time` | String | Optional. Estimated drop time (YYYY-MM-DDTHH:MM:SS). |
| `phone_code` | String | Optional. Country phone dialing code. |
| `address_type` | String | Optional. `OFFICE` or `RESIDENTIAL`. |

**Shipment Details (`shipment_details`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `items` | List[Obj] | **Mandatory.** List of items in the shipment. |
| `account_code` | String | **Mandatory.** Courier partner account name configured on Clickpost. |
| `courier_partner` | Integer | **Mandatory.** Partner ID of the desired carrier. |
| `reference_number` | String | **Mandatory.** Unique reference number for the order. |
| `cod_value` | Float | **Mandatory.** COD amount (Non-zero for COD, Zero for PREPAID). |
| `order_type` | String | **Mandatory.** `COD` or `PREPAID`. |
| `delivery_type` | String | **Mandatory.** `FORWARD` or `RVP`. |
| `invoice_value` | Float | **Mandatory.** Shipment value per invoice. |
| `invoice_date` | String | **Mandatory.** Date of invoice (YYYY-MM-DD). |
| `height` | Float | **Mandatory.** Height in cms. |
| `breadth` | Float | **Mandatory.** Breadth in cms. |
| `length` | Float | **Mandatory.** Length in cms. |
| `weight` | Float | **Mandatory.** Weight in gms. |
| `vendor_code` | String | Conditional. Vendor code of pickup location (if required by carrier). |
| `order_id` | String | Optional. Identification string for the order. |
| `awb_number` | String | Optional. The airwaybill number. |

**Item Level Details (in `shipment_details.items`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `description` | String | **Mandatory.** Brief description of the item. |
| `quantity` | Integer | **Mandatory.** Number of units. |
| `weight` | Float | **Mandatory.** Weight of each unit. |
| `price` | Float | **Mandatory.** Non-negative price of each unit. |
| `cat` | String | Optional. Category of the item. |
| `sku` | String | Optional. Stock-keeping unit. |
| `manufacture_country`| String | Optional. Full country name of manufacture. |
| `manufacture_country_code`| String | Optional. Alpha-2 ISO Country code of manufacture. |
| `return_days` | Integer | Optional. Return window days. |
| `product_url` | String | Optional. URL for the product. |
| `images` | String | Optional. URL for product images. |
| `carta_porte` | Object | Conditional. For Mexican couriers (Bill of Lading details). |

**Carta Porte Details (`items.carta_porte`) - Mexico Only**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `bienesTransp` | String | Mandatory. Gov SKU categorization number. |
| `descripcion` | String | Mandatory. Item description. |
| `materialPeligroso` | Boolean | Mandatory. Is item dangerous? |
| `cveMaterialPeligroso`| String | Conditional. Dangerous material ID. |
| `embalaje` | String | Mandatory. Packing type. |
| `claveUnidad` | String | Mandatory. SKU unit key. |

**Additional Fields (`additional`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `label` | Boolean | Optional. Generate label (Default: true). |
| `priority` | String | Optional. `NORMAL` (default) or `URGENT`. |
| `rvp_reason` | String | Conditional. Mandatory if delivery_type is RVP. |
| `estimated_delivery_date`| Date | Optional. Date shared with customer (YYYY-MM-DD). |

**Return Info (`return_info`)**
*Structure is identical to `pickup_info`.* Used for RTO address.

**Tax Info (`tax_info`)**
Used for cross-border shipments. Includes `shipper_tax_id`, `consignee_tax_id`, `consignee_tax_type` (VAT/GST), `exporter_tax_id`, and `lut_bond_number`.

### Fetch Order Details: Rest of the World
**Endpoint:** `GET /v4/create-order/`
**Description:** Fetch details of a shipment using AWB and carrier ID.
**Query Parameters:** `username`, `key`, `awb`, `cp_id`.

---

## Order Creation (India)

### Create Order: India
**Endpoint:** `POST /v3/create-order/`
**Description:** Creates an order for shipments created and transported within India.

#### Request Payload
**Root Object**
| Field Name | Data Type | Mandatory | Description |
| :--- | :--- | :--- | :--- |
| `pickup_info` | Object | Yes | Warehouse/pickup location. |
| `drop_info` | Object | Yes | Delivery/consignee location. |
| `shipment_details` | Object | Yes | Order and item details. |
| `additional` | Object | No | Extra details (Async, Label, etc.). |

**Pickup Info (`pickup_info`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `pickup_name` | String | **Mandatory.** Consignor contact name. |
| `pickup_address` | String | **Mandatory.** Pickup address. |
| `pickup_city` | String | **Mandatory.** Pickup City. |
| `pickup_state` | String | **Mandatory.** Pickup State. |
| `pickup_pincode` | String | **Mandatory.** 6-digit Pincode. |
| `pickup_country` | String | **Mandatory.** "IN" only. |
| `email` | String | **Mandatory.** Pickup email. |
| `pickup_phone` | String | **Mandatory.** Pickup phone. |
| `pickup_time` | String | **Mandatory.** Time (YYYY-MM-DDTHH:MM:SS). |
| `tin` | String | **Mandatory.** Seller TIN or GST number. |
| `pickup_lat` | Float | Conditional. Latitude. |
| `pickup_long` | Float | Conditional. Longitude. |

**Drop Info (`drop_info`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `drop_name` | String | **Mandatory.** Consignee contact name. |
| `drop_address` | String | **Mandatory.** Drop address. |
| `drop_city` | String | **Mandatory.** Drop City. |
| `drop_state` | String | **Mandatory.** Drop State. |
| `drop_pincode` | String | **Mandatory.** 6-digit Pincode. |
| `drop_country` | String | **Mandatory.** "IN" only. |
| `drop_phone` | String | **Mandatory.** Drop phone. |
| `drop_email` | String | Optional. Drop email. |

**Shipment Details (`shipment_details`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `items` | List[Obj] | **Mandatory.** List of items. |
| `account_code` | String | **Mandatory.** Clickpost dashboard account code. |
| `courier_partner` | Integer | **Mandatory.** Carrier Partner ID. |
| `reference_number` | String | **Mandatory.** Unique order Ref No. (Max 20 chars for Bluedart). |
| `invoice_value` | Float | **Mandatory.** Invoice value. |
| `invoice_date` | String | **Mandatory.** Invoice date (YYYY-MM-DD). |
| `delivery_type` | String | **Mandatory.** `FORWARD` or `RVP`. |
| `order_type` | String | **Mandatory.** `COD`, `PREPAID`, or `EXCHANGE`. |
| `cod_value` | Float | **Mandatory.** 0 for Prepaid, >0 for COD. |
| `height` | Integer | **Mandatory.** Height (cm). |
| `breadth` | Integer | **Mandatory.** Breadth (cm). |
| `length` | Integer | **Mandatory.** Length (cm). |
| `weight` | Integer | **Mandatory.** Weight (grams). |
| `awb_number` | String | Conditional. Mandatory for specific couriers (e.g., Shadowfax, Gati, etc.). |

**Item Level Details (`shipment_details.items`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `description` | String | **Mandatory.** Item description. |
| `quantity` | Integer | **Mandatory.** Quantity. |
| `weight` | Float | **Mandatory.** Weight per unit. |
| `price` | Float | **Mandatory.** Price per unit. |
| `sku` | String | Optional. SKU. |
| `gst_info` | Object | Conditional. Required for multi-seller shipments. |

**GST Info (`gst_info` or inside items)**
Fields: `enterprise_gstin`, `seller_gstin`, `taxable_value`, `ewaybill_serial_number`, `is_seller_registered_under_gst`, `place_of_supply`, `hsn_code`, `gst_total_tax`, `sgst_tax_rate`, `sgst_amount`, `igst_tax_rate`, `igst_amount`, `cgst_tax_rate`, `cgst_amount`.

**Additional Fields (`additional`)**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `async` | Boolean | Optional. Background processing (default: false). |
| `label` | Boolean | Optional. Generate label (default: true). |
| `rvp_reason` | String | Conditional. Mandatory for RVP (Return) shipments. |
| `is_multi_seller` | Boolean | Conditional. True if items have different GST numbers. |
| `invoice_base_64` | String | Optional. Base64 invoice string. |

### Fetch Order Details: India
**Endpoint:** `GET /v3/create-order/`
**Description:** Fetch details of a shipment created within India.
**Query Parameters:** `username`, `key`, `awb`, `cp_id`.

---

## Tracking & Registration

### Register Shipment (V3 - Recommended)
**Endpoint:** `POST /v3/tracking/awb-register/`
**Description:** Register an AWB for tracking updates given AWB, partner ID, and shipment details.
**Payload:** JSON object containing `waybill`, `courier_partner`, `account_code`, `consumer_details`, `shipment_info`, `pickup_info`, `drop_info`, `additional`.

### Register Shipment (V2)
**Endpoint:** `POST /v2/tracking/awb-register/`
**Description:** Older version of AWB registration.

### Enable Shipment Notification
**Endpoint:** `POST /v1/enable_shipment_notification/`
**Description:** Enable/Disable WhatsApp communication for a shipment.
**Payload:** `awb` (string), `whatsapp_disable` (boolean).

### Fetch Shipment Security Key
**Endpoint:** `GET /v1/shipment-security-key`
**Description:** Fetch security key required for secure tracking pages.
**Query Parameters:** `key`, `waybill`, `cp_id`.

---

## Order Management

### Edit Order
**Endpoint:** `POST /v1/edit-order/`
**Description:** Edit details for a manifested shipment (e.g., convert COD to Prepaid).
**Payload Example:** `{"awb_number": "...", "order_type": "PREPAID", "courier_partner": 3}`.

### Cancel Order
**Endpoint:** `GET /v1/cancel-order/`
**Description:** Cancel a shipment in the carrier partner's system.
**Query Parameters:** `username`, `key`, `waybill`, `cp_id`, `account_code`, `manually_update_status`.

### Fetch Updated Orders
**Endpoint:** `GET /v1/updated-order`
**Description:** Retrieve latest shipment tracking status updates between a specified start and end time.
**Query Parameters:** `username`, `key`, `start_date` (epoch), `end_date` (epoch).

### Fetch Daily Shipment Count
**Endpoint:** `GET /v1/fetch-shipment-count/`
**Description:** Get the count of shipments created/registered date-wise.
**Query Parameters:** `key`, `start-date` (YYYY-MM-DD), `end-date`.

### Fetch NDR User Feedback
**Endpoint:** `GET /v1/ndr_user_feedback/`
**Description:** Retrieve feedback from end-users regarding failed deliveries.
**Query Parameters:** `username`, `key`, `start_date` (epoch), `end_date` (epoch).

### NDR Action Update
**Endpoint:** `POST /v2/ndr-update-api`
**Description:** Instruct the courier to take action (Reattempt/RTO) on an AWB.
**Payload:** `action` ("INITIATE_RTO" or "REATTEMPT"), `waybill`, `cp_id`, `account_code`, `address`, `phone_number`, `preferred_date`.

---

## Pickup & Label Services

### Create Pickup: India
**Endpoint:** `POST /v1/create-pickup/`
**Description:** Create a new pickup request for carriers in India.
**Payload:** `items`, `pickup_city`, `pickup_date`, `pickup_name`, `account_code`, `courier_partner`, etc.

### Create Pickup: Rest of World
**Endpoint:** `POST /v2/create-pickup/`
**Description:** Create a new pickup request for worldwide/cross-border shipments.
**Payload:** `shipment_details` (including `awb_number`, `courier_partner_id`, `items`), `pickup_info` (date, time, address).

### Fetch Shipping Label
**Endpoint:** `GET /v1/fetch/shippinglabel/`
**Description:** Retrieve the shipping label URL.
**Query Parameters:** `username`, `key`, `waybill`, `cp_id`, `regenerate` (true/false).

---

## Utility & Account

### Recommendation API: India
**Endpoint:** `POST /v1/recommendation_api/`
**Description:** Get recommended carriers based on historical data for India.

### Recommendation API: Rest of World
**Endpoint:** `POST /v2/recommendation/`
**Description:** Get recommended carriers for GCC, North America, and Europe.

### Fetch Accounts
**Endpoint:** `GET /v1/fetch-accounts`
**Description:** Get active carrier partner accounts on the Clickpost dashboard.
**Query Parameters:** `key`, `active` (boolean).

### Pincode Details
**Endpoint:** `GET /v2/pincode_details/`
**Description:** Returns city and state for a valid 6-digit Indian pincode.

### Audit Logs
**Endpoint:** `GET /v1/audit-log-data/`
**Description:** Fetch activity logs for account actions.
**Query Parameters:** `key`, `log_epoch_time`.

### Reports
**Endpoint:** `POST /v1/reports/enterprise_dashboard_report/`
**Description:** Request a report generation.
**Payload:** `report_name`, `filters` (start/end time).

**Endpoint:** `GET /v1/reports/enterprise_dashboard_report/`
**Description:** Check status and get download link for the requested report.
**Query Parameter:** `report_reference_number`.

### Return Order Poll
**Endpoint:** `GET /v1/return_order_poll/`
**Description:** Fetch return requests raised in a 60-minute window.
**Query Parameters:** `key`, `user_name`, `start_time`, `end_time`.

### Token Generation
**Endpoint:** `POST /v1/user/token/`
**Description:** Generate access token using username and password.