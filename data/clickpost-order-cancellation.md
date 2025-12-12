# API Documentation: Cancellation API

## Overview
The Cancellation API provides an easy-to-use method for enterprises to cancel a shipment that was manifested (created) through Clickpost. This is typically used for faster returns or voiding orders before dispatch.

### Use Case
This is a standard API which applies to all **MPS (Multi-Piece Shipment)** and **SPS (Single Piece Shipment)** orders.

### Geography
This is a standard API which supports all shipments created and transported within:
* **India**
* **North America**
* **Europe**
* **Middle East**
* **South East Asia**

---

## Important Notes on Status Updates

* **Tracking Updates Post-Cancellation:** Some carrier partners do not update the tracking status in their tracking APIs after a cancellation request. Consequently, the Clickpost dashboard will not show any update for these shipments.
* **Cancellation Confirmation:** As a standard practice, if you receive an **HTTP Status Code of 200** and the API response contains a `meta` status code of **200** or **600** (`[order already cancelled]`), you can assume the shipment is marked:
    * **Void/Cancelled** if the order was pre-dispatch.
    * **RTOed** (Returned To Origin) if the order was cancelled post-dispatch.
* **Asynchronous Cancellation (Aggregators):** Certain carrier aggregators (like Shiprocket) do not mark the shipment cancelled synchronously (in real-time). In such cases, the API will return a **HTTP Status Code of 202** (Accepted) if the carrier has accepted the request for cancellation and will process it later.

---

## Endpoint Details

**Method:** `GET`
**URL:** `https://www.clickpost.in/api/v1/cancel-order/`

### Query Parameters
This endpoint only takes URL query parameters as input.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **username** | String | **Yes** | Username of your Clickpost account. | 100 | `*****` |
| **key** | String | **Yes** | Unique license key for your Clickpost account. | 100 | `*****` |
| **waybill** | String | **Yes** | Waybill which needs to be cancelled. | 100 | `*****` |
| **cp_id** | Int | **Yes** | Courier Partner ID of the courier from which shipment was dispatched. | - | `44` |
| **account_code** | String | **Yes** | Courier partner account name configured on the Clickpost dashboard. | 100 | `"test_account"` |
| **manually_update_status** | Boolean | Optional | If `True`, Clickpost will manually update the tracking status of AWB to "Cancelled" upon receiving a successful response from the courier partner. | - | `True` |

**Sample URL:**
`GET https://www.clickpost.in/api/v1/cancel-order/?username=*****&key=*****&waybill=*****&account_code=*****`

---

## Response

### Response Types
* Success: Order cancelled successfully
* Success: Order Already Cancelled
* Failure: Invalid/Non-existent Waybill
* Failure: Account does not exist/Invalid carrier partner

### Sample Success Response (HTTP Status 200)

```json
{
    "meta": {
        "message": "SUCCESS",
        "success": true,
        "status": 200
    }
}