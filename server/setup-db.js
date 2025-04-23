const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

async function setupDatabase() {
  try {
    const client = await pool.connect();
    console.log('Connected to database');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created users table');

    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(10) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        description TEXT,
        location VARCHAR(100),
        salary VARCHAR(50),
        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created jobs table');
    client.release();
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await pool.end();
  }
}

setupDatabase();