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

const inserts = []; // Aquí acumularemos las promesas

fs.createReadStream('../docs/docs-csv/customers.csv')
  .pipe(csv())
  .on('data', (row) => {
    const query = connection.query(
      'INSERT INTO public.customers (cc_customer, customer_name, address, phone, email) VALUES ($1, $2, $3, $4, $5)',
      [row.cc_customer, row.customer_name, row.address, row.phone, row.email]
    );
    inserts.push(query); // Guardamos la promesa
  })
  .on('end', async () => {
    try {
      await Promise.all(inserts); // Esperamos a que todos los inserts terminen
      console.log(`Se insertaron ${inserts.length} registros correctamente.`);
    } catch (err) {
      console.error('Error durante la inserción:', err);
    } finally {
      await connection.end(); // Cerramos la conexión cuando todo termine
      console.log('Conexión cerrada.');
    }
  });
