# API Documentation: Create MPS Order (Rest of the World & Cross-Border)

## Overview
To create orders with international couriers, Clickpost has provided the **V4 Order Creation API** that caters specifically to international customers or cross-border shipments. Enterprises can place both **Single Piece (SPS)** and **Multi-Piece Shipments (MPS)** with this API, to be delivered by their preferred courier partner.

This documentation specifically deals with **Multi-Piece Shipments (MPS)**.

### Geography
This API applies to shipments created and transported in:
* **North America**
* **Europe**
* **Middle East**
* **South East Asia**
* **Cross-Border shipments:** Shipments that are to be transported from India to any other country in the aforementioned regions, or vice versa.

---

## Endpoint Details

**URL:** `POST https://www.clickpost.in/api/v4/create-order/`

### URL Parameters
Query parameters to be passed directly in the URL.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **username** | String | **Yes** | Username of the enterprise. | 100 | `"test-enterprise"` |
| **key** | String | **Yes** | Unique license key provided by Clickpost for the enterprise. | 100 | `"34be9be5-..."` |

---

## Use Cases
1.  **Standard MPS/SPS:** Creating forward shipments.
2.  **Reverse Shipment (RVP):** Orders picked up from the end-user's address and sent to the enterprise warehouse.

### Placing Reverse Shipment (RVP) Requests
The payload for RVP is mostly the same as forward shipments, but **3 mandatory points** must be considered:
1.  **Carrier Support:** The `courier_partner` used must support RVP shipments.
2.  **Delivery Type:** The `delivery_type` field in `shipment_details` must be `"RVP"`.
3.  **Reason:** The `rvp_reason` field must be added in `shipment_details`.

**Quality Control (QC) Checks (Optional):**
If the enterprise wants a QC check at the doorstep:
* Add `qc_type`: `"doorstep"` in the `additional` object.
* Configure check parameters (brand, color, etc.) on the Clickpost dashboard.
* Relevant item details (color, size, brand, etc.) must be passed in the item object.

---

## Request Payload

The payload consists of the following objects:

### 1. Pickup Info (`pickup_info`)
**Mandatory.** Information for where the shipment will be picked up by the courier.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **lat** | Float | No | Latitude of the pickup location. | - | `45.12211` |
| **long** | Float | No | Longitude of the pickup location. | - | `88.12342` |
| **name** | String | **Yes** | Contact name of the consignor. | 100 | `"John Smith"` |
| **organisation** | String | No | Name of the Shipper Organisation. | 100 | `"Walmart"` |
| **address** | String | **Yes** | Address of the pickup location. | 500 | `"123, ABC Street"` |
| **district** | String | No | District of the pickup location. | 100 | `"Nadia"` |
| **city** | String | **Yes** | City of the pickup location. | 100 | `"Frankfort"` |
| **state** | String | **Yes** | State/province of the pickup location. | 100 | `"Ohio"` |
| **landmark** | String | No | Landmarks to help find the pickup location. | 500 | `"Near XYZ Towers"` |
| **email** | String | **Yes** | Email of the pickup contact. | 50 | `"abc@xyz.com"` |
| **phone** | String | **Yes** | Contact number of the pickup contact. | 11 | `"9876543210"` |
| **time** | String | **Yes** | Time of pickup (Format: `YYYY-MM-DDTHH:MM:SS`). | 20 | `"2022-01-10T10:02:33"` |
| **postal_code** | String | **Yes** | Postal code (Use blank string if not applicable). | 10 | `"L4YG6C"` |
| **country_code** | String | **Yes** | Alpha ISO-2 country code. | 2 | `"CA"` |
| **address_type** | String | No | `"OFFICE"` or `"RESIDENTIAL"`. | 50 | `"OFFICE"` |

### 2. Drop Info (`drop_info`)
**Mandatory.** Information for where the shipment will be delivered.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **lat** | Float | No | Latitude of the drop location. | - | `45.12211` |
| **long** | Float | No | Longitude of the drop location. | - | `88.12342` |
| **name** | String | **Yes** | Contact name of the consignee. | 100 | `"John Smith"` |
| **organisation** | String | No | Name of the Recipient Organisation. | 100 | `"Walmart"` |
| **address** | String | **Yes** | Address of the drop location. | 500 | `"123, ABC Street"` |
| **district** | String | No | District of the drop location. | 100 | `"Nadia"` |
| **city** | String | **Yes** | City of the drop location. | 100 | `"Frankfort"` |
| **state** | String | **Yes** | State/province of the drop location. | 100 | `"Ohio"` |
| **landmark** | String | No | Landmarks to help find the drop location. | 500 | `"Near XYZ Towers"` |
| **email** | String | No | Email of the drop contact. | 50 | `"abc@xyz.com"` |
| **phone** | String | **Yes** | Contact number of the drop contact. | 11 | `"9876543210"` |
| **time** | String | No | Estimated time of drop (`YYYY-MM-DDTHH:MM:SS`). | - | `"2022-01-10T10:02:33"` |
| **postal_code** | String | **Yes** | Postal code (Use blank string if not applicable). | 10 | `"L4YG6C"` |
| **country_code** | String | **Yes** | Alpha ISO-2 country code. | 2 | `"CA"` |
| **address_type** | String | No | `"OFFICE"` or `"RESIDENTIAL"`. | 50 | `"OFFICE"` |

