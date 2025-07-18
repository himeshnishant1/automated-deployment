// Serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Todo = require('../models/todo');
const { createTables } = require('../config/init-db');
require('dotenv').config();

// JWT secret key - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize express for each request (serverless)
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://automated-ai.netlify.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Essential middleware only
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database tables
createTables().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

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
        full_name: user.full_name,
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

// User profile endpoint
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findByEmail(userEmail);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      full_name: user.full_name,
      email: user.email
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Todo endpoints
// Get all todos for a user
app.get('/api/todos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    
    const todos = await Todo.findByUserId(userId, limit);
    res.json(todos);
  } catch (error) {
    console.error('Fetch todos error:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Get a specific todo
app.get('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const todoId = parseInt(req.params.id);
    
    const todo = await Todo.findById(todoId, userId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Fetch todo error:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Create a new todo
app.post('/api/todos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const todo = await Todo.create(userId, title.trim(), description?.trim() || '');
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
app.put('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const todoId = parseInt(req.params.id);
    const { title, description, completed } = req.body;
    
    const todo = await Todo.findById(todoId, userId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const updatedTodo = await Todo.update(todoId, userId, {
      title: title?.trim(),
      description: description?.trim(),
      completed
    });
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Toggle todo completion
app.patch('/api/todos/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const todoId = parseInt(req.params.id);
    
    const todo = await Todo.findById(todoId, userId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const updatedTodo = await Todo.toggleComplete(todoId, userId);
    res.json(updatedTodo);
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const todoId = parseInt(req.params.id);
    
    const todo = await Todo.findById(todoId, userId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    await Todo.delete(todoId, userId);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
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
        signup: '/api/signup',
        userProfile: '/api/user/profile',
        todos: '/api/todos'
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
        signup: '/api/signup',
        userProfile: '/api/user/profile',
        todos: '/api/todos'
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

const PORT = process.env.PORT || 4500;
if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the serverless function
module.exports = app; 