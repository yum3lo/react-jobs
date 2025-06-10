const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { swaggerUi, specs } = require('./swagger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { get } = require('http');

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
pool.query('SELECT NOW()', (error, res) => {
  if (error) {
    next(error);
  } else {
    console.log('Database connected successfully');
    
    pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='jobs' AND column_name='user_id'
    `).then(result => {
      if (result.rows.length === 0) {
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
    }).catch(error => {
      next(error);
    });
  }
});

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

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

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
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

const formatUserResponse = (user) => ({
  id: user.id,
  username: user.username,
  role: user.role,
  profileImageUrl: user.profile_image_url || null,
  created_at: user.created_at
});

const formatJobResponse = (job) => ({
  id: job.id,
  title: job.title,
  type: job.type,
  description: job.description,
  location: job.location,
  salary: job.salary,
  user_id: job.user_id,
  company: {
    name: job.company_name,
    description: job.company_description
  },
  created_at: job.created_at
});

const runTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getJobById = async (jobId) => {
  const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
  return result.rows[0] || null;
};

const checkApplicationExists = async (jobId, userId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE job_id = $1 AND user_id = $2',
    [jobId, userId]
  );
  return result.rows[0] || null;
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
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const hashedPassword = userResult.rows[0].password;
    const isPasswordValid = await bcrypt.compare(pwd, hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const userObj = formatUserResponse(userResult.rows[0]);
    const accessToken = generateAccessToken(userObj);
    const refreshToken = generateRefreshToken(userObj);
    
    await runTransaction(async (client) => {
      await client.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [refreshToken, userResult.rows[0].id]
      );
      
      const verifyUpdate = await client.query(
        'SELECT refresh_token FROM users WHERE id = $1',
        [userResult.rows[0].id]
      );
      
      if (!verifyUpdate.rows[0]?.refresh_token) {
        throw new Error('Failed to store refresh token');
      }
    });

    res.status(200).json({ 
      message: 'Login successful', 
      user: userObj,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
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

    const userObj = formatUserResponse(result.rows[0]);
    
    const accessToken = generateAccessToken(userObj);
    const refreshToken = generateRefreshToken(userObj);
    
    await runTransaction(async (client) => {
      await client.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [refreshToken, result.rows[0].id]
      );
      
      const verifyUpdate = await client.query(
        'SELECT refresh_token FROM users WHERE id = $1',
        [result.rows[0].id]
      );
      
      if (!verifyUpdate.rows[0]?.refresh_token) {
        throw new Error('Failed to store refresh token');
      }
    });
    
    res.status(200).json({ 
      message: 'Registration successful', 
      user: userObj,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
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
    
    const userObj = formatUserResponse(result.rows[0]);
    
    const accessToken = generateAccessToken(userObj);
    
    res.json({ accessToken });
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
});

app.get('/jobs', async (req, res) => {
  try {
    let query = 'SELECT * FROM jobs';
    const params = [];
    const conditions = [];
    
    if (req.query.user_id) {
      conditions.push(`user_id = $${params.length + 1}`);
      params.push(req.query.user_id);
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
      query = `SELECT * FROM jobs WHERE ${conditions.join(' AND ')}`;
      
      if (req.query._limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(parseInt(req.query._limit));
      }
    } else if (req.query._limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(req.query._limit));
    }
    
    const result = await pool.query(query, params);
    res.json({ jobs: result.rows.map(formatJobResponse) });
  } catch (error) {
    next(error);
  }
});

app.get('/jobs/:id', async (req, res, next) => {
  try {
    const job = await getJobById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(formatJobResponse(job));
  } catch (error) {
    error.message = `Failed to fetch job: ${error.message}`;
    next(error);
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
        company_name, company_description,
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
        userId
      ]
    );
    
    const newJob = result.rows[0];
    res.status(201).json(formatJobResponse(newJob));
  } catch (error) {
    next(error);
  }
});

const checkJobOwnership = async (req, res, next) => {
  try {
    const jobId = req.params.id || req.params.jobId;
    const userId = req.user.id;
    
    const job = await getJobById(jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have permission to access this job' });
    }

    req.job = job;
    next();
  } catch (error) {
    next(error);
  }
};

app.delete('/jobs/:id', authenticateToken, requireJobPoster, checkJobOwnership, async (req, res) => {
  try {
    const jobId = req.params.id;
    
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 RETURNING *',
      [jobId]
    );
    
    res.json({ 
      message: 'Job deleted successfully',
      id: result.rows[0].id
    });
  } catch (error) {
    next(error);
  }
});

app.put('/jobs/:id', authenticateToken, requireJobPoster, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    
    const job = await getJobById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // update only if user owns the job or is an admin
    if (job.user_id !== userId) {
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
        company_description = $7
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
        jobId
      ]
    );
    
    const updatedJob = result.rows[0];
    res.json(formatJobResponse(updatedJob));
  } catch (error) {
    next(error);
  }
});

app.put('/users/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user.id;
    let profileImageUrl = null;
    
    if (req.file) {
      profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      await pool.query(
        'UPDATE users SET profile_image_url = $1 WHERE id = $2',
        [profileImageUrl, userId]
      );
    }
    
    const userResult = await pool.query(
      'SELECT id, username, role, profile_image_url, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(formatUserResponse(userResult.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete('/users/profile/image', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const currentUserData = await pool.query(
      'SELECT profile_image_url FROM users WHERE id = $1',
      [userId]
    );
    
    if (currentUserData.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentImageUrl = currentUserData.rows[0].profile_image_url;
    
    await pool.query(
      'UPDATE users SET profile_image_url = NULL WHERE id = $1',
      [userId]
    );
    
    if (currentImageUrl) {
      try {
        const imagePath = currentImageUrl.split('/uploads/')[1];
        if (imagePath) {
          const fullPath = path.join(uploadsDir, imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      } catch (fileError) {
        console.error('Error deleting profile image file:', fileError);
      }
    }
    
    const userResult = await pool.query(
      'SELECT id, username, role, profile_image_url, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    res.json(formatUserResponse(userResult.rows[0]));
  } catch (error) {
    next(error);
  }
});

// resume upload storage
const resumeStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const resumeDir = path.join(__dirname, 'uploads/resumes');
    if (!fs.existsSync(resumeDir)) {
      fs.mkdirSync(resumeDir, { recursive: true });
    }
    cb(null, resumeDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const resumeUpload = multer({ 
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX files are allowed'));
    }
  }
});

app.post('/jobs/:id/apply', authenticateToken, resumeUpload.single('resume'), async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const { coverLetter } = req.body;
    
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can apply for jobs' });
    }

    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const existingApplication = await checkApplicationExists(jobId, userId);
    if (existingApplication) {
      return res.status(409).json({ error: 'You have already applied for this job' });
    }
    
    let resumePath = null;
    if (req.file) {
      resumePath = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;
    }
    
    const result = await pool.query(
      'INSERT INTO applications (job_id, user_id, resume_path, cover_letter) VALUES ($1, $2, $3, $4) RETURNING *',
      [jobId, userId, resumePath, coverLetter]
    );
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

app.get('/jobs/:id/applications', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    
    const job = await getJobById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have permission to view applications for this job' });
    }
    
    const applications = await pool.query(`
      SELECT a.*, u.username, u.profile_image_url, u.created_at as user_created_at
      FROM applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.job_id = $1
      ORDER BY a.created_at DESC
    `, [jobId]);
    
    res.json({ applications: applications.rows });
  } catch (error) {
    next(error);
  }
});

// approve/reject applications
app.put('/jobs/:jobId/applications/:appId', authenticateToken, async (req, res) => {
  try {
    const { jobId, appId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    const userId = req.user.id;
    
    if (status !== 'approved' && status !== 'rejected') {
      return res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected"' });
    }
    
    const job = await getJobById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have permission to update applications for this job' });
    }
    
    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 AND job_id = $3 RETURNING *',
      [status, appId, jobId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({
      message: 'Application status updated successfully',
      application: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// checking if user has applied to the job
app.get('/jobs/:id/check-application', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    
    const application = await checkApplicationExists(jobId, userId);

    res.json({
      hasApplied: !!application,
      status: application? application.status : null
    });
  } catch (error) {
    next(error);
  }
});

app.get('/users/applications', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can access this endpoint' });
    }
    
    const applications = await pool.query(`
      SELECT a.*, j.title as job_title, j.company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `, [userId]);
    
    res.json({ applications: applications.rows });
  } catch (error) {
    next(error);
  }
});

app.get('/users/pending-applications', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    if (req.user.role !== 'job_poster') {
      return res.status(403).json({ error: 'Only job posters can access this endpoint' });
    }
    
    const applications = await pool.query(`
      SELECT a.*, j.title as job_title, j.id as job_id, u.username as applicant_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      WHERE j.user_id = $1 AND (a.status = 'pending' OR a.status IS NULL)
      ORDER BY a.created_at DESC
    `, [userId]);
    
    res.json({ applications: applications.rows });
  } catch (error) {
    next(error);
  }
});

app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// error handling middleware from express
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});