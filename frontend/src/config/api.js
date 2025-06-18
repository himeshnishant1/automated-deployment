// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://automated-deployment-frontend-uc5h.vercel.app';

// API Endpoints
export const ENDPOINTS = {
  LOGIN: '/api/login',
  SIGNUP: '/api/signup',
  HEALTH: '/api/health'
};

// Create full URLs for each endpoint
export const API_ROUTES = {
  LOGIN: `${API_URL}${ENDPOINTS.LOGIN}`,
  SIGNUP: `${API_URL}${ENDPOINTS.SIGNUP}`,
  HEALTH: `${API_URL}${ENDPOINTS.HEALTH}`
};

// Axios default config
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
}; 