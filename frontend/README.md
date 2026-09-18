BRD 
HLD
frontend : cloudflare 
backend : azure - server 
domain : namecheap - 
cdn : cloudflare 
mail : zoho mail 
database  : mongodb atlas 1 nahi ek se jyada backup k liye
image-storage : cloudinary ,
ci/cd - github actions . 
bullmq : cron job 
LLD
Shri Lata Kirana Stores
Project Vision
Shri Lata Kirana Stores is a digital Udhar (Khata) management platform designed specifically for small Kirana shops and local retail stores.

The application is not a full accounting software, ERP system, inventory management platform, GST system, or POS solution.

The primary objective is to solve a very simple but critical business problem:

Shopkeepers often forget to record customer dues (Udhar) because the shop is busy. This results in lost money, forgotten transactions, incorrect balances, and poor tracking of customer payments.

The application should act as the shopkeeper's digital memory.

The system should always know:

Who owes money
How much they owe
Since when they owe
How much has been paid
Which customers are overdue
What action the shopkeeper should take next
Real World Problem
Consider a typical Kirana shop.

A customer purchases products worth ₹800.

The customer only has ₹700 available.

The customer asks the shopkeeper:

"₹100 khate mein likh dena."

The shopkeeper becomes busy because multiple customers are waiting.

Sometimes:

The entry is forgotten
The amount is never recorded
The due is never collected
The business loses money
This is the exact problem we are solving.

The application must ensure that every due amount is recorded, tracked, and recoverable.

Application Objective
The application must allow the shopkeeper to quickly:

Create customers
Search customers
Record sales
Record Udhar
Record partial payments
Receive outstanding payments
Track outstanding balances
Track overdue balances
Generate receipts
Generate statements
Send payment reminders
View customer history
The most important principle is:

The shopkeeper should not have to remember anything. The application should remember everything.

User Roles
MVP
Only one role exists:

Admin / Shop Owner
The Admin can:

Login
Manage customers
Add sales
Add Udhar transactions
Record payments
View customer ledger
View reminders
Generate receipts
Generate statements
Configure reminder settings
Customers are NOT application users.

Customers will not have:

Login
Password
OTP
Dashboard
Account access
They are simply records managed by the shop owner.

Core Business Flow
The most important flow in the application is:

Search Customer ↓ Select Customer ↓ Create Sale ↓ Cash / UPI / Partial / Udhar ↓ Save ↓ Ledger Updated ↓ Outstanding Updated ↓ Receipt Available

Everything in the application should optimise this flow.

Customer Flow
The shopkeeper creates a customer.

Required Fields:

Name
Mobile Number
Optional Fields:

Address
Email
Notes
Credit Period
Example:

Rajesh Kumar +91 XXXXX XXXXX

The customer profile becomes the customer's digital Khata.

Customer Profile
Each customer profile should show:

Customer Name
Mobile Number
Outstanding Amount
Total Purchases
Total Payments
Oldest Outstanding
Transaction History
Actions:

Add Sale
Receive Payment
Generate Statement
Generate Receipt
Send Reminder
Sale Recording
The application must support:

Cash Sale
UPI Sale
Udhar Sale
Partial Payment Sale
There should be two entry methods.

Quick Sale (Most Important)
Designed for shops with heavy rush.

Flow:

Customer ↓ Enter Amount ↓ Cash / UPI / Udhar / Partial ↓ Save

Example:

Customer: Rajesh

Sale Amount: ₹800

Payment Type: Partial

Paid Amount: ₹700

Outstanding Amount: ₹100

Save

The transaction should take less than 10 seconds.

Detailed Sale
Optional item-level sale recording.

Example:

Rice 10kg × ₹60

Oil × ₹150

Sugar × ₹100

Total = ₹850

The user should never be forced to enter items.

Quick Sale must always remain available.

Outstanding Calculation
Outstanding is calculated automatically.

Formula:

Outstanding = Sale Amount - Amount Paid

Example:

Sale = ₹800

Paid = ₹700

Outstanding = ₹100

The shopkeeper should never calculate this manually.

