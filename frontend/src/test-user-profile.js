// Simple test for useUserProfile hook
// This can be run in the browser console to test the hook

import { API_ROUTES, API_CONFIG } from './config/api.js';

async function testUserProfileAPI() {
  try {
    console.log('Testing user profile API...');
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      console.log('❌ No token found. Please login first.');
      return;
    }
    
    console.log('✅ Token found, testing API call...');
    
    const response = await fetch(API_ROUTES.USER_PROFILE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API call successful:', data);
    } else {
      const error = await response.json();
      console.log('❌ API call failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testUserProfileAPI = testUserProfileAPI;
}

export { testUserProfileAPI }; 