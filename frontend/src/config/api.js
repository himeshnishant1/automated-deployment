// API Configuration
const isDev = import.meta.env.MODE === 'development' || window.location.hostname === 'localhost';
export const API_URL = isDev
  ? 'http://localhost:4000'
  : 'https://automated-deployment-frontend-uc5h.vercel.app';

// API Endpoints
export const ENDPOINTS = {
  LOGIN: '/api/login',
  SIGNUP: '/api/signup',
  HEALTH: '/api/health',
  USER_PROFILE: '/api/user/profile',
  TODOS: '/api/todos'
};

// Create full URLs for each endpoint
export const API_ROUTES = {
  LOGIN: `${API_URL}${ENDPOINTS.LOGIN}`,
  SIGNUP: `${API_URL}${ENDPOINTS.SIGNUP}`,
  HEALTH: `${API_URL}${ENDPOINTS.HEALTH}`,
  USER_PROFILE: `${API_URL}${ENDPOINTS.USER_PROFILE}`,
  TODOS: `${API_URL}${ENDPOINTS.TODOS}`
};

// Axios default config
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  credentials: 'include'
}; 