Payment Recording
Customers often clear dues later.

Example:

Outstanding = ₹750

Customer Pays = ₹500

Remaining Due = ₹250

Flow:

Customer ↓ Receive Payment ↓ Enter Amount ↓ Cash / UPI ↓ Save ↓ Ledger Updated ↓ Outstanding Updated

The system must create a Payment Record.

Historical transactions must never be deleted.

Ledger Philosophy
The ledger is the heart of the application.

It should allow the shopkeeper to understand exactly how the current outstanding balance was created.

Example:

15 Sep

Sale ₹800

Paid ₹700

Due ₹100

12 Sep

Sale ₹1200

Paid ₹0

Due ₹1200

10 Sep

Payment ₹500

Current Outstanding = ₹800

The ledger must remain permanently available.

Outstanding and Overdue Tracking
The application should automatically track:

Outstanding Amount
Due Date
Days Outstanding
Overdue Status
Example Buckets:

0–7 Days
8–15 Days
16–30 Days
31+ Days
These values should be configurable.

Reminder System
The Admin can configure:

Default Credit Period = 15 Days

First Reminder = 15 Days

Second Reminder = 30 Days

Critical Reminder = 60 Days

The application should automatically identify customers that require attention.

Dashboard Philosophy
The dashboard should answer:

How much money is outstanding?
Which customers are overdue?
Who paid today?
What requires attention?
The dashboard should focus on Due Collection.

Not Inventory.

Not Profit.

Not GST.

Primary Dashboard Widgets:

Total Outstanding
Overdue Amount
Customers With Due
Recent Transactions
Recent Payments
Notifications
Receipt Generation
Every transaction should support receipt generation.

Receipt should contain:

Shop Name
Customer Name
Date
Amount
Paid Amount
Outstanding Amount
Actions:

Download PDF
Share via WhatsApp
Print
Customer Statement
The application should generate customer statements.

The statement should contain:

Customer Information
Total Purchases
Total Payments
Outstanding Balance
Full Transaction History
Actions:

Download PDF
Share WhatsApp
Share Email
WhatsApp Integration
Customers should receive statements and receipts through WhatsApp.

The application itself does not send money.

It only sends information.

Example:

Receipt PDF ↓ WhatsApp Share ↓ Customer Receives Receipt

Similarly:

Outstanding Statement ↓ WhatsApp Share ↓ Customer Receives Reminder

Voice Entry (Future Phase)
The application should be designed so voice commands can be added easily.

Examples:

"Rajesh paid 500"

"Rajesh paid 500 cash"

"Rajesh ko 100 ka udhar diya"

"Rajesh ne 1000 upi diye"

Expected Flow:

Voice ↓ Speech To Text ↓ Command Parser ↓ Customer Matching ↓ Transaction Creation ↓ Ledger Update

This is a future enhancement but the architecture should be ready from the beginning.

Technology Stack
Frontend:

React
Vite
React Router
Axios
Backend:

Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
Deployment:

Frontend: Cloudflare Pages

Backend: Azure App Service

Database: MongoDB Atlas

Email: Zoho Mail

Image Storage: Cloudinary

Domain: Namecheap

CDN: Cloudflare

Queue Processing: BullMQ + Redis

CI/CD: GitHub Actions

MVP Completion Criteria
The MVP is complete when the shop owner can:

Login ↓ Create Customer ↓ Search Customer ↓ Record Sale ↓ Record Udhar ↓ Record Partial Payment ↓ Receive Payment ↓ View Updated Ledger ↓ View Outstanding Amount ↓ Generate Receipt ↓ Generate Statement ↓ Track Overdue Customers ↓ Generate Reminders

without losing any historical transaction data.

Final Product Philosophy
This application is not an accounting platform.

This application is not an ERP.

This application is not an inventory management system.

This application is a Digital Udhar Register.

The application should always help the shopkeeper answer:

How much is due?

Who owes money?

How long has the amount been pending?

What should I do next?

The most important feature is:

Fast, reliable, and accurate transaction recording.

# Shri Lata Kirana Stores

## Project Vision

