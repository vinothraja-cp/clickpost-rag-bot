# API Documentation: Tracking Shipment using Polling

## Overview
This API allows enterprises to retrieve the latest tracking updates from Clickpost using the **Polling** method. Polling is used to retrieve both the historic statuses (scans) and the current status of the package by querying the endpoint repeatedly.

### Use Case
This is a standard API which applies to all **MPS (Multi-Piece Shipment)** and **SPS (Single Piece Shipment)** orders.

### Geography
This API is applicable for **all geographies** (Indian, worldwide, and cross-border shipments).

---

## Endpoint Details

**Method:** `GET`
**URL:** `https://api.clickpost.in/api/v2/track-order/`

### URL Parameters
These query parameters must be passed directly in the URL.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **key** | String | **Yes** | Unique license key provided by the Clickpost team. | 100 | `"34be9be5-3de8-4223-ad14-d7391159b80e"` |
| **username** | String | **Yes** | Registered username given by the Clickpost team. | 100 | `"test-enterprise"` |
| **waybill** | String | **Yes** | Waybill(s) of the shipment to be tracked. **Can pass multiple waybills (comma separated, up to 5) in a single request**, provided all AWBs belong to the same carrier. | 100 | `"TESTAWB000001"` |
| **cp_id** | String | **Yes** | Carrier Partner ID (`cp_id`) of the carrier to which this AWB belongs. | 25 | `4` |

---

## Response Structure

The response consists of a `meta` object and a nested `result` object containing tracking information keyed by the AWB number(s).

### Response Meta (`meta`)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **status** | Integer | Status code of the response (HTTP Status codes). |
| **message** | String | Error message (if any errors) or Success message. |
| **success** | Boolean | Whether the request is successful or not. |

### Response Result (`result`) - Top Level
The `result` object contains the tracking data, keyed by the AWB number(s) provided in the request.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **`<AWB>`** | Object | The AWB value itself acts as the key for the tracking data. |

### AWB Object Fields (Inside `<AWB>`)

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **latest_status** | Object | Status object representing the last recorded status of the shipment. |
| **scans** | List[Object] | List of Status Objects, each denoting one scan of the status history of the shipment. |
| **valid** | Boolean | Whether the AWB provided is valid/existing or not. |
| **additional** | Object | An object encapsulating additional details of the shipment. |

---

### Nested Objects

#### 1. Status Objects (`latest_status` and objects within `scans` list)
These objects represent an individual tracking checkpoint/status update.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **timestamp** | String | Time when this status was recorded (Format: `YYYY-MM-DD HH:MM:SS`). |
| **location** | String | Location where this status was recorded. |
| **remark** | String | Remarks/comments regarding this status (e.g., "Shipper unavailable"). |
| **status** | String | Actual status string reported by the carrier. |
| **clickpost_status_code** | Integer | Clickpost's standardized status code of the order. |
| **clickpost_status_description**| String | Description of the Clickpost status code (e.g., "PickupPending"). |
| **clickpost_status_bucket** | Integer | A consolidated ID of the status, used for customer-facing status grouping. |
| **clickpost_status_bucket_description**| String | Description corresponding to the `clickpost_status_bucket` field (e.g., "Order Placed"). |
| **created_at** | String | Timestamp of when the record was created in Clickpost's system. |

#### 2. Additional Details (`additional` object)

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **is_stuck** | Boolean | Whether the shipment is stuck somewhere mid-journey. |
| **order_id** | String | Order Number of the shipment. |
| **sku** | List | List of SKUs of the items in the shipment. |
| **edd** | Object | Object containing details of the Estimated Date of Delivery (SLA information). |
| **invoice_number** | String | Invoice number of the shipment. |
| **pickup_city** | String | City of pickup of the shipment. |
| **drop_city** | String | City of delivery of the shipment. |
| **cod_value** | Float | COD Value of the shipment. |
| **currency_code** | String | Currency code of the shipment. |
| **courier_partner_edd** | String/Null | Estimated date of delivery of the shipment (Format: `YYYY-MM-DD` if not null). |
| **channel_name** | String | Name of the channel through which the order was placed. |
| **qc_images** | List | List of URLs for any images of the product, for use in quality checking. |
| **ndr** | Object | Details regarding the Non-Delivery Report (NDR) status. |
| **courier_partner_id** | Integer | Partner ID of the carrier shipping the order. |
| **courier_name** | String | Name of the carrier shipping the order. |

#### 3. Estimated Delivery Details (`edd` object)

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **min_sla** | Integer | Minimum estimated days of delivery agreed upon by the SLA. |
| **max_sla** | Integer | Maximum estimated days of delivery agreed upon by the SLA. |
| **exact_sla** | Integer/Null | Exact estimated days (if any) of delivery agreed upon by the SLA. |

#### 4. Non-Delivery Report Details (`ndr` object)

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **ndr_bucket_code** | Integer | Clickpost-defined status ID of the NDR status. |
| **ndr_description** | String | Description of the NDR status (e.g., "Customer Unavailable"). |

---

## Sample Response

**200 OK Response (Detailed Scan History)**

