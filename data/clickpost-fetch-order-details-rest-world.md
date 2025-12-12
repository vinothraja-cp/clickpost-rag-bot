# API Documentation: Fetch Order Details (Rest of the World & Cross-Border)

## Overview
This API is used for retrieving details of an order placed with an international courier. It requires the **waybill (AWB)** and the **courier partner ID**.

This is particularly useful for getting the response for **asynchronous orders** (orders that run in the background instead of real-time) to check their status and retrieve labels or other details.

### Use Case
* **Standard API:** Applies to all **MPS (Multi-Piece Shipment)** and **SPS (Single Piece Shipment)** orders.

### Geography
This API applies to shipments created and transported in:
* **North America**
* **Europe**
* **Middle East**
* **South East Asia**
* **Cross-Border shipments:** Shipments transported from India to any other country in the aforementioned regions, or vice versa.

---

## Endpoint Details

**Method:** `GET`
**URL:** `https://www.clickpost.in/api/v4/create-order/`

### Query Parameters
These parameters must be passed directly in the URL to fetch the specific order details.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **username** | String | Optional | Username of the enterprise. | 100 | `"test-enterprise"` |
| **key** | String | **Mandatory** | Unique license key provided by Clickpost for authentication. | 100 | `"34be9be5-..."` |
| **awb** | String | **Mandatory** | AWB (Waybill) of the order to receive details for. | 100 | `"TESTAWB0001"` |
| **cp_id** | Integer | **Mandatory** | Partner ID of the courier responsible for the shipment. | - | `25` |

**Example Request:**
`GET https://www.clickpost.in/api/v4/create-order/?username=test-enterprise&key=34be9be5-3de8-4223-ad14-d7391159b80e&awb=TESTAWB0001&cp_id=25`

---

## Response Structure

The response consists of a **Meta** object (status/errors) and a **Result** object (data). Additional fields may be present based on specific enterprise/courier requirements.

### Response Meta (`meta`)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **status** | Integer | Status code for the request (HTTP-like status codes). |
| **message** | String | Error or Success messages. |
| **success** | Boolean | `true` if the order details were fetched/created successfully, else `false`. |

### Response Result (`result`)
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| **waybill** | String | The Waybill (AWB) of the order. Automatically registered for tracking. |
| **reference_number** | String | The reference number of the order sent in the original payload. |
| **label** | String/Null | URL to the generated label. Returns `null` if labels are not needed. |
| **commercial_invoice_url** | String | (Certain couriers only) URL to the generated commercial invoice. |
| **courier_partner_id** | Integer | ID of the courier partner. |
| **courier_name** | String | Name of the courier. |
| **sort_code** | String/Null | Courier Partner Sort code (if supported). Used for custom-built labels. |
| **security_key** | String | UUID security key of the order (store this at the enterprise end). |
| **order_id** | Integer | Clickpost Order ID of the shipment. |
| **tracking_id** | Integer | A special ID used for tracking requests. |
| **children** | Object | (MPS Only) A list of item objects with details for each piece. |

---

## Sample Response

**200 OK MPS Response:**