Shri Lata Kirana Stores is a digital Udhar (Khata) management platform designed specifically for small Kirana shops and local retail stores.

The application is not a full accounting software, ERP system, inventory management platform, GST system, or POS solution.

The primary objective is to solve a very simple but critical business problem:

> Shopkeepers often forget to record customer dues (Udhar) because the shop is busy. This results in lost money, forgotten transactions, incorrect balances, and poor tracking of customer payments.

The application should act as the shopkeeper's digital memory.

The system should always know:

- Who owes money
- How much they owe
- Since when they owe
- How much has been paid
- Which customers are overdue
- What action the shopkeeper should take next

---

# Real World Problem

Consider a typical Kirana shop.

A customer purchases products worth ₹800.

The customer only has ₹700 available.

The customer asks the shopkeeper:

"₹100 khate mein likh dena."

The shopkeeper becomes busy because multiple customers are waiting.

Sometimes:

- The entry is forgotten
- The amount is never recorded
- The due is never collected
- The business loses money

This is the exact problem we are solving.

The application must ensure that every due amount is recorded, tracked, and recoverable.

---

# Application Objective

The application must allow the shopkeeper to quickly:

- Create customers
- Search customers
- Record sales
- Record Udhar
- Record partial payments
- Receive outstanding payments
- Track outstanding balances
- Track overdue balances
- Generate receipts
- Generate statements
- Send payment reminders
- View customer history

The most important principle is:

> The shopkeeper should not have to remember anything. The application should remember everything.

---

# User Roles

## MVP

Only one role exists:

### Admin / Shop Owner

The Admin can:

- Login
- Manage customers
- Add sales
- Add Udhar transactions
- Record payments
- View customer ledger
- View reminders
- Generate receipts
- Generate statements
- Configure reminder settings

Customers are NOT application users.

Customers will not have:

- Login
- Password
- OTP
- Dashboard
- Account access

They are simply records managed by the shop owner.

---

# Core Business Flow

The most important flow in the application is:

Search Customer
↓
Select Customer
↓
Create Sale
↓
Cash / UPI / Partial / Udhar
↓
Save
↓
Ledger Updated
↓
Outstanding Updated
↓
Receipt Available

Everything in the application should optimise this flow.

---

# Customer Flow

The shopkeeper creates a customer.

Required Fields:

- Name
- Mobile Number

Optional Fields:

- Address
- Email
- Notes
- Credit Period

Example:

Rajesh Kumar
+91 XXXXX XXXXX

The customer profile becomes the customer's digital Khata.

---

# Customer Profile

Each customer profile should show:

- Customer Name
- Mobile Number
- Outstanding Amount
- Total Purchases
- Total Payments
- Oldest Outstanding
- Transaction History

Actions:

- Add Sale
- Receive Payment
- Generate Statement
- Generate Receipt
- Send Reminder

---

# Sale Recording

The application must support:

- Cash Sale
- UPI Sale
- Udhar Sale
- Partial Payment Sale

There should be two entry methods.

---

## Quick Sale (Most Important)

Designed for shops with heavy rush.

Flow:

Customer
↓
Enter Amount
↓
Cash / UPI / Udhar / Partial
↓
Save

Example:

Customer: Rajesh

Sale Amount: ₹800

Payment Type: Partial

Paid Amount: ₹700

Outstanding Amount: ₹100

Save

The transaction should take less than 10 seconds.

---

## Detailed Sale

Optional item-level sale recording.

Example:

Rice 10kg × ₹60

Oil × ₹150

Sugar × ₹100

Total = ₹850

The user should never be forced to enter items.

Quick Sale must always remain available.

---

# Outstanding Calculation

Outstanding is calculated automatically.

Formula:

Outstanding = Sale Amount - Amount Paid

Example:

Sale = ₹800

Paid = ₹700

Outstanding = ₹100

The shopkeeper should never calculate this manually.

---

# Payment Recording

Customers often clear dues later.

Example:

Outstanding = ₹750

Customer Pays = ₹500

Remaining Due = ₹250

Flow:

Customer
↓
Receive Payment
↓
Enter Amount
↓
Cash / UPI
↓
Save
↓
Ledger Updated
↓
Outstanding Updated

The system must create a Payment Record.

Historical transactions must never be deleted.

---

# Ledger Philosophy

The ledger is the heart of the application.

It should allow the shopkeeper to understand exactly how the current outstanding balance was created.

Example:

15 Sep

Sale ₹800

Paid ₹700

Due ₹100

---

12 Sep

Sale ₹1200

Paid ₹0

Due ₹1200

---

10 Sep

Payment ₹500

---

Current Outstanding = ₹800

The ledger must remain permanently available.

---

# Outstanding and Overdue Tracking

The application should automatically track:

- Outstanding Amount
- Due Date
- Days Outstanding
- Overdue Status

Example Buckets:

- 0–7 Days
- 8–15 Days
- 16–30 Days
- 31+ Days

These values should be configurable.

---

# Reminder System

The Admin can configure:

Default Credit Period = 15 Days

First Reminder = 15 Days

Second Reminder = 30 Days

Critical Reminder = 60 Days

The application should automatically identify customers that require attention.

---

# Dashboard Philosophy

The dashboard should answer:

- How much money is outstanding?
- Which customers are overdue?
- Who paid today?
- What requires attention?

The dashboard should focus on Due Collection.

Not Inventory.

Not Profit.

Not GST.

Primary Dashboard Widgets:

- Total Outstanding
- Overdue Amount
- Customers With Due
- Recent Transactions
- Recent Payments
- Notifications

---

# Receipt Generation

Every transaction should support receipt generation.

Receipt should contain:

- Shop Name
- Customer Name
- Date
- Amount
- Paid Amount
- Outstanding Amount

Actions:

- Download PDF
- Share via WhatsApp
- Print

---

# Customer Statement

The application should generate customer statements.

The statement should contain:

- Customer Information
- Total Purchases
- Total Payments
- Outstanding Balance
- Full Transaction History

Actions:

- Download PDF
- Share WhatsApp

- Share Email

---J2YQ-W8Q2U

# WhatsApp Integration

Customers should receive statements and receipts through WhatsApp.

The application itself does not send money.

It only sends information.

Example:

Receipt PDF
↓
WhatsApp Share
↓
Customer Receives Receipt

Similarly:

Outstanding Statement
↓
WhatsApp Share
↓
Customer Receives Reminder

---

# Voice Entry (Future Phase)

The application should be designed so voice commands can be added easily.

Examples:

"Rajesh paid 500"

"Rajesh paid 500 cash"

"Rajesh ko 100 ka udhar diya"

"Rajesh ne 1000 upi diye"

Expected Flow:

Voice
↓
Speech To Text
↓
Command Parser
↓
Customer Matching
↓
Transaction Creation
↓
Ledger Update

This is a future enhancement but the architecture should be ready from the beginning.

---

# Technology Stack

Frontend:

- React
- Vite
- React Router
- Axios

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

Deployment:

Frontend: Cloudflare Pages

Backend: Azure App Service

Database: MongoDB Atlas

Email: Zoho Mail

Image Storage: Cloudinary

Domain: Namecheap

CDN: Cloudflare

Queue Processing: BullMQ + Redis

CI/CD: GitHub Actions

---

# MVP Completion Criteria

The MVP is complete when the shop owner can:

Login
↓
Create Customer
↓
Search Customer
↓
Record Sale
↓
Record Udhar
↓
Record Partial Payment
↓
Receive Payment
↓
View Updated Ledger
↓
View Outstanding Amount
↓
Generate Receipt
↓
Generate Statement
↓
Track Overdue Customers
↓
Generate Reminders

without losing any historical transaction data.

---

# Final Product Philosophy

This application is not an accounting platform.

This application is not an ERP.

This application is not an inventory management system.

This application is a Digital Udhar Register.

The application should always help the shopkeeper answer:

How much is due?

Who owes money?

How long has the amount been pending?

What should I do next?

The most important feature is:

Fast, reliable, and accurate transaction recording.