```json
{
    "meta": {
        "status": 200,
        "success": true,
        "message": "SUCCESS"
    },
    "result": {
        "4210610508756": {
            "latest_status": {
                "timestamp": "2022-10-31 19:56:16",
                "location": "Faridabad_Mthurard_CP (Haryana)",
                "remark": "Shipment not received from client",
                "status": "Not Picked",
                "clickpost_status_code": 2,
                "clickpost_status_description": "PickupPending",
                "clickpost_status_bucket": 1,
                "clickpost_status_bucket_description": "Order Placed",
                "created_at": "2022-10-27 11:10:28"
            },
            "scans": [
                {
                    "timestamp": "2022-10-31 19:56:16",
                    "location": "Faridabad_Mthurard_CP (Haryana)",
                    "remark": "Shipment not received from client",
                    "status": "Not Picked",
                    "clickpost_status_code": 2,
                    "checkpoint_id": 9629321255,
                    "tracking_id": 493656670,
                    "created_at": "2022-10-31 15:30:31",
                    "clickpost_status_description": "PickupPending",
                    "clickpost_status_bucket": 1,
                    "clickpost_status_bucket_description": "Order Placed"
                },
                {
                    "timestamp": "2022-10-29 19:56:42",
                    "location": "Faridabad_Mthurard_CP (Haryana)",
                    "remark": "Shipper unavailable",
                    "status": "Manifested",
                    "clickpost_status_code": 3,
                    "checkpoint_id": 9577278643,
                    "tracking_id": 493656670,
                    "created_at": "2022-10-29 15:29:30",
                    "clickpost_status_description": "PickupFailed",
                    "clickpost_status_bucket": 1,
                    "clickpost_status_bucket_description": "Order placed"
                },
                {
                    "timestamp": "2022-10-29 09:26:32",
                    "location": "Faridabad_Mthurard_CP (Haryana)",
                    "remark": "Out for Pickup",
                    "status": "Out for Pickup",
                    "clickpost_status_code": 25,
                    "checkpoint_id": 9562545783,
                    "tracking_id": 493656670,
                    "created_at": "2022-10-29 05:45:22",
                    "clickpost_status_description": "OutForPickup",
                    "clickpost_status_bucket": 1,
                    "clickpost_status_bucket_description": "Order placed"
                },
                {
                    "timestamp": "2022-10-28 14:53:24",
                    "location": "Faridabad_Mthurard_CP (Haryana)",
                    "remark": "Pickup scheduled",
                    "status": "Manifested",
                    "clickpost_status_code": 1,
                    "checkpoint_id": 9540836463,
                    "tracking_id": 493656670,
                    "created_at": "2022-10-28 09:49:16",
                    "clickpost_status_description": "OrderPlaced",
                    "clickpost_status_bucket": 1,
                    "clickpost_status_bucket_description": "Order placed"
                },
                {
                    "timestamp": "2022-10-28 14:53:22",
                    "location": "Faridabad_Mthurard_CP (Haryana)",
                    "remark": "Shipment not ready for pickup",
                    "status": "Manifested",
                    "clickpost_status_code": 2,
                    "checkpoint_id": 9540836456,
                    "tracking_id": 493656670,
                    "created_at": "2022-10-28 09:49:16",
                    "clickpost_status_description": "PickupPending",
                    "clickpost_status_bucket": 1,
                    "clickpost_status_bucket_description": "Order Placed"
                },
                {
                    "timestamp": "2022-10-28 12:34:10",
                    "location": "Faridabad_Mthurard_CP (Haryana)",
                    "remark": "Out for Pickup",
                    "status": "Out for Pickup",
                    "clickpost_status_code": 25,
                    "checkpoint_id": 9537993020,
                    "tracking_id": 493656670,
                    "created_at": "2022-10-28 07:58:23",
                    "clickpost_status_description": "OutForPickup",
                    "clickpost_status_bucket": 1,
                    "clickpost_status_bucket_description": "Order placed"
                },
                {
                    "timestamp": "2022-10-27 16:40:32",
                    "location": "Faridabad_Mthurard_CP (Haryana)",
                    "remark": "Pickup scheduled",
                    "status": "Manifested",
                    "clickpost_status_code": 1,
                    "checkpoint_id": 9519481038,
                    "tracking_id": 493656670,
                    "created_at": "2022-10-27 14:16:37",
                    "clickpost_status_description": "OrderPlaced",
                    "clickpost_status_bucket": 1,
                    "clickpost_status_bucket_description": "Order placed"
                },
                {
                    "timestamp": "2022-10-27 16:40:27",
                    "location": "Faridabad_Mthurard_CP (Haryana)",
                    "remark": "Shipment details manifested",
                    "status": "Manifested",
                    "clickpost_status_code": 1,
                    "checkpoint_id": 9519481036,
                    "tracking_id": 493656670,
                    "created_at": "2022-10-27 14:16:37",
                    "clickpost_status_description": "OrderPlaced",
                    "clickpost_status_bucket": 1,
                    "clickpost_status_bucket_description": "Order placed"
                }
            ],
            "valid": true,
            "additional": {
                "is_stuck": false,
                "order_id": "1234556689",
                "sku": [
                    "Footwear"
                ],
                "edd": {
                    "max_sla": 3,
                    "min_sla": 2,
                    "exact_sla": null
                },
                "invoice_number": "ABCD11111",
                "pickup_city": "Delhi",
                "drop_city": "Bangalore",
                "cod_value": 1000.0,
                "currency_code": "INR",
                "courier_partner_edd": null,
                "channel_name": "ABCDEF",
                "qc_images": [],
                "ndr": {
                    "ndr_bucket_code": 1,
                    "ndr_description": "Customer Unavailable"
                },
                "courier_partner_id": 4,
                "courier_name": "Delhivery"
            }
        }
    }
}