```json
{
    "result": {
        "waybill": "SKY0000006574",
        "reference_number": "Test.SKYEXRVP.Order00002",
        "label": "[https://pyck-res-bucket.s3.amazonaws.com:443/SKYEXPRESS_RVP/2022-10-21/SKY0000006574.pdf](https://pyck-res-bucket.s3.amazonaws.com:443/SKYEXPRESS_RVP/2022-10-21/SKY0000006574.pdf)",
        "courier_partner_id": 325,
        "courier_name": "SkyExpress",
        "sort_code": null,
        "order_id": 147175531,
        "security_key": "4d36d09c-53b3-49f3-beb3-4eb8f884f941",
        "tracking_id": 487501569
    },
    "meta": {
        "status": 200,
        "success": true,
        "message": "Order Placed Successfully"
    }
}

Meta Code,HTTP Code,Description,Actionable,Order Successful?,Status Message
102,200,For async orders: The order has been recorded in Clickpost's database and is under processing.,Need to re-attempt Clickpost's order creation API to check if the order has been processed.,No,-
200,200,The order is successfully created,None,Yes,"""Success"""
301,200,The customer is sending an invalid/non-existent/inactive license key in the URL parameters,Need to re-attempt the order with a valid/registered/active license key.,No,"""Authentication Failed: Invalid Token or API Key"""
302,200,Either of the three things:1. The customer is sending the courier_partner value as a string2. The customer is sending a null value in the courier_partner field.3. The partner ID being sent in courier_partner field does not exist.,"Need to re-attempt the order with a valid integer value in the courier_partner field, and the value should exist in Clickpost's database.",No,"""Invalid Courier Partner Id with Field courier_partner"""
303,200,For async orders: The awb_number provided already exists and is registered by Clickpost,Need to re-attempt the order with a different awb_number value.,Yes,"""Waybill already registered"""
307,200,"The order_type value is anything other than PREPAID, COD or EXCHANGE, or is null.","Need to re-attempt the order with the order_type as either PREPAID, COD or EXCHANGE.",No,"""You have entered invalid Order Type"""
308,200,The priority value is anything other than NORMAL or URGENT.,Need to re-attempt the order with the priority as either NORMAL or URGENT.,No,"""You have entered invalid Order priority"""
309,200,The delivery_type value is anything other than FORWARD or RVP.,Need to re-attempt the order with the delivery_type as either FORWARD or RVP.,No,"""Invalid Delivery Type"""
310,200,In case of RVP orders: This is due to either of the following:1. The rvp_reason field is missing2. The rvp_reason length is more than 500 characters.,Need to re-attempt the RVP order with a non-null rvp_reason value within 500 characters.,No,"""RVP reason is missing"" or ""RVP reason can't be more than 500 chars"""
311,200,"For RVP orders: The courier partner defined by the courier_partner field does not support RVP shipments, or is not an RVP courier.",Need to re-attempt the RVP order with a courier_partner value that supports RVP shipments.,No,"""Invalid Courier Partner For RVP"""
312,200,There is no item data in the payload (in the item field).,Need to retry the order with a non-empty items array.,No,"""Items Data is missing from order details"""
313,200,"Either of the following:1. The item data being sent in the items field is either a string or any other invalid format.2. The items value is an array, but of anything other than objects.3. The items value is an array of objects, but one or more mandatory fields are missing for one or more items.","Need to retry the order with proper items data, as an array of JSON objects.",No,"""Invalid Format of items for Order data"""
314,200,There is an issue with the order data being passed.,The error is captured in the status message. Retry the order after addressing the status message.,No,"""Invalid Format of items for Order data: """
315,200,"Either of the following:1. For a PREPAID order, the cod_value is non-zero.2. For a COD order, the cod_value is zero.",Need to retry the orders after:1. (For PREPAID orders) setting the cod_value to zero.2. (For COD orders) setting the cod_value to a non-zero number,No,"""Invalid Cod Value"""
316,200,"There are no credentials for the courier partner of the account given in account_code, or the credentials are blank.","Need to re-attempt the order with a different account_code, or fill the credential fields in the dashboard and retry.",No,"""You do not have credentials for the Courier Partner"""
319,200,There is an issue in placing orders with the courier partner.,"The actual error generally pops up alongside the error message. In cases where the error message is vague, contact the support team.",No,"""Error In Order Placing To Courier Partner: """
320,200,The enterprise has not subscribed for Clickpost's Order Creation Service.,"Need to subscribe to the order creation service, then retry with all valid details and credentials.",No,"""This service is not subscribed by you"""
321,200,The awb provided in the awb_number field does not exist in Clickpost's database.,"Need to provide a registered AWB, or remove the AWB field and try again.",No,"""Awb Number Does not exist in system for courier partner"""
322,200,There is an issue in the courier partner servers.,"Need to retry after waiting for a while, or get in touch with Clickpost support or the courier partner support.",No,"""Internal Server Error In Courier Partners Server"""
323,200,An order is already present in Clickpost's database with the same reference number as the one provided.,Need to re-attempt the order with a different reference number.,Yes,"""You have already placed this order"""
328,200,Some mandatory field in the POST data might be missing.,Check for missing fields that are supposed to be there in the data and retry.,No,"""Invalid POST data"""
329,200,The connection to the courier partner's API timed out.,"Need to retry after waiting for a while, or get in touch with Clickpost support or the courier partner support.",No,"""Courier Partner API timeout"""
351,200,The account name of the courier partner account given in the account_code field does not exist for the enterprise user.,"The user needs to check either/all of the things below if they are correct:1. Enterprise license key in the URL params2. Courier Partner ID in the courier_partner field.3. Account name in the account_code field, and whether this account exists for this courier partner.Re-attempt the order after correcting any of the incorrect details mentioned above.",No,"""Clickpost Account: Does not exist"""
352,200,There are multiple accounts of the same enterprise with the same courier partner with the same name as the one in account_code field.,-,No,"""Multiple account exists"""
353,200,The account mentioned in the account_code field is inactive.,"Need to either enable the account on the dashboard from the enterprise's end, or use an active account.",No,"""Clickpost Account: Inactive"""
354,200,There is an unhandled error from the courier partner's end.,"The error is typically visible in the status message and can be fixed accordingly. In case of vague error messages, get in touch with the support team.",No,"""Unhandled error! Contact support@clickpost.in"" or the actual error"
355,200,In certain couriers the vendor_code field is required. This error pops up whenever vendor_code is not passed in the payload.,Need to pass the vendor_code field alongwith a registered vendor code.,No,"""Vendor code not found"""
400,200,"There is an issue with the payload, or some invalid data is being sent in the request.","Need to fix the issues in the payload as mentioned in the status message. If ""Bad Request"" pops up, get in touch with the support team.",No,"""Bad Request"" or the actual error"
500,200,There is an error in Clickpost's servers.,"Need to wait a while and try again. If this error pops up even after multiple tries, get in touch with the support team.",No,"""Oops! Internal server error in Clickpost"""