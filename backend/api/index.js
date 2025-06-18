// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { createTables } = require('../config/init-db');
require('dotenv').config();

// JWT secret key - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize express for each request (serverless)
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://automated-deployment-frontend-uc5h.vercel.app']
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Essential middleware only
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database tables
createTables().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Input validation middleware
const validateSignup = (req, res, next) => {
  const { full_name, email, password, confirm_password } = req.body;
  
  if (!full_name || !email || !password || !confirm_password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

// Rate limiting (simple implementation)
const signupAttempts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const rateLimitSignup = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (signupAttempts.has(ip)) {
    const attempts = signupAttempts.get(ip);
    const windowStart = attempts.timestamp;
    
    if (now - windowStart < RATE_LIMIT_WINDOW) {
      if (attempts.count >= MAX_ATTEMPTS) {
        return res.status(429).json({ 
          error: 'Too many signup attempts. Please try again later.' 
        });
      }
      attempts.count++;
    } else {
      signupAttempts.set(ip, { count: 1, timestamp: now });
    }
  } else {
    signupAttempts.set(ip, { count: 1, timestamp: now });
  }
  
  next();
};

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(user, password);
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

// Signup endpoint
app.post('/api/signup', rateLimitSignup, validateSignup, async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await User.create(full_name, email, password);
    
    // Generate JWT token for immediate login
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
        health: '/api/health',
        login: '/api/login',
        signup: '/api/signup'
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
      message: 'API is running',
      endpoints: {
        login: '/api/login',
        signup: '/api/signup'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the serverless function
module.exports = app; 