const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500; // axios baseURL

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.post('/register', async (req, res) => {
  const { user, pwd } = req.body;
  
  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1', 
      [user]
    );
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(pwd, 10)
    console.log('Hashed password:', hashedPassword)

    // inserts the new user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [user, hashedPassword]
    );

    res.status(200).json({ message: 'Registration successful', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { user, pwd } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1', 
      [user]
    )
    if (userResult.rows.length === 0) {
      console.log('User not found')
      return res.status(401).json({ message: 'Invalid username or password'})
    }
    // compares the hashed password
    const hashedPassword = userResult.rows[0].password
    const isPasswordValid = await bcrypt.compare(pwd, hashedPassword)

    console.log('Password comparison result:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('Invalid password')
      return res.status(401).json({ message: 'Invalid username or password' })
    }
    res.status(200).json({ message: 'Login successful', user: userResult.rows[0] })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});