# API Documentation: Register Shipment for Tracking: V3

## Overview
Using this API, enterprises can register an AWB for tracking updates with Clickpost. It takes the AWB number, carrier partner ID, shipment information, pick-up and drop information, and additional details as input, returning the Clickpost tracking ID in response.

### Applicable Geography
This applies to shipments created and transported within:
* **North America**
* **Europe**
* **Middle East**
* **South-East Asia**
* **Cross-border shipments**

### Use Case
This is a standard API that applies to all **MPS (Multi-Piece Shipment)** and **SPS (Single Piece Shipment)** orders.

---

## Endpoint Details

**Method:** `POST`
**Path:** `<https://www.clickpost.in/api/v3/tracking/awb-register/?key=>`

### Query Parameters

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **key** | String | **Yes** | Unique license key for the enterprise user provided by Clickpost. | 100 | `"34be9be5-3de8-4223-ad14-000000000000"` |

### Body Payload
Payload encapsulates details regarding the AWB to be registered, and its details.

| Field Name | Data Type | Mandatory | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **waybill** | String | **Yes** | AWB to be registered. | 100 | `"TESTAWB00001"` |
| **courier_partner** | Integer | **Yes** | Unique identifier (Integer value) for the carrier partner in the Clickpost system. | - | `215` |
| **account_code** | String | **Yes** | Courier partner account name configured on the Clickpost dashboard. | 100 | `"test_account"` |
| **shipment_info** | Object | Optional | Details of the shipment to be registered. | - | - |
| **pickup_info** | Object | Optional | Details for pickup of the shipment. | - | - |
| **drop_info** | Object | Optional | Details for delivery of the shipment. | - | - |
| **additional** | Object | Optional | Additional optional fields. | - | - |

---

## Payload Object Details

### 1. Pickup Info (`pickup_info`)
This object takes in the data for the warehouse/pickup location for the shipment.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **lat** | Float | Latitude of the pickup location. | - | `45.12211` |
| **long** | Float | Longitude of the pickup location. | - | `88.12342` |
| **name** | String | Contact name of the consignor of the shipment. | 100 | `"John Smith"` |
| **address** | String | Address of the pickup location. | 500 | `"123, ABC Street"` |
| **district** | String | District of the pickup location. | 100 | `"Nadia"` |
| **city** | String | City of the pickup location. | 100 | `"Frankfort"` |
| **state** | String | State/province of the pickup location. | 100 | `"Ohio"` |
| **landmark** | String | Landmarks to help find the pickup location. | 500 | `"Near XYZ Towers"` |
| **email** | String | Email of the pickup contact. | 50 | `"abc@xyz.com"` |
| **phone** | String | Contact number of the pickup contact. | 11 | `"9876543210"` |
| **phone_code** | String | Country calling codes or country dial-in codes. | 5 | `"+91"` |
| **time** | String | Time of pickup for the order (Format: `YYYY-MM-DDTHH:MM:SS`). | - | `2022-01-10T10:02:33` |
| **postal_code** | String | Postal code of the pickup location. | 10 | `"L4YG6C"` |
| **country_code** | String | Alpha ISO-2 country code of the pickup location. | 2 | `"CA"` |

### 2. Drop Info (`drop_info`)
This object takes in the data for the delivery/consignee location for the shipment.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **lat** | Float | Latitude of the drop location. | - | `45.12211` |
| **long** | Float | Longitude of the drop location. | - | `88.12342` |
| **name** | String | Contact name of the consignee of the shipment. | 100 | `"John Smith"` |
| **address** | String | Address of the drop location. | 500 | `"123, ABC Street"` |
| **district** | String | District of the drop location. | 100 | `"Nadia"` |
| **city** | String | City of the drop location. | 100 | `"Frankfort"` |
| **state** | String | State/province of the drop location. | 100 | `"Ohio"` |
| **landmark** | String | Landmarks to help find the drop location. | 500 | `"Near XYZ Towers"` |
| **email** | String | Email of the drop contact. | 50 | `"abc@xyz.com"` |
| **phone** | String | Contact number of the drop contact. | 11 | `"9876543210"` |
| **time** | String | Estimated time of drop for the order (Format: `YYYY-MM-DDTHH:MM:SS`). | - | `2022-01-10T10:02:33` |
| **postal_code** | String | Postal code of the drop location. | 10 | `"L4YG6C"` |
| **country_code** | String | Alpha ISO-2 country code of the drop location. | 2 | `"CA"` |

### 3. Additional Fields (`additional`)
Optional fields that provide extra details for the order.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **order_date** | String | Date of placing the order (`YYYY-MM-DD` format). | 50 | `"2022-10-01"` |
| **ship_date** | String | Date of shipping the order (`YYYY-MM-DD` format). | 50 | `"2022-10-01"` |
| **language_code** | String | ISO 639-2 Code. | 2 | `"eng"` |
| **min_edd** | Integer | Minimum committed estimated delivery duration (in days) of the shipment. | - | `5` |
| **max_edd** | Integer | Maximum committed estimated delivery duration (in days) of the shipment. | - | `5` |
| **estimated_delivery_date** | Date | Date of estimated delivery. Used to measure carrier performance. Formats: `%Y-%m-%d`, `%Y-%m-%dT%H:%M:%S%z`, or `%Y-%m-%dT%H:%M:%S`. | - | `"2025-06-14"` |

