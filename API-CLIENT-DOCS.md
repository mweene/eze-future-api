# Client API Documentation

This document describes the client management API endpoints for the Eze Future API.

## Overview

The client API allows you to manage client records with their associated plot details, witness information, and documents. Data is stored in a normalized database structure across multiple related tables.

## Database Structure

The client data is distributed across four tables:
- `clients` - Main client information
- `plot_details` - Plot and payment information
- `witnesses` - Witness details
- `documents` - Document links

## Endpoints

### 1. Get All Clients

**GET** `/api/clients`

Returns a list of all clients with their complete information.

**Response:**
```json
[
  {
    "id": "2311",
    "name": "Martin Zulu",
    "sex": "male",
    "nrc": "236700/17/1",
    "phone": "0973751057",
    "email": "martin.zulu@example.com",
    "address": "Garden Chilulu, Lusaka",
    "plotDetails": { ... },
    "witness": { ... },
    "documents": { ... }
  }
]
```

### 2. Get Client by ID

**GET** `/api/clients/:id`

Returns a specific client by their ID.

**Parameters:**
- `id` (required) - The client ID

**Response:**
```json
{
  "id": 1,
  "name": "John Mukuka",
  "sex": "male",
  "nrc": "123456/78/9",
  "phone": "0977123456",
  "email": "john.mukuka@example.com",
  "address": "Plot 123, Kabulonga, Lusaka",
  "plotDetails": {
    "plotSize": "30 x 25",
    "plotNumber": "15",
    "siteName": "A",
    "grandPrice": 18000,
    "amountPaid": 10000,
    "balance": 8000,
    "allocated": "no",
    "allocationDate": "2024-12-15",
    "paymentStatus": "partial",
    "dateBought": "2024-01-15",
    "dateUpdated": "2024-12-15"
  },
  "witness": {
    "name": "Mary Phiri",
    "sex": "female",
    "nrc": "987654/32/1",
    "email": "mary.phiri@example.com",
    "phone": "0966789123",
    "address": "Plot 456, Chelstone, Lusaka",
    "relationship": "sister"
  },
  "documents": {
    "nrcLink": "https://gdrive.com/file/nrc_john_mukuka",
    "letterOfSaleLink": "https://gdrive.com/file/sale_john_mukuka",
    "landAgreementLink": "https://gdrive.com/file/agreement_john_mukuka",
    "allocationFormLink": "https://gdrive.com/file/allocation_john_mukuka",
    "authorizationLetterLink": "https://gdrive.com/file/auth_john_mukuka"
  }
}
```

**Error Responses:**
- `404` - Client not found
- `400` - Invalid client ID
- `500` - Server error

### 3. Add New Client

**POST** `/api/clients`

Creates a new client with all related information.

**Required Fields:**
- `name` (string) - Client's full name
- `email` (string) - Client's email address

**Optional Fields:**
- `sex` (string) - Client's gender
- `nrc` (string) - National Registration Card number
- `phone` (string) - Phone number
- `address` (string) - Physical address
- `plotDetails` (object) - Plot information
- `witness` (object) - Witness information
- `documents` (object) - Document links

**Request Body:**
```json
{
  "name": "John Mukuka",
  "sex": "male",
  "nrc": "123456/78/9",
  "phone": "0977123456",
  "email": "john.mukuka@example.com",
  "address": "Plot 123, Kabulonga, Lusaka",
  "plotDetails": {
    "plotSize": "30 x 25",
    "plotNumber": "15",
    "siteName": "A",
    "grandPrice": 18000,
    "amountPaid": 10000,
    "balance": 8000,
    "allocated": "no",
    "allocationDate": "2024-12-15",
    "paymentStatus": "partial",
    "dateBought": "2024-01-15",
    "dateUpdated": "2024-12-15"
  },
  "witness": {
    "name": "Mary Phiri",
    "sex": "female",
    "nrc": "987654/32/1",
    "email": "mary.phiri@example.com",
    "phone": "0966789123",
    "address": "Plot 456, Chelstone, Lusaka",
    "relationship": "sister"
  },
  "documents": {
    "nrcLink": "https://gdrive.com/file/nrc_john_mukuka",
    "letterOfSaleLink": "https://gdrive.com/file/sale_john_mukuka",
    "landAgreementLink": "https://gdrive.com/file/agreement_john_mukuka",
    "allocationFormLink": "https://gdrive.com/file/allocation_john_mukuka",
    "authorizationLetterLink": "https://gdrive.com/file/auth_john_mukuka"
  }
}
```

**Success Response (201):**
```json
{
  "message": "Client added successfully",
  "clientId": 1,
  "data": {
    "name": "John Mukuka",
    "email": "john.mukuka@example.com",
    "id": 1
  }
}
```

**Error Responses:**
- `400` - Missing required fields (name or email)
- `409` - Client with this name already exists
- `500` - Server error

## Data Structure Details

### Plot Details Object
```typescript
{
  plotSize?: string;        // e.g., "30 x 25"
  plotNumber?: string;      // Plot number
  siteName?: string;        // Site designation
  grandPrice?: number;      // Total price
  amountPaid?: number;      // Amount paid so far
  balance?: number;         // Remaining balance
  allocated?: string;       // "yes" or "no"
  allocationDate?: string;  // Date format: "YYYY-MM-DD"
  paymentStatus?: string;   // "partial", "fully paid", etc.
  dateBought?: string;      // Date format: "DD-MM-YYYY"
  dateUpdated?: string;     // Date format: "DD-MM-YYYY"
}
```

### Witness Object
```typescript
{
  name?: string;
  sex?: string;
  nrc?: string;
  email?: string;
  phone?: string;
  address?: string;
  relationship?: string;    // e.g., "sister", "brother", "friend"
}
```

### Documents Object
```typescript
{
  nrcLink?: string;                    // Link to NRC document
  letterOfSaleLink?: string;           // Link to letter of sale
  landAgreementLink?: string;          // Link to land agreement
  allocationFormLink?: string;         // Link to allocation form
  authorizationLetterLink?: string;    // Link to authorization letter
}
```

## Example Usage

### Using cURL

**Add a new client:**
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d @examples/client-example.json
```

**Get all clients:**
```bash
curl http://localhost:3000/api/clients
```

**Get specific client:**
```bash
curl http://localhost:3000/api/clients/1
```

### Using JavaScript/Fetch

```javascript
// Add new client
const newClient = {
  name: "John Mukuka",
  email: "john.mukuka@example.com",
  phone: "0977123456",
  // ... other fields
};

const response = await fetch('/api/clients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newClient)
});

const result = await response.json();
console.log(result);
```

## Transaction Handling

The `addNewClient` endpoint uses database transactions to ensure data consistency. If any part of the operation fails, all changes are rolled back automatically.

## Notes

- All fields except `name` and `email` are optional when creating a client
- The API handles null values gracefully - omitted fields are stored as NULL in the database
- Client names must be unique across the system
- The response structure maintains camelCase naming for consistency with JavaScript conventions
- Database fields use snake_case naming following SQL conventions