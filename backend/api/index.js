// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT secret key - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock user database - in production, use a real database
const users = [
  {
    id: 1,
    email: 'test@example.com',
    // Password: test123
    password: '$2a$10$rrCvWWtxC6KFrHB1zgBhOOu0VhYhD.mMqjyPMHKwxcy2wGrEYreUi'
  }
];

// Initialize express for each request (serverless)
const app = express();

// Essential middleware only
app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Root route handler (/)
app.get('/', async (req, res) => {
  try {
    res.json({
      message: 'Welcome to the Serverless API',
      endpoints: {
        root: '/',
        api: '/api',
        health: '/api/health'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route handler (/api)
app.get('/api', async (req, res) => {
  try {
    res.json({
      message: 'Welcome to the API!',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check endpoint (/api/health)
app.get('/api/health', async (req, res) => {
  try {
    res.json({
      status: 'healthy',
      version: '1.0.0',
      serverTime: new Date().toISOString(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Health Check Failed' });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Error handling - must be last
app.use((err, req, res, next) => {
  console.error('Serverless function error:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    requestId: req.headers['x-vercel-id'] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Export the serverless function
module.exports = app; 