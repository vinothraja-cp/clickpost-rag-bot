# API Documentation: Custom Order Creation Fields for Certain Carrier Partners

## Overview
Clickpost has integrated over 300+ courier partners (as of 31st October 2022). While Clickpost's standard Order Creation APIs cover most needs, certain carrier partners require **extra fields** that enterprises must send in the payload to successfully create a shipment.

---

## Table of Custom Fields for Indian and International Couriers

The following table details the custom fields, the courier partners that require them, the parent JSON object they belong to, data types, and specific requirements.

| Courier Partners (Partner ID) | Field Name | Parent Object | Data Type | Description | Max Length | Example | Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Delhivery (4)<br>Delhivery RVP (25)<br>Loadshare (50) | `reseller_name` | `shipment_details` | String | Name of the reseller of the order. If not found, Clickpost sends the `name` value from `pickup_info`. | 100 | `"Mr. ABC"` | Optional |
| Delhivery (4)<br>Shipsy (150)<br>XpressBees (6)<br>EcomExpress (3)<br>Smartr (250) | `otp_based_delivery` | `additional` | Boolean | Whether the delivery requires OTP authentication from the end-customer. | - | `true`/`false` | Optional |
| Delhivery (4) | `exchange_address` | `additional` | String | For exchange orders, the address where the old item will be sent for exchange. | 500 | `"123, ABC Street"` | Optional |
| Delhivery (4) | `exchange_city` | `additional` | String | For exchange orders, the city where the old item will be sent for exchange. | 100 | `"Mumbai"` | Optional |
| Delhivery (4) | `exchange_state` | `additional` | String | For exchange orders, the state where the old item will be sent for exchange. | 100 | `"Maharashtra"` | Optional |
| Delhivery (4) | `exchange_country` | `additional` | String | Alpha-2 ISO country code where the old item will be sent for exchange. | 2 | `"IN"` | Optional |
| Delhivery (4) | `exchange_pincode` | `additional` | String | Pincode where the old item will be sent for exchange. | 10 | `"400019"` | Optional |
| Delhivery (4) | `exchange_shipment_description` | `additional` | String | Description of the shipment to be exchanged. | 100 | `"XYZ Brand T-Shirts, Size L, 10 Pcs"` | Optional |
| Delhivery (4)<br>Delhivery RVP (25) | `booking_id` | `shipment_details` | String | Booking ID of the shipment. | 100 | `"TESTBOOKING00001"` | Optional |
| Delhivery (4)<br>Delhivery RVP (25)<br>EKart (55) | `is_fragile` | `shipment_details` | Boolean | Whether the shipment has fragile components (Defaults to `false`). | - | `true`/`false` | Optional |
| Delhivery (4)<br>Delhivery RVP (25)<br>EKart (55)<br>EcomExpress (3) | `is_dangerous` | `shipment_details` | Boolean | Whether the shipment has inflammable/reactive or dangerous items (Defaults to `false`). | - | `true`/`false` | Optional |
| EcomExpress (3) | `inv_url` | `additional` | String | Invoice URL of the order. | - | - | Optional |
| EcomExpress (3) | `pickup_type` | `additional` | String | Acceptable values: `"WH"` (warehouse pickup) / `"SL"` (seller/marketplace pickup). | 2 | `"WH"`/`"SL"` | Optional |
| EcomExpress (3) | `seller_name` | `gst_info` | String | Name of the seller of the item. Required for multi-seller shipments. | 100 | `"Mr. XYZ"` | Conditional Mandatory |
| XpressBees RVP (41) | `template_id` | `additional` | String | ID of the template to be used for Quality Check of the returned items. | 100 | - | Optional |
| XpressBees RVP (41) | `template_category` | `additional` | String | Category of the template being used for Quality Check. | 100 | - | Optional |
| XpressBees RVP (41) | `drop_alternate_phone` | `drop_info` | String | Alternate phone number of the delivery contact. | 12 | `"9876543210"` | Optional |
| XpressBees RVP (41)<br>Bluedart RVP (28) | `invoice_reference` | `items->gst_info` or `gst_info` | String | Reference number for the invoice (in case of multi-seller shipments). | 100 | `"TESTINV00011"` | Conditional Mandatory |
| XpressBees RVP (41)<br>Shadowfax RVP (11) | `brand` | `shipment_details->items` | String | Brand of the item (for QC check). | 100 | `"ABC Brand"` | Optional |
| XpressBees RVP (41)<br>Shadowfax RVP (11) | `color` | `shipment_details->items` | String | Color of the item (for QC Check). | 100 | `"Blue"` | Optional |
| XpressBees RVP (41)<br>Shadowfax RVP (11) | `size` | `shipment_details->items` | String | Size of the item. | 100 | `"XXL"` | Optional |
| Bluedart (5)<br>Bluedart RVP (28) | `categories` | `additional` | String | Comma-separated list of categories of the items being shipped. | 100 | `"Footwear, Toys, Gadgets"` | Optional |
| Bluedart (5)<br>Bluedart RVP (28) | `otp_code` | `additional` | String | Predefined OTP to be confirmed with the customer for Last-Mile shipments. | 10 | `"1234"` | Optional |
| EKart (55),<br>Shadowfax RVP (11) | `serial_no` | `shipment_details->items` | String | Serial number of the item. | 20 | `"11223344"` | Optional |
| Fareye (31) | `fareye_store_id` | `additional` | String | Store ID registered by the enterprise with Fareye. | 20 | `"fareyestore1"` | Optional |
| Fareye (31) | `fareye_order_type` | `additional` | String | Order type of the shipment being placed with Fareye. | 20 | - | Optional |
| Aramex (2) | `duty_fee_paid_by` | `additional` | String | Denotes which party pays duty fees: `"R"` (Receiver) or `"S"` (Shipper). Defaults to `"R"`. | 1 | `"R"` | Optional |
| Aramex (2),<br>DHL International (145)<br>DHL International Reverse (159) | `cod_currency_code` | `shipment_details` | String | 3-letter currency code for COD orders (if different from `currency_code`). | 3 | `"SAR"` | Optional |
| DHL International (145)<br>DHL International Reverse (159) | `manufacture_country` | `shipment_details->items` | String | Full Name of the country of manufacture of the item. | 100 | `"India"` | Optional |
| DHL International (145)<br>DHL International Reverse (159) | `manufacture_country_code` | `shipment_details->items` | String | Alpha-2 ISO Code of the country of manufacture of the item. | 2 | `"IN"` | Mandatory |
| DHL International (145)<br>DHL International Reverse (159) | `hs_code` | `shipment_details->items` | String | Harmonized system code of the item. | 100 | `"1234.56.78"` | Mandatory |
| DHL International (145)<br>DHL International Reverse (159)<br>DHL India Cross Border MPS (326) | `inbound_hs_code` | `shipment_details->items` | String | Inbound HSN Code (HSN Code for the country of import). | - | - | Optional |
| DHL International (145)<br>DHL International Reverse (159) | `insured` | `additional` | Boolean | Whether the shipment is insured (Defaults to `false`). | - | `true`/`false` | Optional |
| DHL International (145)<br>DHL International Reverse (159) | `customer_id_number` | `additional` | String/Boolean | Customer ID number who will be using the API (Defaults to `false`). | 100 | `"TESTCUSTOMER0001"` | Optional |
| DHL International (145)<br>DHL International Reverse (159) | `insurance_amount` | `additional` | Float | Insurance amount of the shipment (Only applicable when `insured` is `true`, defaults to 0). | - | `25.20` | Conditional Optional |
| All International Fedex/DHL/Bluedart<br>(IDs: 145, 159, 213, 168, 199, 200, 198, 326, 330) | `invoice_base_64` | `additional` | String/Null | Base64 representation of the invoice of the order (Commercial invoice for cross-border, normal for others). Defaults to `null`. | 1000 | - | Conditional Mandatory |
| Shadowfax RVP (11) | `imei` | `shipment_details->items` | String | IMEI number of the item (if the item is a mobile device). | 100 | `"AA-BBBBBB-CCCCCC-D"` | Optional |
| Bluedart RVP (28) | `exchange_rvp_awb` | `additional` | String | The AWB number for tracking the reverse exchange (Applicable only for "EXCHANGE" orders). | 100 | `"TESTEXCHAWB00001"` | Conditional Optional |
| Fareye RVP (38) | `gst_tax_base` | `gst_info` | String | **Mandatory** GST Tax Base (missing details in source). | - | - | Mandatory |
| Fareye RVP (38) | `pickup_lat` | `pickup_info` | Float | Latitude of the location of pickup of the order. | - | `45.11221` | Conditional Mandatory |
| Fareye RVP (38) | `pickup_long` | `pickup_info` | Float | Longitude of the location of pickup of the order. | - | `88.11111` | Conditional Mandatory |
| Fareye RVP (38) | `drop_lat` | `drop_info` | Float | Latitude of the location of delivery of the order. | - | `45.11221` | Conditional Mandatory |
| Fareye RVP (38) | `drop_long` | `drop_info` | Float | Longitude of the location of delivery of the order. | - | `88.11111` | Conditional Mandatory |
| Fedex MPS Cross-Border (330) | `payor_fedex_account_number` | `courier_custom_fields` | String | **(Missing Description in source)** | - | - | Conditional Mandatory |