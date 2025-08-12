# Data Base Assessment

## Description
This system organizes financial data from Fintech platforms into a SQL database with CRUD and advanced queries.

## Setup Instructions
1. Install Node.js and MySQL.
2. Run `create_database.sql`.
3. `npm install` in backend folder.
4. Run `node server.js`.
5. Open frontend/index.html.

## Technologies
- Backend: Node.js, Express, Postgres
- Frontend: HTML, CSS, JS
- Others: Draw.io for model

## Normalization Explanation
Applied 1FN (atomic values), 2FN (full key dependency), 3FN (no transitive deps). Tables: Customers, Invoices, Transactions.

## Data Loading
Convert Excel to CSV. Run `node load_data.js`.

## Advanced Queries
1. Total paid: GET /total-paid-by-customer
...

## Relational Model



## Developer Info
* Name: Cristian Alejandro Penagos Suárez
* Clan: Gosling
* Email: suarezalejo26@gmail.com