### 3. Additional Fields (`additional`)
Optional fields for additional order details.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **label** | Boolean | Whether label is required (Defaults to `true`). | - | `true` |
| **priority** | String | Priority of order (`"NORMAL"` or `"URGENT"`). Defaults to `"NORMAL"`. | 10 | `"URGENT"` |
| **estimated_delivery_date**| Date | Date shared with customer. Used to measure carrier performance. | 10 | `"2023-12-05"` |

### 4. Return Info (`return_info`)
Details for the return address in case of failed delivery or product return.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **lat** | Float | No | Latitude of the return location. | - | `45.12211` |
| **long** | Float | No | Longitude of the return location. | - | `88.12342` |
| **name** | String | **Yes** | Contact name of the return contact. | 100 | `"John Smith"` |
| **organisation** | String | No | Name of the organisation returning to. | 100 | `"Walmart"` |
| **address** | String | **Yes** | Address of the return location. | 500 | `"123, ABC Street"` |
| **district** | String | No | District of the return location. | 100 | `"Nadia"` |
| **city** | String | **Yes** | City of the return location. | 100 | `"Frankfort"` |
| **state** | String | **Yes** | State/province of the return location. | 100 | `"Ohio"` |
| **landmark** | String | No | Landmarks for return location. | 500 | `"Near XYZ Towers"` |
| **email** | String | No | Email of the return contact. | 50 | `"abc@xyz.com"` |
| **phone** | String | **Yes** | Contact number of the return contact. | 11 | `"9876543210"` |
| **postal_code** | String | **Yes** | Postal code. | 10 | `"L4YG6C"` |
| **country_code** | String | **Yes** | Alpha ISO-2 country code. | 2 | `"CA"` |

### 5. Shipment Details (`shipment_details`)
**Mandatory.** Details regarding all items, payment, and courier partner.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **items** | List[Obj] | **Yes** | List of item objects (cartons). | - | `[{...}]` |
| **vendor_code** | String | Conditional | Vendor code of pickup location (if required by courier). | 100 | `"test_warehouse"` |
| **account_code** | String | **Yes** | Courier partner account name configured on Clickpost dashboard. | 100 | `'test_courier'` |
| **height** | Integer | **Yes** | Height of the overall package (cms). | 25 | `25` |
| **breadth** | Integer | **Yes** | Breadth of the overall package (cms). | 45 | `45` |
| **length** | Integer | **Yes** | Length of the overall package (cms). | 75 | `75` |
| **weight** | Integer | **Yes** | Weight of the package (gms). | 500 | `500` |
| **courier_partner**| Integer | **Yes** | Partner ID of the desired carrier. | - | `123` |
| **reference_number**| String | **Yes** | Unique reference number for every shipment. | 100 | `"TestOrder00001"` |
| **cod_value** | Float | **Yes** | Cash to be collected. Non-zero for COD, zero for PREPAID. | - | `25.25` |
| **order_id** | String | No | Identification string for the order. | 100 | `"TestOrderID00001"` |
| **order_type** | String | **Yes** | `"COD"` or `"PREPAID"`. | 10 | `"COD"` |
| **delivery_type** | String | **Yes** | `"FORWARD"` or `"RVP"`. | 10 | `"FORWARD"` |
| **rvp_reason** | String | Conditional | Reason for return. **Mandatory if `delivery_type` is RVP.** | 500 | `"Defect in product"` |
| **invoice_value** | Float | **Yes** | Value of shipment as mentioned in invoice. | - | `256.29` |
| **invoice_date** | String | **Yes** | Date of issuance of invoice (`YYYY-MM-DD`). | 100 | `"2022-01-10"` |
| **awb_number** | String | No | The airwaybill number (if pre-assigned). | 100 | `"TESTAWB00001"` |
| **items_in_shipment**| List[Obj] | No | List of items (SKUs) inside the box. | - | `[{...}]` |

