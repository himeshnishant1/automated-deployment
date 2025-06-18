// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');

// Initialize express for each request (serverless)
const app = express();

// Essential middleware only
app.use(cors());
app.use(express.json());

// Simple API route - quick response
app.get('/api', async (req, res) => {
  try {
    res.json({
      message: 'Welcome to the API!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check - quick response
app.get('/api/health', async (req, res) => {
  try {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Health Check Failed' });
  }
});

// Error handling - must be last
app.use((err, req, res, next) => {
  console.error('Serverless function error:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    requestId: req.headers['x-vercel-id'] || 'unknown'
  });
});

// Export the serverless function
module.exports = app; 