### 4. Shipment Details (`shipment_info`)
Details regarding all items, package dimensions, value, and payment type.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **items** | List[Object] | List of items to be delivered in the shipment. | - | `[{...}]` |
| **height** | Float | Height of the overall package (in cms). | - | `25.25` |
| **breadth** | Float | Width of the overall package (in cms). | - | `45.6` |
| **length** | Float | Length of the overall package (in cms). | - | `75.29` |
| **weight** | Float | Weight of the package (in gms). | - | `500.20` |
| **reference_number** | String | Reference number of the order. Must be unique for every shipment. | 100 | `"TestOrder00001"` |
| **cod_value** | Float | Cash to be given to the carrier. Non-zero for COD, zero for PREPAID. | - | `25.25` |
| **order_id** | String | ID of the order. | 100 | `"TestOrderID00001"` |
| **order_type** | String | Type of payment: `"COD"` or `"PREPAID"`. | 10 | `"COD"`/`"PREPAID"` |
| **invoice_value** | Float | Value of the shipment as mentioned in the invoice. | - | `256.29` |
| **invoice_date** | String | Date of issuance of the invoice (`YYYY-MM-DD` format). | 100 | `2022-01-10` |

### 5. Item Level Details (`items` inside `shipment_info`)
The details for each item to be delivered.

| Field Name | Data Type | Description | Max Length | Example |
| :--- | :--- | :--- | :--- | :--- |
| **cat** | String | Category of the item in question. | 50 | `Footwear` |
| **description** | String | Brief description of the item. | 500 | `"Brown Cotton Socks - 1 pair"` |
| **quantity** | Integer | Number of units of the item. | - | `5` |
| **weight** | Float | Weight of each unit of the item. | - | `500` |
| **price** | Float | Price of each unit of the item. | - | `64.99` |
| **manufacture_country_code**| String | Alpha-2 ISO Country code of manufacture of the item. | 2 | `"CA"` |
| **manufacture_country**| String | Full country name of manufacture of the item. | 100 | `"Canada"` |
| **sku** | String | Stock-keeping unit of the item. | 100 | `"SKU0001"` |
| **return_days** | Integer | Number of days within which the item can be returned. | - | `5` |
| **exchange_days** | Integer | Number of days within which the item can be exchanged. | - | `5` |
| **product_url** | String | URL for the product (comma-separated if multiple). | 1000 | `"http://link1.to.product, ..."` |
| **images** | String | URL for the image(s) of the product (comma-separated if multiple). | 1000 | `"http://link.to.product.image1, ..."` |
| **extras** | Dict | Any custom data in key-value pair format (e.g., Brand data, HSN Code). | 1000 | `{"brand":"Tesla"}` |

---

## Sample Request

```json
{
   "waybill":"ABCDEFGHIJKL0001",
   "courier_partner":246,
   "account_code":"test.skip.mps.rvp",
   "shipment_info":{
      "order_type":"COD",
      "invoice_value":"12345",
      "cod_amount":"1000",
      "currency_code":"SAR",
      "reference_number":"123XYZ",
      "order_id":"order_id of the shipment",
      "length":10,
      "height":10,
      "weight":10,
      "breadth":10,
      "items":[
          {
             "sku":"XYZ1",
             "description":"item1",
             "quantity":1,
             "price":200,
             "images":"<Image URL>",
             "return_days":2,
             "length":10,
             "height":10,
             "breadth":10,
             "weight":100,
             "extra":{
                "brand":"Tesla",
                "cat":"Electronic Vehicle"
             }
          }
      ]
   },
   "pickup_info":{
      "name":"DEFG",
      "email":"defg@aaa.com",
      "phone_code":"966",
      "phone":"1234567890",
      "address":"Some Address",
      "postal_code":"JK0701",
      "city":"Riyadh",
      "district":"XYZ",
      "state":"Al-Riyadh",
      "country_code":"SA",
      "lat":10.01,
      "long":10.2
   },
   "drop_info":{
      "name":"ABCD",
      "email":"abcd@def.com",
      "phone_code":"966",
      "phone":"9876443210",
      "address":"ABCD TOWERS",
      "postal_code":"JK0703",
      "city":"JK0703",
      "district":"XYZ",
      "state":"Al-Riyadh",
      "country_code":"AE",
      "lat":10.01,
      "long":10.01
   },
   "additional":{
      "enable_whatsapp":false,
      "order_date":"2017-02-14",
      "ship_date":"2017-02-14",
      "min_edd":2,
      "max_edd":4,
      "estimated_delivery_date": "2025-06-14",
      "language_code":"eng"
   }
}
Sample Response:
```json
{
    "meta": {
        "status": 200,
        "message": "Success",
        "success": true
    },
    "result": {
        "tracking_id": 491179766,
        "security_key": "067238b4-7e55-4d4d-92d1-1a72028e5b64"
    }
}