### 6. Item Level Details (`items`)
Note: Each item object represents a **carton box**.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **description** | String | **Yes** | Brief description of the items. | 500 | `"Brown Socks"` |
| **quantity** | Integer | **Yes** | Number of units in the box. | - | `5` |
| **weight** | Integer | **Yes** | Weight of the box. | 500 | `500` |
| **price** | Float | **Yes** | Price of each unit (non-negative). | - | `64.99` |
| **gst_info** | Object | Conditional | GST info (for multi-seller shipments). | - | `{...}` |
| **additional** | Object | Conditional | Additional details regarding the box. | - | `{...}` |
| **height** | Integer | **Yes** | Height of the box (cms). | 25 | `25` |
| **breadth** | Integer | **Yes** | Breadth of the box (cms). | 45 | `45` |
| **length** | Integer | **Yes** | Length of the box (cms). | 75 | `75` |
| **cat** | String | No | Category of the item. | 50 | `Footwear` |
| **manufacture_country_code**| String | No | ISO Alpha-2 Country code of manufacture. | 2 | `"CA"` |
| **manufacture_country**| String | No | Full country name of manufacture. | 100 | `"Canada"` |
| **sku** | String | No | Stock-keeping unit of the item. | 100 | `"SKU0001"` |
| **return_days** | Integer | No | Days within which item can be returned. | 5 | `5` |
| **exchange_days** | Integer | No | Days within which item can be exchanged. | 5 | `5` |
| **product_url** | String | No | URL(s) for the product (comma-separated). | 1000 | `"http://link1..."` |
| **images** | String | No | URL(s) for the product image (comma-separated). | 1000 | `"http://img1..."` |
| **carta_porte** | Object | Conditional | Bill of lading details (**Mexico only**). | - | `{...}` |

**Fields for QC Checks (RVP Only):**
* `color`, `size`, `brand`, `sub_category`, `imei`, `ean`
* `return_reason`, `special_instructions`

### 7. Carta Porte Details (`carta_porte`) - Mexico Only
Required by Mexican couriers for bill of lading.

| Field Name | Data Type | Mandatory | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| **bienesTransp** | String | **Yes** | Govt categorization code of the SKU. | `"10257"` |
| **descripcion** | String | **Yes** | Item description. | `"Laptop"` |
| **materialPeligroso** | Boolean | **Yes** | Is the item dangerous/hazardous? | `false` |
| **cveMaterialPeligroso**| String | Conditional | Danger ID (if dangerous). | `""` |
| **embalaje** | String | **Yes** | Type of packing. | `""` |
| **claveUnidad** | String | **Yes** | Stock-keeping unit of the item. | `""` |

### 8. Tax Info (`tax_info`)
Required only for cross-border shipments having tax/customs requirements.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **shipper_tax_id** | String | Tax ID of the shipper. | 100 | `"09AAFC..."` |
| **consignee_tax_id** | String | Tax ID of the consignee. | 100 | `"123456"` |
| **consignee_tax_type** | String | Tax type on consignee (VAT, GST). | 100 | `"VAT"` |
| **consignee_tax_type_country_code**| String | Country code where tax is levied. | 2 | `"US"` |
| **exporter_tax_id** | String | Tax ID of the exporter/shipper. | 100 | `"123456"` |
| **exporter_tax_type** | String | Tax type on exporter (VAT, GST). | 100 | `"VAT"` |
| **exporter_tax_type_country_code**| String | Country code where tax is levied. | 2 | `"IN"` |
| **shipping_charges** | String | Freight charges (for DDU). | - | `"10.234"` |
| **import_duty_vat_charges** | String | Additional duty/VAT on import. | 100 | `"100"` |

---

## Response Structure

The response typically consists of:
* **meta:** Metadata (status code, messages).
* **result:** Actual result (waybill, labels, IDs).
* **order_id:** Order ID of the request.
* **tracking_id:** Special tracking ID.

### Response Result Fields
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **waybill** | String | Waybill number registered for tracking. |
| **reference_number** | String | Order reference number. |
| **label** | String/Null | URL to generated label (if needed). |
| **commercial_invoice_url** | String | URL to commercial invoice (if applicable). |
| **courier_partner_id** | Integer | ID of the courier partner. |
| **courier_name** | String | Name of the courier. |
| **sort_code** | String/Null | Sort code for custom labels (if supported). |
| **security_key** | String | UUID security key. |
| **children** | Object | (MPS only) List of item objects. |

---

## Possible Error Codes & Actionables

These are the list of possible error/status codes that can appear in the response metadata.

