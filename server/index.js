const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    
    pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='jobs' AND column_name='user_id'
    `).then(result => {
      if (result.rows.length === 0) {
        console.log('Adding user_id column to jobs table...');
        return pool.query('ALTER TABLE jobs ADD COLUMN user_id INTEGER');
      }
    }).then(() => {
      return pool.query(`
        UPDATE jobs SET user_id = (SELECT MIN(id) FROM users WHERE role = 'job_poster')
        WHERE user_id IS NULL
      `);
    }).then(() => {
      return pool.query(`
        ALTER TABLE jobs ADD CONSTRAINT fk_jobs_users
        FOREIGN KEY (user_id) REFERENCES users(id)
      `).catch(err => {
        console.log('Foreign key constraint may already exist:', err.message);
      });
    }).then(() => {
      console.log('Jobs table updated successfully');
    }).catch(err => {
      console.error('Error updating jobs table:', err);
    });
  }
});

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role }, 
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

const requireJobPoster = (req, res, next) => {
  if (req.user.role !== 'job_poster') {
    return res.status(403).json({ message: 'Access denied. Only job posters can perform this action.' });
  }
  next();
};

app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

app.post('/login', async (req, res) => {
  const { user, pwd } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1', 
      [user]
    );
    
    if (userResult.rows.length === 0) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const hashedPassword = userResult.rows[0].password;
    const isPasswordValid = await bcrypt.compare(pwd, hashedPassword);

    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const userObj = {
      id: userResult.rows[0].id,
      username: userResult.rows[0].username,
      role: userResult.rows[0].role
    };
    
    const accessToken = generateAccessToken(userObj);
    const refreshToken = generateRefreshToken(userObj);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      await client.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [refreshToken, userResult.rows[0].id]
      );
      
      const verifyUpdate = await client.query(
        'SELECT refresh_token FROM users WHERE id = $1',
        [userResult.rows[0].id]
      );
      
      if (!verifyUpdate.rows[0]?.refresh_token) {
        console.error('Token update failed - still NULL after update');
        throw new Error('Failed to store refresh token');
      }
      
      await client.query('COMMIT');
      console.log('Refresh token successfully stored for user:', userResult.rows[0].id);
    } catch (tokenError) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', tokenError);
    } finally {
      client.release();
    }

    res.status(200).json({ 
      message: 'Login successful', 
      user: userObj,
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/register', async (req, res) => {
  const { user, pwd, role } = req.body;
  
  const validRole = role === 'job_poster' || role === 'job_seeker';
  if (!validRole) {
    return res.status(400).json({ message: 'Invalid role selected' });
  }
  
  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1', 
      [user]
    );
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(pwd, 10);
    
    // inserts the new user into the database with role
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [user, hashedPassword, role]
    );

    const userObj = {
      id: result.rows[0].id,
      username: result.rows[0].username,
      role: result.rows[0].role
    };
    
    const accessToken = generateAccessToken(userObj);
    const refreshToken = generateRefreshToken(userObj);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      await client.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [refreshToken, result.rows[0].id]
      );
      
      const verifyUpdate = await client.query(
        'SELECT refresh_token FROM users WHERE id = $1',
        [result.rows[0].id]
      );
      
      if (!verifyUpdate.rows[0]?.refresh_token) {
        console.error('Token update failed during registration - still NULL after update');
        throw new Error('Failed to store refresh token');
      }
      
      await client.query('COMMIT');
      console.log('Refresh token successfully stored during registration for user:', result.rows[0].id);
    } catch (tokenError) {
      await client.query('ROLLBACK');
      console.error('Registration transaction error:', tokenError);
    } finally {
      client.release();
    }
    
    res.status(200).json({ 
      message: 'Registration successful', 
      user: userObj,
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND refresh_token = $2',
      [decoded.id, refreshToken]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    const userObj = {
      id: result.rows[0].id,
      username: result.rows[0].username
    };
    
    const accessToken = generateAccessToken(userObj);
    
    res.json({ accessToken });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});

app.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(204).end();
  }
  
  try {
    await pool.query(
      'UPDATE users SET refresh_token = NULL WHERE refresh_token = $1',
      [refreshToken]
    );
    
    res.status(204).end();
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

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
      user_id: job.user_id,
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

app.post('/jobs', authenticateToken, requireJobPoster, async (req, res) => {
  try {
    const { 
      title, 
      type, 
      description, 
      location, 
      salary, 
      company 
    } = req.body;
    
    const userId = req.user.id;
    
    const result = await pool.query(
      `INSERT INTO jobs (
        title, type, description, location, salary,
        company_name, company_description, company_contact_email, company_contact_phone,
        user_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
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
        company.contactPhone,
        userId
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
      },
      user_id: newJob.user_id
    });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Failed to create job', details: err.message });
  }
});

app.delete('/jobs/:id', authenticateToken, requireJobPoster, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    
    const jobCheck = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [jobId]
    );
    
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // delete only if user owns the job or is an admin
    if (jobCheck.rows[0].user_id !== userId) {
      console.error(`Permission denied: User ${userId} tried to delete job ${jobId} owned by ${jobCheck.rows[0].user_id}`);
      return res.status(403).json({ error: 'You do not have permission to delete this job listing' });
    }
    
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 RETURNING *',
      [jobId]
    );
    
    res.json({ 
      message: 'Job deleted successfully',
      id: result.rows[0].id
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      error: 'Failed to delete job',
      details: err.message
    });
  }
});

app.put('/jobs/:id', authenticateToken, requireJobPoster, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    
    const jobCheck = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [jobId]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // update only if user owns the job or is an admin
    if (jobCheck.rows[0].user_id !== userId) {
      console.error(`Permission denied: User ${userId} tried to update job ${jobId} owned by ${jobCheck.rows[0].user_id}`);
      return res.status(403).json({ error: 'You do not have permission to update this job listing' });
    }
    
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
        jobId
      ]
    );
    
    const updatedJob = result.rows[0];
    res.json({
      id: updatedJob.id,
      title: updatedJob.title,
      company: {
        name: updatedJob.company_name,
        description: updatedJob.company_description,
        contactEmail: updatedJob.company_contact_email,
        contactPhone: updatedJob.company_contact_phone
      },
      user_id: updatedJob.user_id
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ 
      error: 'Failed to update job',
      details: err.message
    });
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
      user_id: job.user_id,
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});