# BD_Assessment


1. Identificación de entidades
A partir de las columnas, las entidades que salen son:

customers (clientes)

customer_id (PK)

full_name

id_number

address

phone

email

invoices (facturas)

invoice_id (PK)

billing_period

billed_amount

paid_amount

customer_id (FK → customers)

transactions (transacciones)

transaction_id (PK)

transaction_datetime

transaction_amount

transaction_status

transaction_type

platform_id (FK → platforms)

invoice_id (FK → invoices)

platforms (plataformas de pago)

platform_id (PK)

platform_name (Nequi, Daviplata, etc.)