| Meta Code | HTTP Code | Description | Actionable | Success? | Status Message |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **102** | 200 | For async orders: The order has been recorded in Clickpost's database and is under processing. | Need to re-attempt Clickpost's order creation API to check if the order has been processed. | No | - |
| **200** | 200 | The order is successfully created. | None. | **Yes** | "Success" |
| **301** | 200 | The customer is sending an invalid/non-existent/inactive license key in the URL parameters. | Need to re-attempt the order with a valid/registered/active license key. | No | "Authentication Failed: Invalid Token or API Key" |
| **302** | 200 | Customer is sending `courier_partner` as a string, null, or a non-existent Partner ID. | Re-attempt with a valid integer value in `courier_partner` that exists in Clickpost's DB. | No | "Invalid Courier Partner Id with Field courier_partner" |
| **303** | 200 | For async orders: The `awb_number` provided already exists and is registered by Clickpost. | Need to re-attempt the order with a different `awb_number` value. | **Yes** | "Waybill already registered" |
| **307** | 200 | The `order_type` is anything other than `PREPAID`, `COD`, or `EXCHANGE`, or is null. | Re-attempt with `order_type` as `PREPAID`, `COD`, or `EXCHANGE`. | No | "You have entered invalid Order Type" |
| **308** | 200 | The `priority` value is anything other than `NORMAL` or `URGENT`. | Re-attempt with `priority` as `NORMAL` or `URGENT`. | No | "You have entered invalid Order priority" |
| **309** | 200 | The `delivery_type` value is anything other than `FORWARD` or `RVP`. | Re-attempt with `delivery_type` as `FORWARD` or `RVP`. | No | "Invalid Delivery Type" |
| **310** | 200 | RVP Order issue: `rvp_reason` is missing OR `rvp_reason` length > 500 chars. | Re-attempt with non-null `rvp_reason` within 500 characters. | No | "RVP reason is missing" or "RVP reason can't be more than 500 chars" |
| **311** | 200 | RVP Order issue: `courier_partner` does not support RVP shipments. | Re-attempt with a `courier_partner` value that supports RVP. | No | "Invalid Courier Partner For RVP" |
| **312** | 200 | There is no item data in the payload (`items` field). | Retry with a non-empty `items` array. | No | "Items Data is missing from order details" |
| **313** | 200 | `items` field format invalid (string, non-array, non-object, or missing mandatory fields). | Retry with proper `items` data as an array of JSON objects. | No | "Invalid Format of items for Order data" |
| **314** | 200 | Issue with order data passed. | Retry after addressing the status message. | No | "Invalid Format of items for Order data: ..." |
| **315** | 200 | COD/PREPAID mismatch. `cod_value` non-zero for PREPAID or zero for COD. | Set `cod_value` to 0 for PREPAID, or non-zero for COD. | No | "Invalid Cod Value" |
| **316** | 200 | No credentials (or blank) for `courier_partner` account given in `account_code`. | Re-attempt with different `account_code` or fill credentials in dashboard. | No | "You do not have credentials for the Courier Partner" |
| **319** | 200 | Issue in placing orders with courier partner. | Check error message. If vague, contact support. | No | "Error In Order Placing To Courier Partner: ..." |
| **320** | 200 | Enterprise has not subscribed for Clickpost's Order Creation Service. | Subscribe to service, then retry. | No | "This service is not subscribed by you" |
| **321** | 200 | The `awb_number` does not exist in Clickpost's database. | Provide a registered AWB, or remove AWB field and retry. | No | "Awb Number Does not exist in system for courier partner" |
| **322** | 200 | Issue in the courier partner servers. | Retry after waiting, or contact support. | No | "Internal Server Error In Courier Partners Server" |
| **323** | 200 | Order already present in Clickpost DB with same `reference_number`. | Re-attempt with a different `reference_number`. | **Yes** | "You have already placed this order" |
| **328** | 200 | Mandatory field in POST data is missing. | Check for missing fields and retry. | No | "Invalid POST data" |
| **329** | 200 | Connection to courier partner API timed out. | Retry after waiting, or contact support. | No | "Courier Partner API timeout" |
| **351** | 200 | Account name in `account_code` does not exist for the user/partner. | Check license key, `courier_partner` ID, and `account_code`. Correct and retry. | No | "Clickpost Account: Does not exist" |
| **352** | 200 | Multiple accounts exist with same name and partner for this enterprise. | - | No | "Multiple account exists" |
| **353** | 200 | The account in `account_code` is inactive. | Enable account on dashboard or use an active account. | No | "Clickpost Account: Inactive" |
| **354** | 200 | Unhandled error from courier partner's end. | Check status message. If vague, contact support. | No | "Unhandled error! Contact support@clickpost.in" |
| **355** | 200 | `vendor_code` is missing but required by courier. | Pass `vendor_code` with a registered vendor code. | No | "Vendor code not found" |
| **400** | 200 | Issue with payload or invalid data sent. | Fix payload issues per status message. If "Bad Request", contact support. | No | "Bad Request" or actual error |
| **500** | 200 | Error in Clickpost's servers. | Retry later. If persistent, contact support. | No | "Oops! Internal server error in Clickpost" |