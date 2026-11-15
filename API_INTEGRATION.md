# RentNest API Integration Mapping

This document provides the verified mapping of the RentNest backend API to frontend features based on the backend source code audit and Swagger documentation.

---

## 1. API Architecture & Configuration

- **Production Backend URL:** `https://rentnest-backend-wx28.onrender.com`
- **Local Backend URL:** `http://localhost:5000`
- **Swagger Documentation:** `/api/docs`
- **Health Check Endpoint:** `GET /api/health`
- **Authentication:** JWT Bearer token passed in the request header:
  ```http
  Authorization: Bearer <accessToken>
  ```
- **CORS:** Enabled for all origins (`cors()`).

### Standard Response Envelope
**Success Response:**
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errorDetails": null | [] | {}
}
```

---

## 2. Verified Endpoint Mappings

### 2.1 Authentication & Profile
| Method | Endpoint | Access | Intended Frontend Feature / Usage | Request Body / Query | Success Response Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Tenant & Landlord account registration | `{ name, email, password, phone?, role: "TENANT" \| "LANDLORD" }` | `{ user, accessToken }` (201) |
| `POST` | `/api/auth/login` | Public | User login (all roles) | `{ email, password }` | `{ user, accessToken }` (200) |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile / restore session | None | User profile object (200) |
| `PATCH` | `/api/auth/me` | Authenticated | Update user profile details | `{ name?, phone? }` | Updated user object (200) |

---

### 2.2 Categories
| Method | Endpoint | Access | Intended Frontend Feature / Usage | Request Body / Query | Success Response Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | Category filters, dropdowns, navigation | None | `Category[]` (200) |
| `POST` | `/api/admin/categories` | Admin | Create property category | `{ name, slug, description? }` | Created `Category` (201) |
| `PATCH` | `/api/admin/categories/:id` | Admin | Update category details | `{ name?, slug?, description? }` | Updated `Category` (200) |
| `DELETE` | `/api/admin/categories/:id` | Admin | Delete category (blocked if properties exist) | None | `null` (200) |

---

### 2.3 Properties (Public & Landlord)
| Method | Endpoint | Access | Intended Frontend Feature / Usage | Request Body / Query | Success Response Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/properties` | Public | Explore properties with multi-filter search | `search, city, area, category, minPrice, maxPrice, bedrooms, bathrooms, amenities, page, limit, sortBy, sortOrder` | `{ properties: Property[], pagination: { total, page, limit, totalPages } }` |
| `GET` | `/api/properties/:id` | Public | Property details page (images, amenities, landlord info) | Param: `id` (UUID) | Full `Property` object (200) |
| `GET` | `/api/landlord/properties` | Landlord | Landlord listings dashboard | Query: `status?, page, limit` | `{ properties: Property[], pagination }` |
| `POST` | `/api/landlord/properties` | Landlord | Create new property listing | `{ title, description, address, area?, city, country, monthlyRent, securityDeposit?, bedrooms, bathrooms, areaSqFt?, amenities, images, categoryId, availableFrom? }` | Created `Property` (201) |
| `PUT` | `/api/landlord/properties/:id` | Landlord | Edit existing property listing | Same schema as create (partial) | Updated `Property` (200) |
| `DELETE` | `/api/landlord/properties/:id` | Landlord | Delete property (only if no rental history) | Param: `id` (UUID) | `null` (200) |
| `PATCH` | `/api/landlord/properties/:id/status` | Landlord | Toggle listing availability | `{ status: "AVAILABLE" \| "UNAVAILABLE" }` | Updated `Property` (200) |

---

