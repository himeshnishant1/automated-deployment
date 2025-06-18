// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');

// Initialize express for each request (serverless)
const app = express();

// Essential middleware only
app.use(cors());
app.use(express.json());

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