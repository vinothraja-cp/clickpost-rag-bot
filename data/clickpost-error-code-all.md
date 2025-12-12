# Consolidated Clickpost Error & Status Codes

# Clickpost API Error Codes Reference

**Summary:** This document lists all possible Status Codes returned in the `meta` object of Clickpost API responses.

**Understanding the Response:**
* **HTTP Status:** The standard web protocol status (e.g., 200 OK, 500 Server Error).
* **Meta Status:** The specific business logic code returned inside the JSON response body (e.g., `{"meta": {"status": 301}}`). **Always check this code for debugging.**

---

Based on the various Order Creation and Tracking APIs (V2, V3, V4) provided, this table lists all possible status codes appearing in the response's `meta` object, their detailed descriptions, and necessary actionables.

| Meta Code | HTTP Code | Order Successful? | Status Message | Description | Actionable |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **102** | 200 | No | - | For async orders: The order has been recorded in Clickpost's database and is under processing. | Need to re-attempt Clickpost's order creation API to check if the order has been processed. |
| **200** | 200 | **Yes** | "Success" | The order is successfully created/fetched. | None. |
| **301** | 200 | No | "Authentication Failed: Invalid Token or API Key" | The customer is sending an invalid/non-existent/inactive license key in the URL parameters. | Need to re-attempt the order with a valid/registered/active license key. |
| **302** | 200 | No | "Invalid Courier Partner Id with Field courier_partner" | **Invalid Carrier Partner ID** (value is string, null, or ID does not exist). | Need to re-attempt the order with a valid integer value in the `courier_partner` field, and the value should exist in Clickpost's database. |
| **303** | 200 | **Yes** | "Waybill already registered" | For async orders: The `awb_number` provided already exists and is registered by Clickpost. | Need to re-attempt the order with a different `awb_number` value. |
| **307** | 200 | No | "You have entered invalid Order Type" | The `order_type` value is anything other than `PREPAID`, `COD` or `EXCHANGE`, or is `null`. | Need to re-attempt the order with the `order_type` as either `PREPAID`, `COD` or `EXCHANGE`. |
| **308** | 200 | No | "You have entered invalid Order priority" | The `priority` value is anything other than `NORMAL` or `URGENT`. | Need to re-attempt the order with the `priority` as either `NORMAL` or `URGENT`. |
| **309** | 200 | No | "Invalid Delivery Type" | The `delivery_type` value is anything other than `FORWARD` or `RVP`. | Need to re-attempt the order with the `delivery_type` as either `FORWARD` or `RVP`. |
| **310** | 200 | No | "RVP reason is missing" or "RVP reason can't be more than 500 chars" | For RVP orders: The `rvp_reason` field is missing or its length is more than 500 characters. | Need to re-attempt the RVP order with a non-null `rvp_reason` value within 500 characters. |
| **311** | 200 | No | "Invalid Courier Partner For RVP" | For RVP orders: The courier partner defined by the `courier_partner` field does not support RVP shipments. | Need to re-attempt the RVP order with a `courier_partner` value that supports RVP shipments. |
| **312** | 200 | No | "Items Data is missing from order details" | There is no item data in the payload (in the `item` field). | Need to retry the order with a non-empty `items` array. |
| **313** | 200 | No | "Invalid Format of items for Order data" | **Invalid Items Format:** Item data is string/invalid format, or mandatory item fields are missing. | Need to retry the order with proper `items` data, as an array of JSON objects. |
| **314** | 200 | No | "Invalid Format of items for Order data: " | There is an issue with the order data being passed. | The error is captured in the status message. Retry the order after addressing the status message. |
| **315** | 200 | No | "Invalid Cod Value" | **COD/PREPAID Mismatch:** For PREPAID order, `cod_value` is non-zero, or for COD order, `cod_value` is zero. | Retry the orders after setting `cod_value` correctly (zero for PREPAID, non-zero for COD). |
| **316** | 200 | No | "You do not have credentials for the Courier Partner" | There are no credentials for the courier partner of the account given in `account_code`, or the credentials are blank. | Need to re-attempt the order with a different `account_code`, or fill the credential fields in the dashboard and retry. |
| **319** | 200 | No | "Error In Order Placing To Courier Partner: " | There is an issue in placing orders with the courier partner. | The actual error generally pops up alongside the error message. In cases where the error message is vague, contact the support team. |
| **320** | 200 | No | "This service is not subscribed by you" | The enterprise has not subscribed for Clickpost's Order Creation Service. | Need to subscribe to the order creation service, then retry with all valid details and credentials. |
| **321** | 200 | No | "Awb Number Does not exist in system for courier partner" | The AWB provided in the `awb_number` field does not exist in Clickpost's database. | Need to provide a registered AWB, or remove the AWB field and try again. |
| **322** | 200 | No | "Internal Server Error In Courier Partners Server" | There is an issue in the courier partner servers. | Need to retry after waiting for a while, or get in touch with Clickpost support or the courier partner support. |
| **323** | 200 | **Yes** | "You have already placed this order" | An order is already present in Clickpost's database with the same reference number as the one provided. | Need to re-attempt the order with a different reference number. |
| **328** | 200 | No | "Invalid POST data" | Some mandatory field in the POST data might be missing. | Check for missing fields that are supposed to be there in the data and retry. |
| **329** | 200 | No | "Courier Partner API timeout" | The connection to the courier partner's API timed out. | Need to retry after waiting for a while, or get in touch with Clickpost support or the courier partner support. |
| **351** | 200 | No | "Clickpost Account: Does not exist" | The account name given in the `account_code` field does not exist for the enterprise user/partner. | Check license key, Partner ID, and Account name, and re-attempt the order after correcting. |
| **352** | 200 | No | "Multiple account exists" | There are multiple accounts of the same enterprise with the same courier partner with the same name as the one in `account_code` field. | - |
| **353** | 200 | No | "Clickpost Account: Inactive" | The account mentioned in the `account_code` field is inactive. | Need to either enable the account on the dashboard from the enterprise's end, or use an active account. |
| **354** | 200 | No | "Unhandled error! Contact support@clickpost.in" or the actual error | There is an unhandled error from the courier partner's end. | The error is typically visible in the status message and can be fixed accordingly. In case of vague error messages, get in touch with the support team. |
| **355** | 200 | No | "Vendor code not found" | In certain couriers the `vendor_code` field is required but was not passed in the payload. | Need to pass the `vendor_code` field alongwith a registered vendor code. |
| **400** | 200 | No | "Bad Request" or the actual error | There is an issue with the payload, or some invalid data is being sent in the request. | Need to fix the issues in the payload as mentioned in the status message. If "Bad Request" pops up, get in touch with the support team. |
| **500** | 200 | No | "Oops! Internal server error in Clickpost" | There is an error in Clickpost's servers. | Need to wait a while and try again. If this error pops up even after multiple tries, get in touch with the support team. |



