const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500;

let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false 
    }
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });
}

// test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

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

app.get('/jobs', async (req, res) => {
  try {
    let query = 'SELECT * FROM jobs';
    const limit = req.query._limit;
    const params = [];
    const conditions = [];

    if (limit && !isNaN(limit)) {
      query += ` LIMIT $${params.length + 1}`; // + 1 for the next parameter index
      params.push(parseInt(limit));
    }

    if (req.query.location) {
      conditions.push(`location ILIKE $${params.length + 1}`);
      params.push(`%${req.query.location}%`);
    }
    if (req.query.type) {
      conditions.push(`type = $${params.length + 1}`);
      params.push(req.query.type);
    }
    if (req.query.salary) {
      conditions.push(`salary = $${params.length + 1}`);
      params.push(req.query.salary);
    }
    if (conditions.length > 0) {
      query = `SELECT * FROM jobs WHERE ${conditions.join(' AND ')}` + (req.query._limit ? ` LIMIT $${params.length + 1}` : '');
    }

    const result = await pool.query(query, params);
    
    res.json({ jobs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/jobs/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const job = result.rows[0];
    res.json({
      id: job.id,
      title: job.title,
      type: job.type,
      description: job.description,
      location: job.location,
      salary: job.salary,
      company: {
        name: job.company_name,
        description: job.company_description,
        contactEmail: job.company_contact_email,
        contactPhone: job.company_contact_phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

app.post('/jobs', async (req, res) => {
  try {
    const { 
      title, 
      type, 
      description, 
      location, 
      salary, 
      company 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO jobs (
        title, type, description, location, salary,
        company_name, company_description, company_contact_email, company_contact_phone
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING *`,
      [
        title,
        type,
        description,
        location,
        salary,
        company.name,
        company.description,
        company.contactEmail,
        company.contactPhone
      ]
    );
    
    const newJob = result.rows[0];
    res.status(201).json({
      id: newJob.id,
      title: newJob.title,
      company: {
        name: newJob.company_name,
        description: newJob.company_description,
        contactEmail: newJob.company_contact_email,
        contactPhone: newJob.company_contact_phone
      }
    });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Failed to create job', details: err.message });
  }
});

app.delete('/jobs/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Job not found' 
      });
    }
    
    res.json({ 
      message: 'Job deleted successfully'
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      error: 'Failed to delete job' 
    });
  }
});

app.put('/jobs/:id', async (req, res) => {
  try {
    const { 
      title, 
      type, 
      description, 
      location, 
      salary, 
      company 
    } = req.body;
    
    const result = await pool.query(
      `UPDATE jobs SET
        title = $1,
        type = $2,
        description = $3,
        location = $4,
        salary = $5,
        company_name = $6,
        company_description = $7,
        company_contact_email = $8,
        company_contact_phone = $9
      WHERE id = $10
      RETURNING *`,
      [
        title,
        type,
        description,
        location,
        salary,
        company.name,
        company.description,
        company.contactEmail,
        company.contactPhone,
        req.params.id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const updatedJob = result.rows[0];
    res.json({
      id: updatedJob.id,
      title: updatedJob.title,
      company: {
        name: updatedJob.company_name,
        description: updatedJob.company_description,
        contactEmail: updatedJob.company_contact_email,
        contactPhone: updatedJob.company_contact_phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});