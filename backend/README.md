# Authentication API

Copy `.env.example` to `.env` and configure MongoDB, JWT secrets, and SMTP. Use two different long random values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`. `JWT_SECRET` remains a temporary compatibility fallback only. Verification and password-reset links expire after 15 minutes by default; set `EMAIL_TOKEN_EXPIRES_IN_MINUTES` to change this.

Start the backend with `npm run dev --prefix backend`.

## Routes

All request bodies are JSON. Protected routes require `Authorization: Bearer <accessToken>`.

| Method | Endpoint                        | Body                                                                            |
| ------ | ------------------------------- | ------------------------------------------------------------------------------- |
| POST   | `/api/auth/register`            | `firstName`, `lastName`, `email`, `mobileNumber`, `password`, `confirmPassword` |
| POST   | `/api/auth/verify-email`        | `token`                                                                         |
| POST   | `/api/auth/resend-verification` | `email`                                                                         |
| POST   | `/api/auth/login`               | `email`, `password`                                                             |
| POST   | `/api/auth/forgot-password`     | `email`                                                                         |
| POST   | `/api/auth/reset-password`      | `token`, `password`, `confirmPassword`                                          |
| POST   | `/api/auth/refresh-token`       | `refreshToken`                                                                  |
| POST   | `/api/auth/logout`              | `refreshToken`                                                                  |
| GET    | `/api/auth/me`                  | none                                                                            |

## Postman examples

Register:

```json
{
  "firstName": "Lata",
  "lastName": "Patil",
  "email": "lata@example.com",
  "mobileNumber": "+919876543210",
  "password": "Secure@123",
  "confirmPassword": "Secure@123"
}
```

Verify/reset token body:

```json
{ "token": "token-from-email" }
```

Login:

```json
{ "email": "lata@example.com", "password": "Secure@123" }
```

Refresh or logout:

```json
{ "refreshToken": "refresh-token-from-login" }
```

The login and refresh responses contain `accessToken`, `refreshToken`, and `user`. Refresh tokens rotate: discard the old token after every successful refresh. Passwords must have at least 8 characters, uppercase, lowercase, a number, and a special character.

## Khata API

All endpoints below are protected. Create a shop first; every customer, transaction, payment, notification, and receipt is scoped to that shop.

| Method             | Endpoint                                                        | Purpose                                          |
| ------------------ | --------------------------------------------------------------- | ------------------------------------------------ |
| POST / GET / PUT   | `/api/shop`                                                     | Create, read, or update the current owner's shop |
| POST / GET         | `/api/customers`                                                | Create or list customers                         |
| GET                | `/api/customers/search?q=rajesh`                                | Search by name or mobile number                  |
| GET / PUT / DELETE | `/api/customers/:customerId`                                    | Read, update, or archive a customer              |
| GET                | `/api/customers/:customerId/transactions`                       | Customer sales/udhar history                     |
| GET                | `/api/customers/:customerId/payments`                           | Customer payment history                         |
| GET                | `/api/customers/:customerId/ledger`                             | Derived ledger and running balances              |
| GET                | `/api/customers/:customerId/statement?from=&to=`                | Structured statement JSON                        |
| POST / GET         | `/api/transactions`                                             | Create or list transactions                      |
| GET                | `/api/transactions/:transactionId`                              | Transaction with live status/outstanding         |
| POST               | `/api/payments`                                                 | Record an immutable payment                      |
| GET / PATCH        | `/api/notifications`, `/api/notifications/:notificationId/read` | List and mark notifications read                 |
| GET                | `/api/receipts/transactions/:transactionId`                     | Transaction receipt JSON                         |
| GET                | `/api/receipts/payments/:paymentId`                             | Payment receipt JSON                             |
| GET                | `/api/receipts/aging-report`                                    | Current, 1–30, 31–60, 61+ aging                  |
| GET                | `/api/dashboard`                                                | Sales, due amounts, and recent activity          |

Create shop:

```json
{
  "shopName": "Shri Lata Kirana Stores",
  "ownerName": "Lata Patil",
  "mobileNumber": "+919876543210",
  "address": "Pune",
  "defaultCreditPeriod": 30
}
```

Create customer:

```json
{ "name": "Rajesh Kumar", "mobileNumber": "+919812345678", "creditPeriod": 30 }
```

Create a partial sale. The server validates the payment type and calculates `dueAmount` itself:

```json
{
  "customerId": "CUSTOMER_ID",
  "totalAmount": 800,
  "paidAmount": 700,
  "transactionType": "PARTIAL",
  "notes": "Grocery sale"
}
```

Record a later payment. `transactionId` is optional for a customer-level payment, but recommended for a precise transaction balance:

```json
{
  "customerId": "CUSTOMER_ID",
  "transactionId": "TRANSACTION_ID",
  "amount": 100,
  "method": "UPI"
}
```

Dashboard response (`GET /api/dashboard`):

```json
{
  "success": true,
  "data": {
    "todaySales": 1250,
    "cashSales": 500,
    "upiSales": 300,
    "udharSales": 450,
    "totalOutstanding": 2450,
    "overdueAmount": 800,
    "customersWithDue": 3,
    "overdueCustomers": [],
    "recentTransactions": [],
    "recentPayments": [],
    "pendingEntries": 3
  }
}
```