## Clickpost API Success & Async Processing

| Meta Status | Description | Scenario | Actionable |
| :--- | :--- | :--- | :--- |
| **200** | **Success** | The order was successfully created or the request was fulfilled. | Store the `waybill`, `label_url`, and `order_id` from the result. |
| **102** | **Processing** | (Async Orders) The request is accepted and is being processed in the background. | **Poll the API:** Use the "Fetch Order" endpoint repeatedly until you get a 200 or failure code. |
| **202** | **Registered** | (Async Orders) Request queued successfully. | Similar to 102. Poll the API with the same `reference_number` to check status. |

---

## Clickpost API Authentication & Account Configuration

| Meta Status | Description | Actionable |
| :--- | :--- | :--- |
| **301** | **Authentication Failed** | Check your URL Query Parameters. Ensure `username` and `key` are correct and active. |
| **316** | **No Credentials for Courier** | You have not configured credentials for this carrier in the Clickpost Dashboard. Login to Dashboard > Carrier Configuration > Add Credentials. |
| **320** | **Service Not Subscribed** | Your enterprise account is not enabled for the Order Creation Service. Contact Clickpost Support. |
| **351** | **Account Does Not Exist** | The `account_code` passed in the payload does not exist for the `courier_partner` ID provided. Check spelling and mapping. |
| **352** | **Multiple Accounts Exist** | Rare error. Multiple accounts share the same name/ID. Contact Support to resolve duplication. |
| **353** | **Account Inactive** | The carrier account is disabled in the Clickpost Dashboard. Enable it to proceed. |

---

## Clickpost API Data Validation (General)

| Meta Status | Description | Actionable |
| :--- | :--- | :--- |
| **302** | **Invalid Courier Partner ID** | `courier_partner` must be a valid **Integer** (e.g., 123). Do not send strings or nulls. |
| **307** | **Invalid Order Type** | `order_type` must be strictly `"PREPAID"`, `"COD"`, or `"EXCHANGE"`. |
| **308** | **Invalid Priority** | `priority` must be `"NORMAL"` or `"URGENT"`. |
| **309** | **Invalid Delivery Type** | `delivery_type` must be strictly `"FORWARD"` or `"RVP"`. |
| **312** | **Items Data Missing** | The `items` array inside `shipment_details` cannot be empty. |
| **313** | **Invalid Item Format** | `items` must be a list of objects. Check your JSON structure. |
| **315** | **Invalid COD Value** | **Logic Mismatch:**<br>1. If `order_type` is "PREPAID", `cod_value` MUST be 0.<br>2. If `order_type` is "COD", `cod_value` MUST be > 0. |
| **328** | **Invalid POST Data** | Mandatory fields (Name, Phone, Address, Pin Code) are missing. Check the schema. |
| **400** | **Bad Request** | Malformed JSON or invalid data types (e.g., sending a string for `weight`). |

---

## Clickpost API Reverse Shipment (RVP) Specifics

| Meta Status | Description | Actionable |
| :--- | :--- | :--- |
| **310** | **RVP Reason Missing** | If `delivery_type` is "RVP", you **MUST** provide `additional.rvp_reason` (max 500 chars). |
| **311** | **Invalid Courier for RVP** | The selected `courier_partner` does not support Reverse Pickups. Choose a different carrier. |

---

## Clickpost API Carrier, AWB & Processing Errors

| Meta Status | Description | Actionable |
| :--- | :--- | :--- |
| **303** | **Waybill/Ref Already Registered** | The `awb_number` or `reference_number` provided already exists in the system. Use a unique value. |
| **321** | **AWB Does Not Exist** | (Fetch API) The `awb` you are trying to fetch was never created or does not belong to your account. |
| **322** | **Internal Carrier Error** | The Courier Partner's server returned a 500 error. Retry after some time. |
| **323** | **Duplicate Order** | An order with this `reference_number` already exists. |
| **329** | **Carrier API Timeout** | The carrier took too long to respond. Retry the request. |
| **354** | **Unhandled Carrier Error** | The carrier returned an error message that Clickpost doesn't recognize. Check the `message` field for details. |
| **355** | **Vendor Code Missing** | The selected carrier (e.g., FedEx) requires a `vendor_code`. Add it to the payload. |

---

## Clickpost API Server Errors

| Meta Status | Description | Actionable |
| :--- | :--- | :--- |
| **500** | **Internal Server Error** | An error occurred on Clickpost's side. Wait for 1-2 minutes and retry. If persistent, contact `support@clickpost.in`. |
| **420** | **Failed (Async)** | (B2B API) The asynchronous order creation failed after processing. Check the message for specific validation errors. |