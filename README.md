# Data Base Assessment

## 📌 Description
This project is a **Data Base Assessment** designed to handle:
- **CRUD operations** for customers.
- Management of invoices and transactions.
- **Advanced SQL queries** to obtain financial insights.
- **Data normalization** to ensure efficiency and integrity.
- Bulk data loading from CSV files.

The project includes a **PostgreSQL backend** (Node.js + Express) and a **frontend interface** for customer CRUD operations.

---

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/xXCpFireXx/BD_Assessment.git
cd BD_Assessment
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory with the following:
```env
PGHOST=your_postgres_host
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=your_postgres_database
PGPORT=5432
```

### 4️⃣ Start the Server
```bash
cd backend
node server_api.js
```
Server will run on:
```
http://localhost:3000
```

### 5️⃣ Open the Frontend
```bash
npm run dev
```
Frontend will run on:
```
http://localhost:5173/
```
---
## 🛠️ Technologies Used
- **Backend:** Node.js, Express.js, PostgreSQL
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Database:** PostgreSQL
- **Tools:** pg (PostgreSQL client for Node), dotenv, CORS
- **Other:** CSV import for bulk data
---

## 📁 Database Normalization
The system’s database follows **Third Normal Form (3NF)**:

### **1NF (First Normal Form)**
- Removed repeating groups and ensured each field contains only atomic values.
- Example: Instead of having multiple phone columns, store one phone per row.

### **2NF (Second Normal Form)**
- Removed partial dependencies; all non-key attributes depend on the entire primary key.
- Example: `invoices` table stores only data related to the invoice and references `customers` by foreign key.

### **3NF (Third Normal Form)**
- Removed transitive dependencies; non-key attributes do not depend on other non-key attributes.
- Example: `transactions` references `invoices` directly, avoiding duplication of customer data.

**Final Tables:**
- `customers` → Customer details.
- `invoices` → Invoice data linked to a customer.
- `transactions` → Payments or charges linked to an invoice.

---

## 📥 Bulk CSV Import Using Node.js Scripts

This project includes **Node.js scripts** for bulk importing CSV files.

### 1️⃣ Import Customers
The script `upload_costumers.js` reads the file `docs/docs-csv/customers.csv` and inserts the records into the `customers` table.

Run:
```bash
cd backend
node upload_costumers.js
```

### 2️⃣ Import Invoices
The script `upload_invoices.js` reads the file `backend/upload_invoices.js` and inserts the records into the `invoices` table.

Run:
```bash
cd backend
node upload_invoices.js
```

### 3️⃣ Import Transactions
The script `upload_transactions.js` reads the file `docs/docs-csv/transactions.csv` and inserts the records into the `transactions` table.

Run:
```bash
cd backend
node upload_transactions.js
```

⚠️ **Important:**
CSV files must be placed inside docs/docs-csv/ (relative path as used in the scripts).

The .env file must contain valid PostgreSQL credentials and located in `/backend`.
Data types and column names must match the table definitions in the database.

---


## 🔍 Advanced SQL Queries

### 1️⃣ Total Paid by Each Customer
**Description:** Shows the total amount paid by each customer for tracking revenue.
```sql
SELECT 
    c.cc_customer,
    c.customer_name,
    SUM(i.paid_amount) AS total_paid
FROM customers c
JOIN invoices i ON c.cc_customer = i.cc_customer
GROUP BY c.cc_customer, c.customer_name;
```

### 2️⃣ Pending Invoices with Customer and Transaction Details
**Description:** Lists invoices that have not been fully paid, with associated customer and transaction info.
```sql
SELECT 
    i.invoice_number,
    c.customer_name,
    t.id_transaction,
    t.t_amount,
    i.billed_amount,
    i.paid_amount,
    t.t_status
FROM invoices i
JOIN customers c ON c.cc_customer = i.cc_customer
JOIN transactions t ON t.invoice_number = i.invoice_number
WHERE i.paid_amount < i.billed_amount
  AND t.t_status = 'Pendiente';
```

### 3️⃣ Transactions by Platform
**Description:** Lists all transactions made from a specific platform (e.g., Nequi, Daviplata) with customer and invoice details.
```sql
SELECT 
    t.id_transaction,
    t.t_date_time,
    t.t_amount,
    t.t_status,
    t.t_type,
    t.platform_used,
    c.customer_name,
    i.invoice_number
FROM transactions t
JOIN invoices i ON t.invoice_number = i.invoice_number
JOIN customers c ON i.cc_customer = c.cc_customer
WHERE t.platform_used = ''; -- 'Nequi' or 'Daviplata'
```

---

## 📄 Info Developer
* 🧑 **Name:** Cristian Alejandro Penagos Suarez
* 🤝 **Clan:** Gosling
* ✉️ **Email:** suarezalejo26@gmail.com
