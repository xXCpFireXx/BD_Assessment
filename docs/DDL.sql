-- Create BD pd_cristian_penagos_gosling
CREATE DATABASE pd_cristian_penagos_gosling;

-- Create Customers table
CREATE TABLE customers (
    cc_customer VARCHAR(15) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Create Invoices table
CREATE TABLE invoices (
    invoice_number VARCHAR(10) PRIMARY KEY, 
    billing_period VARCHAR(10) NOT NULL,
    billed_amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) NOT NULL,
    cc_customer VARCHAR(15) NOT NULL,
    CONSTRAINT fk_invoices_customer FOREIGN KEY (cc_customer) REFERENCES customers(cc_customer) ON DELETE CASCADE
);

-- Create Transactions table
CREATE TABLE transactions (
    id_transaction VARCHAR(10) PRIMARY KEY,  
    t_date_time TIMESTAMP NOT NULL,
    t_amount DECIMAL(15, 2) NOT NULL,
    t_status VARCHAR(20) NOT NULL,
    t_type VARCHAR(50) NOT NULL,
    platform_used VARCHAR(20) NOT NULL, 
    invoice_number VARCHAR(10) NOT NULL,
    CONSTRAINT fk_transactions_invoice FOREIGN KEY (invoice_number) REFERENCES invoices(invoice_number) ON DELETE CASCADE
);