const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT ? Number.parseInt(process.env.PGPORT, 10) : 5432,
  database: process.env.PGDATABASE || 'todos',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || ''
});

async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } finally {
    client.release();
  }
}

init().catch(err => {
  console.error('Failed to initialize database', err);
  // don't exit process immediately to allow app to start and surface errors in requests
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
