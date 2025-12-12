# API Documentation: Pincode Carrier Serviceability

## Overview
This API allows enterprises to determine carrier serviceability between a specified pickup and drop pincode. The response provides an array of all serviceable courier partners, their corresponding shipping charges, and committed Service Level Agreements (SLAs).

### Key Functionality
* Determine if a carrier partner services the given `pickup_pincode` and `drop_pincode`.
* Determine availability of services: **COD** (Cash on Delivery), **PREPAID**, or **EXCHANGE**.
* Get the **shipping charge** for serviceable carrier partners (if shipment details are provided).
* Obtain the **committed SLA** (Service Level Agreement) in days.
* Enables enterprises to trigger order creation/manifestation based on the serviceability response.

### Use Case
This is a standard API which applies to all **MPS (Multi-Piece Shipment)** and **SPS (Single Piece Shipment)** orders.

### Geography
This is a standard API which supports all shipments created and transported within **India**.

---

## Important Notes

* The API will return an array of carrier partners **only** if at least one service type (**COD**, **PREPAID**, or **EXCHANGE**) is available for that partner.
* The `comitted_sla` field is populated only when the SLA has been uploaded and the service is enabled for the carrier.
* The fields `shipping_charge` and `zone` are only returned where pricing has been configured at the carrier level.

---

## Request Payload

### Mandatory Fields

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **drop_pincode** | string | **Yes** | The drop pincode for which serviceability needs to be ascertained. | 6 char | `380001` |
| **pickup_pincode** | string | **Yes** | The pickup pincode for which serviceability needs to be ascertained. | 6 char | `380015` |

### Optional Fields (`optional` parameters)

These fields become **mandatory** if the enterprise wants to calculate `shipping_charge`.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **length** | float | Optional | The length of the shipment in centimeter. | 8 | `10.25` |
| **breadth** | float | Optional | The breadth/width of the shipment in centimeter. | 8 | `20.50` |
| **height** | float | Optional | The height of the shipment in centimeter. | 8 | `20.50` |
| **invoice_value** | float | Optional | The invoice value of the shipment in INR. | 10 | `200.75` |
| **weight** | float | Optional | The weight of the shipment in kilograms. | 8 | `2.75` |
| **cp_id** | num | Optional | Carrier Partner ID. If provided, the API returns serviceability for *only* that particular carrier. | 4 | `44` |
| **service_type** | enum | Optional | The order type for which serviceability needs to be determined.<br>Enter **FORWARD** (delivery to customer) or **RVP** (pickup from customer). | 7 | `FORWARD` |

---

## Response Structure

The response returns a `meta` object and a `result` array containing serviceable carriers.

### Meta (`meta` parameters)

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **success** | Boolean | Indicates the success of the API request. | `true` |
| **message** | String | The message from Clickpost. Returns `"SUCCESS"` or `"Pin code not serviceable"`. | `"SUCCESS"` |
| **status** | HTTP Code | The HTTP response status code of the API request. | `200` |

### Result (`result` parameters)

The result is an array of objects, where each object represents a serviceable carrier partner.

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **cp_id** | num | Carrier Partner ID. | `4` |
| **service_type** | String | The order type supported by this carrier for the given pincodes (`FORWARD` or `RVP`). | `FORWARD` |
| **account_code** | num | The account code configured for the carrier partner. | `Bluedart Surface` |
| **account_id** | num | The identifier for the particular carrier account. | `1938` |
| **serviceable** | Object | Object detailing which order types are serviceable. | `{...}` |
| **comitted_sla** | Object | Object detailing the committed SLA in days. | `{...}` |
| **shipping_charge** | Object | Object detailing the calculated shipping charges in INR. | `{...}` |
| **zone** | Object | Object detailing the mapped zone. | `{...}` |

---

## Nested Response Objects

### 1. Serviceable (`serviceable` parameters)

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **COD** | Boolean | Field indicates whether **Cash on Delivery** is supported. | `true` |
| **PREPAID** | Boolean | Field indicates whether **Prepaid** is supported. | `true` |
| **EXCHANGE** | Boolean | Field indicates whether **Exchange** is supported. | `true` |

### 2. Committed SLA (`comitted_sla` parameters)

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **comitted_sla** | num | The committed Service Level Agreement that is given the corresponding carrier partner in **days**. | `3` |

### 3. Shipping Charge (`shipping_charge` parameters)

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **PREPAID** | float | Shipping Charges in INR for **Prepaid** type shipments. | `50.50` |
| **COD** | float | Shipping Charges in INR for **Cash on Delivery** type shipments. | `50.50` |

### 4. Zone (`zone` parameters)

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **zone** | string | The zone which has been mapped with pincodes on the Clickpost dashboard under the carrier integration section. | `"North"` |