# Clickpost API: Fetch Order Details (India)

**Summary:** This API allows you to fetch the full details of a specific shipment (SPS or MPS) using its Airway Bill (AWB) number and Courier Partner ID.

**Key Use Case:**
* **Polling Async Orders:** If you created an order and received a `102` (Processing) status, you must repeatedly call this API to check if the status has changed to `200` (Success) and retrieve the shipping label.
* **Retrieval:** Fetching the latest status or label URL for any existing domestic shipment.

**Geography:** India Only.

---

## 1. Endpoint Details

* **Method:** `GET`
* **Endpoint:** `/api/v3/create-order/`
* **Full URL:** `https://www.clickpost.in/api/v3/create-order/`

> **Note:** This uses the *same* endpoint URL as the Order Creation API, but the method is **GET** instead of POST.

---

## 2. Query Parameters (Mandatory)

All parameters must be passed in the URL query string.

| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`username`** | String | **Mandatory** | Enterprise username. |
| **`key`** | String | **Mandatory** | Enterprise API License Key. |
| **`awb`** | String | **Mandatory** | The AWB Number of the order you want to fetch. |
| **`cp_id`** | Integer | **Mandatory** | The Courier Partner ID associated with that AWB. |

---

## 3. Example Request

**URL:**
```text
[https://www.clickpost.in/api/v3/create-order/?username=test-enterprise&key=12345-abcde&awb=TESTAWB0001&cp_id=25](https://www.clickpost.in/api/v3/create-order/?username=test-enterprise&key=12345-abcde&awb=TESTAWB0001&cp_id=25)