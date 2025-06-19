// Simple test script for user profile endpoint
const axios = require('axios');

const API_URL = 'http://localhost:4500';

async function testUserProfile() {
  try {
    console.log('Testing user profile endpoint...');
    
    // First, try to access without token (should fail)
    console.log('\n1. Testing without token:');
    try {
      await axios.get(`${API_URL}/api/user/profile`);
    } catch (error) {
      console.log('✅ Expected error:', error.response?.data?.error || error.message);
    }
    
    // Test with invalid token (should fail)
    console.log('\n2. Testing with invalid token:');
    try {
      await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: 'Bearer invalid-token' }
      });
    } catch (error) {
      console.log('✅ Expected error:', error.response?.data?.error || error.message);
    }
    
    console.log('\n✅ User profile endpoint tests completed!');
    console.log('Note: To test with valid token, you need to login first and use the returned token.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUserProfile(); 