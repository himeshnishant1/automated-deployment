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

// Essential middleware only
app.use(cors());
app.use(express.json());

// Initialize database tables
createTables().catch(err => {
  console.error('Failed to initialize database:', err);
});

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

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await User.create(email, password);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
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
        health: '/api/health',
        login: '/api/login',
        register: '/api/register'
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