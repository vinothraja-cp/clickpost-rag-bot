# API Documentation: Register Shipment for Tracking: V2

## Overview
This API allows enterprises to register an Air Waybill (AWB) for continuous tracking updates with Clickpost. It takes the AWB number, carrier partner ID, shipment details, pick-up and drop information, and additional details as input, returning the unique Clickpost tracking ID in response.

### Applicable Geography
Applicable for **Indian geographies**.

### Use Case
This is a standard API that supports both Multi-Piece Shipments (MPS) and Single Piece Shipments (SPS) orders.

---

## Endpoint Details

**Method:** `POST`
**URL:** `https://www.clickpost.in/api/v2/tracking/awb-register/`

### Body Payload
The payload encapsulates the mandatory details regarding the AWB to be registered, and optional shipment information.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **waybill** | String | **Yes** | AWB to be registered. | 100 | `"TESTAWB00001"` |
| **cp_id** | Integer | **Yes** | Unique integer identifier for the carrier partner in the Clickpost system. | - | `1` |
| **key** | String | **Yes** | Unique license key for the enterprise user provided by Clickpost. | 100 | `"34be9be5-..."` |
| **account_code** | String | **Yes** | Courier partner account name configured on the Clickpost dashboard. | 100 | `"test_account"` |
| **consumer_details** | Object | Optional | Details of the consumer (Name, Phone, Email, etc.). | - | `{...}` |
| **shipment_info** | Object | Optional | Details of the shipment to be registered (Dimensions, Value, Order Type). | - | `{...}` |
| **additional** | Object | Optional | Additional optional fields. | - | `{...}` |

---

## Payload Object Details

### 1. Additional Fields (`additional`)
Optional fields that provide extra details for the order or carrier partner.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **order_date** | String | Date of placing the order (`YYYY-MM-DD` format). | 50 | `"2022-10-01"` |
| **ship_date** | String | Date of shipping the order (`YYYY-MM-DD` format). | 50 | `"2022-10-01"` |
| **language_code** | String | ISO Alpha-3 Language code for the shipment. | 2 | `"eng"` |
| **min_edd** | Integer | Minimum committed estimated delivery duration (in days). | 5 | `2` |
| **max_edd** | Integer | Maximum committed estimated delivery duration (in days). | 5 | `4` |
| **channel_name** | String | The channel through which the order was placed (e.g., Shopify, Unicommerce). | - | `Unicommerce` |
| **zone** | String | Used to club multiple pickup/drop pin-codes for analytics or allocation rules. | - | - |
| **reseller_info** | JSON Object | The reseller information (contains `name` and `phone`). | - | `{"name": "...", "phone": "..."}` |
| **estimated_delivery_date** | Date | Date of estimated delivery. Used to measure carrier performance. Must be in `%Y-%m-%d`, `%Y-%m-%dT%H:%M:%S%z`, or `%Y-%m-%dT%H:%M:%S` format. | - | `"2025-06-14"` |

### 2. Shipment Details (`shipment_info`)
Details regarding package dimensions, value, and payment type.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **items** | List[Object] | List of items to be delivered in the shipment (details explained below). | - | `[{...}]` |
| **height** | Float | Height of the overall package (in cms). | - | `25.25` |
| **breadth** | Float | Width of the overall package (in cms). | - | `45.6` |
| **length** | Float | Length of the overall package (in cms). | - | `75.29` |
| **weight** | Float | Weight of the package (in gms). | - | `500.20` |
| **reference_number** | String | Reference number of the order. Must be unique for every shipment. | 100 | `"TestOrder00001"` |
| **cod_value** | Float | Cash to be given to the carrier. Must be non-zero for COD, and zero for PREPAID. | - | `25.25` |
| **order_id** | String | Identification string for the order. | 100 | `"TestOrderID00001"` |
| **order_type** | String | Type of payment: `"COD"` or `"PREPAID"`. | 10 | `"COD"` |
| **invoice_value** | Float | Value of the shipment as mentioned in the invoice. | - | `256.29` |
| **invoice_date** | String | Date of issuance of the invoice (`YYYY-MM-DD` format). | 100 | `"2022-01-10"` |

### 3. Item Level Details (`items` inside `shipment_info`)
Details for each item unit within the shipment.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **cat** | String | Category of the item. | 50 | `Footwear` |
| **description** | String | Brief description of the item. | 500 | `"Brown Cotton Socks - 1 pair"` |
| **quantity** | Integer | Number of units of the item. | - | `5` |
| **weight** | Float | Weight of each unit of the item. | - | `500` |
| **price** | Float | Price of each unit of the item. | - | `64.99` |
| **sku** | String | Stock-keeping unit of the item. | 100 | `"SKU0001"` |
| **return_days** | Integer | Number of days within which the item can be returned. | 5 | `5` |
| **exchange_days** | Integer | Number of days within which the item can be exchanged. | 5 | `5` |
| **product_url** | String | URL for the product (comma-separated if multiple). | 1000 | `"http://link1.to.product, ..."` |
| **images** | String | URL for the image(s) of the product (comma-separated if multiple). | 1000 | `"http://link.to.product.image1, ..."` |

---

## Sample Request

```json
{
  "waybill": "ABCDRESDEFGHIJKL1257679",
  "cp_id": 1,
  "key": "42d42a34-ae09-4693-b20c-ae2624218a329",
  "account_code": "Fedex Domestic",

  "consumer_details": {
          "name": "Test Customer",
          "phone": "8080808080",
          "email": "test@clickpost.in"
  },
  "shipment_info": {
          "item": "Shirt",
          "order_type": "COD",
          "invoice_value": 1000,
          "reference_number": "123XYZ",
          "length": 10,
          "height": 10,
          "weight": 10,
          "breadth": 10,
          "drop_pincode": "110001",
          "pickup_pincode": "110001",
          "delivery_type": "FORWARD",
          "cod_amount": 1000.10,
          "drop_address": "Roots hacker Home, R 28, Second Floor, Nehru Enclace, Opposite Nehru Place, New Delhi 110001",
          "additional": {
                    "items": [
                        {
                            "sku": "XYZ1",
                            "description": "item1",
                            "quantity": 1,
                            "price": 200,
                            "images": "<Image URL>",
                            "return_days": 2,
                            "additional": {
                                "length": 10,
                                "height": 10,
                                "breadth": 10,
                                "weight": 100
                            }
                        }
                    ]
                  }
  },
  "additional": {
    "order_date": "2017-02-14T18:00:00+05:30",
    "ship_date": "2017-02-14T23:00:00+05:30",
    "min_edd": 2,
    "max_edd": 4,
    "enable_whatsapp": false,
    "estimated_delivery_date": "2025-06-14",
    "order_id": "ORDER-12"
  }
}
Sample Response:
```json
{
    "meta": {
        "status": 200,
        "message": "SUCCESS",
        "success": true
    },
    "result": {
        "consumer_details": {
            "id": 475565855
        },
        "shipment_info": {
            "id": 456652061
        },
        "tracking_id": 494235601,
        "security_key": "35aae392-5009-436a-b29b-7ddb2db518ab"
    }
}