### 2.4 Rental Requests (Tenant & Landlord)
| Method | Endpoint | Access | Intended Frontend Feature / Usage | Request Body / Query | Success Response Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/rentals` | Tenant | Submit rental application for available property | `{ propertyId, message?, moveInDate, leaseDurationMonths? }` | Created `RentalRequest` (201) |
| `GET` | `/api/rentals` | Tenant | Tenant rental application history & status | Query: `status?, page, limit` | `{ requests: RentalRequest[], pagination }` |
| `GET` | `/api/rentals/:id` | Tenant | Rental request details with linked payment history | Param: `id` (UUID) | `RentalRequest` with payments & property |
| `GET` | `/api/landlord/requests` | Landlord | Landlord rental requests management inbox | Query: `status?, page, limit` | `{ requests: RentalRequest[], pagination }` |
| `PATCH` | `/api/landlord/requests/:id` | Landlord | Approve or reject tenant rental request | `{ status: "APPROVED" \| "REJECTED", landlordResponse? }` | Updated `RentalRequest` (200) |
| `PATCH` | `/api/landlord/requests/:id/complete` | Landlord | Mark active rental completed (frees property) | Param: `id` (UUID) | Completed `RentalRequest` (200) |

---

### 2.5 Payments (Tenant, Callbacks & Admin)
| Method | Endpoint | Access | Intended Frontend Feature / Usage | Request Body / Query | Success Response Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create` | Tenant | Initiate SSLCommerz checkout session for approved rental | `{ rentalRequestId, customerPhone, customerAddress, customerCity, customerPostcode }` | `{ paymentId, transactionId, amount, currency, provider, status, checkoutUrl }` (201) |
| `GET` | `/api/payments` | Tenant | Tenant payment history list | Query: `status?, page, limit` | `{ payments: Payment[], pagination }` |
| `GET` | `/api/payments/:id` | Tenant | View specific payment transaction details | Param: `id` (UUID) | `Payment` with rental & property details |
| `POST/GET` | `/api/payments/confirm` | Public / Gateway | Gateway return callback & validation verification | Callback params: `tran_id, val_id?, status?` | Verified payment result |
| `POST` | `/api/payments/ipn` | Public / Gateway | SSLCommerz Instant Payment Notification hook | Form data / query: `tran_id, val_id, ...` | Verification result |
| `POST` | `/api/payments/success` | Public / Gateway | Gateway redirect callback for success | Callback parameters | Verification result |
| `POST` | `/api/payments/fail` | Public / Gateway | Gateway redirect callback for failure | Callback parameters | Payment status marked FAILED |
| `POST` | `/api/payments/cancel` | Public / Gateway | Gateway redirect callback for cancellation | Callback parameters | Payment status marked CANCELLED |

---

### 2.6 Reviews (Public & Tenant)
| Method | Endpoint | Access | Intended Frontend Feature / Usage | Request Body / Query | Success Response Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/property/:propertyId` | Public | View reviews and aggregate rating for a property | Param: `propertyId`, Query: `page, limit` | `{ reviews: Review[], summary: { averageRating, totalReviews }, pagination }` |
| `POST` | `/api/reviews` | Tenant | Submit review on a completed rental | `{ rentalRequestId, rating (1-5), comment? }` | Created `Review` (201) |

---

### 2.7 Admin Management
| Method | Endpoint | Access | Intended Frontend Feature / Usage | Request Body / Query | Success Response Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Admin | Monitor and search all users | Query: `search?, role?, status?, page, limit` | `{ users: User[], pagination }` |
| `PATCH` | `/api/admin/users/:id` | Admin | Ban or unban user | `{ status: "ACTIVE" \| "BANNED" }` | Updated `User` (200) |
| `GET` | `/api/admin/properties` | Admin | Monitor all properties across landlords | Query: `search?, city?, categoryId?, status?, page, limit` | `{ properties: Property[], pagination }` |
| `GET` | `/api/admin/rentals` | Admin | Monitor all rental requests across platform | Query: `status?, page, limit` | `{ rentals: RentalRequest[], pagination }` |
| `GET` | `/api/admin/payments` | Admin | Monitor all transactions and total revenue | Query: `status?, provider?, page, limit` | `{ payments: Payment[], summary: { totalCompletedRevenue }, pagination }` |

---

## 3. Role-Based Access Matrix

| Feature / Resource | Public | TENANT | LANDLORD | ADMIN |
| :--- | :---: | :---: | :---: | :---: |
| Browse Properties & Categories | Yes | Yes | Yes | Yes |
| View Property Reviews | Yes | Yes | Yes | Yes |
| Register / Login | Yes | Yes | Yes | Yes |
| Profile View / Update | - | Yes | Yes | Yes |
| Submit Rental Request | - | Yes | - | - |
| View Tenant Rentals & Payments | - | Yes | - | - |
| Initiate Payment (SSLCommerz) | - | Yes | - | - |
| Submit Property Review | - | Yes (Completed) | - | - |
| Manage Owned Properties (CRUD) | - | - | Yes | - |
| Approve / Reject Rental Requests | - | - | Yes | - |
| Mark Rental Complete | - | - | Yes | - |
| User Management (Ban/Unban) | - | - | - | Yes |
| Category Management (CRUD) | - | - | - | Yes |
| Global Properties / Rentals Monitoring | - | - | - | Yes |
| Global Payments & Revenue Analytics | - | - | - | Yes |
