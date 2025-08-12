import 'dotenv/config';
import fs from 'fs';
import csv from 'csv-parser';
import pkg from 'pg';

const { Pool } = pkg;

// Configuración de PostgreSQL
const connection = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }
});

const inserts = [];

fs.createReadStream('../docs/docs-csv/invoices.csv')
  .pipe(csv())
  .on('data', (row) => {
    const query = connection.query(
      'INSERT INTO public.invoices (invoice_number, billing_period, billed_amount, paid_amount, cc_customer) VALUES ($1, $2, $3, $4, $5)',
      [row.invoice_number, row.billing_period, row.invoiced_amount, row.paid_amount, row.cc_customer]
    );
    inserts.push(query); 
  })
  .on('end', async () => {
    try {
      await Promise.all(inserts);
      console.log(`Se insertaron ${inserts.length} registros correctamente.`);
    } catch (err) {
      console.error('Error durante la inserción:', err);
    } finally {
      await connection.end(); // Cerramos la conexión cuando todo termine
      console.log('Conexión cerrada.');
    }
  });
