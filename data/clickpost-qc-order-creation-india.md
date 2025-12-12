# Clickpost API: Reverse Shipment with Quality Check (RVP + QC)

**Summary:** This API allows enterprises to create Reverse (Return) orders where the Carrier Partner performs a Quality Check (QC) of the item at the customer's doorstep before picking it up.

**Geography:** India Only (V3 API).

---

## 1. Overview & Logic
Reverse shipment with QC ensures that returned items match the originally delivered products and meet specific quality standards during the collection phase.

### How it Works
1.  **Initiation:** The client sends an API request specifying `qc_type: "doorstep"`.
2.  **Parameter Selection:** The system determines *which* attributes (Brand, Color, IMEI, etc.) to check based on a priority hierarchy.
3.  **Execution:** The carrier agent verifies the physical item against the parameters provided in the API or configuration.

### QC Priority Logic
The system determines which parameters to check based on the following order of precedence (1 = Highest):



1.  **Priority 1: QC Params in API (Dynamic)**
    * The client explicitly sends a list of parameters (e.g., `["BRAND", "COLOR"]`) in the `additional.qc_params` field of the API request.
    * **Result:** QC is executed based *only* on these specific parameters.

2.  **Priority 2: Field Based QC (Conditional)**
    * Checks are triggered based on the value of a specific field (e.g., if `rvp_reason` is "Defective", check "Power On").
    * **Prerequisite:** Must be pre-configured with Clickpost support.
    * **Result:** If Priority 1 is missing, the system checks if the payload matches any field-based rules.

3.  **Priority 3: Account Based QC (Static)**
    * A fixed list of parameters is configured for the Carrier Account.
    * **Result:** If Priority 1 and 2 are missing, the system uses the default list configured for that carrier.

---

## 2. Activation & Support

**Supported Carriers:**
* BlueDart
* Delhivery
* Ecom Express
* Ekart
* ShadowFax
* Xpressbees

**Activation:**
To enable QC, email `support@clickpost.in` with the following template:
> **Subject:** QC Activation Request for [Courier Partner Name]
> **Account Code:** [Your Clickpost Account Code]
> **List of Parameters:** [e.g., Brand, Color, IMEI, Images...]

---

## 3. Endpoint Details

* **Method:** `POST`
* **URL:** `https://www.clickpost.in/api/v3/create-order/`
* **Query Params:** `username` (Mandatory), `key` (Mandatory).

---

## 4. Payload Configuration (RVP Specifics)

To create an RVP+QC order, you must follow the standard V3 Create Order schema, but with specific **Mandatory Configurations** in the `shipment_details` and `additional` objects.

### A. Root Level `additional` Object
This object defines *that* a QC is required and *which* keys to check.

| Field Name | Type | Requirement | Description |
| :--- | :--- | :--- | :--- |
| **`qc_type`** | String | **Mandatory** | Must be set to **`"doorstep"`**. |
| **`qc_params`** | Array | Optional | **Priority 1 Method.** A list of strings defining parameters to check. <br> *Example:* `["BRAND", "COLOR"]` |
| **`rvp_reason`** | String | **Mandatory** | The reason for return (e.g., "Defective"). Max 500 chars. |
| `async` | Boolean | Optional | Set `true` for background processing. |

### B. Item Level `additional` Object
*(Location: `shipment_details` -> `items` -> `additional`)*
This object contains the **Reference Values** that the carrier agent will match against.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `brand` | String | Value to match (e.g., "Puma"). |
| `color` | String | Value to match (e.g., "Blue"). |
| `size` | String | Value to match (e.g., "XL"). |
| `imei` | String | Value to match (Mobile devices). |
| `serial_no` | String | Serial number to match. |
| `images` | String | Comma-separated URLs of the product for visual verification. |
| `special_instructions`| String | Instructions for the runner (e.g., "Check for scratches"). |
| *[Dynamic Keys]* | String | Any other key from the "Supported Parameters List" below. |

