import 'dotenv/config';
import express, { json } from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(json());

const db = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }
});

// Get all customers
app.get('/customers', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM public.customers');
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add customer
app.post('/customers', async (req, res) => {
  const { cc_customer, customer_name, address, phone, email } = req.body;
  try {
    await db.query('INSERT INTO public.customers (cc_customer, customer_name, address, phone, email) VALUES ($1, $2, $3, $4, $5)',
      [cc_customer, customer_name, address, phone, email]);
    res.json({ message: 'customer added' });
  } catch (err) {
    res.status(500).json(err);
  }
});


// Update customer
app.put('/customers/:cc', async (req, res) => {
  const { cc } = req.params;
  const { customer_name, address, phone, email } = req.body;
  try {
    const result = await db.query(
      'UPDATE public.customers SET customer_name = $1, address = $2, phone = $3, email = $4 WHERE cc_customer = $5',
      [customer_name, address, phone, email, cc]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'customer no found' });
    res.json({ message: 'customer updated' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete customer
app.delete('/customers/:cc', async (req, res) => {
  const { cc } = req.params;
  try {
    const result = await db.query('DELETE FROM public.customers WHERE cc_customer = $1', [cc]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'customer no found' });
    res.json({ message: 'customer deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Advanced Queries (Postman only)
//1. Total paid by each customer
app.get("/total-paid", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
          c.cc_customer,
          c.customer_name,
          SUM(i.paid_amount) AS total_paid
      FROM customers c
      JOIN invoices i ON c.cc_customer = i.cc_customer
      GROUP BY c.cc_customer, c.customer_name;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//2. Outstanding invoices with customer and associated transaction information
app.get("/pending-invoices", async (req, res) => {
  try {
    const result = await db.query(`
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
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//3. List of transactions by platform
app.get("/transactions/:platform", async (req, res) => {
  try {
    const { platform } = req.params;
    const result = await db.query(`
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
      WHERE t.platform_used = $1;
    `, [platform]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));