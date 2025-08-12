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

fs.createReadStream('../docs/docs-csv/transactions.csv')
  .pipe(csv())
  .on('data', (row) => {
    const query = connection.query(
      'INSERT INTO public.transactions (id_transaction, t_date_time, t_amount, t_status, t_type, platform_used, invoice_number) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [row.id_transaction, row.transaction_date_time, row.transaction_amount, row.transaction_status, row.transaction_type , row.platform_used , row.invoice_number]
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