---

## 5. Supported QC Parameters List
These keys can be used in `qc_params` and the Item Level `additional` object.

| Parameter Key | Description |
| :--- | :--- |
| `BRAND` | Brand of the item. |
| `COLOR` | Color of the item. |
| `SIZE` | Size of the item. |
| `IMAGES` | Visual inspection against provided images. |
| `IMEI` | International Mobile Equipment Identity. |
| `SERIAL_NUMBER` | Unique identifier/Serial No. |
| `SKU` | Stock Keeping Unit. |
| `EAN` | European Article Number. |
| `QUANTITY` | Quantity of items. |
| `DESCRIPTION` | Detailed description. |
| `RETURN_REASON` | Reason for return. |
| `CHECK_USED` | Check for signs of usage. |
| `CHECK_PRICE_TAG` | Presence and accuracy of price tag. |
| `CHECK_PACKAGING_BOX` | Condition of the packaging box. |
| `CHECK_SEAL` | Verification of seal integrity. |
| `CHECK_DAMAGED` | Inspection for damages. |
| `PHONE_SWITCH_POWER_CHECK` | Verify phone powers on. |
| `PHONE_TOUCH_SCREEN_CHECK` | Verify touch screen functionality. |
| `PHONE_CAMERA_CHECK` | Inspection of camera. |
| `PHONE_CONDITION_CHECK` | Overall condition evaluation. |
| `ALL_BUTTONS_WORKING_CHECK`| Verify all buttons work. |
| `SPECIAL_INSTRUCTION` | Additional instructions. |

*(Note: Advanced parameters like `LAST_5_DIGIT_OF_IMEI_CHECK` or `GARMENTS_CONDITION_CHECK` are also supported).*

---

## 6. Sample Payload (JSON)

**Scenario:** An RVP order where the carrier must check the **Brand**, **Color**, and **Images** (Priority 1 approach).

```json
{
  "pickup_info": {
    "pickup_name": "Customer Name",
    "pickup_phone": "9876543210",
    "email": "customer@example.com",
    "pickup_address": "Flat 101, Residency",
    "pickup_city": "Mumbai",
    "pickup_state": "Maharashtra",
    "pickup_pincode": "400065",
    "pickup_country": "IN",
    "pickup_time": "2023-10-27T10:00:00",
    "pickup_address_type": "RESIDENTIAL",
    "tin": "NA"
  },
  "drop_info": {
    "drop_name": "Warehouse Manager",
    "drop_phone": "9998887776",
    "drop_address": "Warehouse 12",
    "drop_city": "Delhi",
    "drop_state": "Delhi",
    "drop_pincode": "110001",
    "drop_country": "IN",
    "drop_address_type": "OFFICE"
  },
  "shipment_details": {
    "order_type": "PREPAID",
    "delivery_type": "RVP",
    "cod_value": 0,
    "invoice_value": 2000,
    "invoice_date": "2023-01-01",
    "courier_partner": 3,
    "reference_number": "RVP-QC-TEST-001",
    "weight": 500,
    "length": 10,
    "breadth": 10,
    "height": 5,
    "items": [
      {
        "sku": "SHOE-001",
        "description": "Running Shoes",
        "quantity": 1,
        "price": 2000,
        "weight": 500,
        "length": 10,
        "breadth": 10,
        "height": 5,
        "additional": {
          "brand": "Puma",
          "color": "Blue",
          "images": "[http://img.com/shoe1.jpg,http://img.com/shoe2.jpg](http://img.com/shoe1.jpg,http://img.com/shoe2.jpg)",
          "special_instructions": "Check for sole damage"
        }
      }
    ]
  },
  "additional": {
    "qc_type": "doorstep",
    "qc_params": [
      "BRAND",
      "COLOR",
      "IMAGES",
      "SPECIAL_INSTRUCTION"
    ],
    "rvp_reason": "Defective Product"
  }
}