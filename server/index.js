const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3500; // my axios baseURL

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'react_jobs',
  password: 'password',
  port: 5432
});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // the React app URL
  credentials: true
}));

app.post('/register', async (req, res) => {
  const { user, pwd } = req.body;
  
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [user]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // inserts the new user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [user, pwd]
    );

    res.status(200).json({ message: 'Registration successful', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});