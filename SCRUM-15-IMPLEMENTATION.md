# SCRUM-15 Implementation: User Profile API and Dashboard Welcome Message

## Overview
This implementation adds a new authenticated API endpoint to fetch user profile data and updates the Dashboard component to display the user's full name in the welcome message.

## Backend Changes

### 1. Authentication Middleware
- **File**: `backend/api/index.js`
- **Added**: `authenticateToken` middleware function
- **Purpose**: Validates JWT tokens for protected endpoints
- **Usage**: Applied to the new `/api/user/profile` endpoint

### 2. User Profile API Endpoint
- **File**: `backend/api/index.js`
- **Added**: `GET /api/user/profile` endpoint
- **Authentication**: Required (uses `authenticateToken` middleware)
- **Response**: Returns user's `full_name` and `email`
- **Error Handling**: 401 (no token), 403 (invalid token), 404 (user not found), 500 (server error)

### 3. Updated Login Endpoint
- **File**: `backend/api/index.js`
- **Change**: Now includes `full_name` in the login response
- **Purpose**: Provides immediate access to user's full name after login

## Frontend Changes

### 1. API Configuration
- **File**: `frontend/src/config/api.js`
- **Added**: `USER_PROFILE` endpoint configuration
- **Updated**: API URL to use correct backend port (4500)

### 2. Custom Hook
- **File**: `frontend/src/hooks/useUserProfile.js`
- **Purpose**: Manages user profile data fetching with loading and error states
- **Features**:
  - Automatic token retrieval from localStorage/sessionStorage
  - Loading state management
  - Error handling
  - Automatic API call on component mount

### 3. Updated Dashboard Component
- **File**: `frontend/src/components/Dashboard.jsx`
- **Changes**:
  - Integrated `useUserProfile` hook
  - Updated welcome message logic to use fetched profile data
  - Added loading and error state handling
  - Graceful fallbacks for missing data

## API Endpoints

### GET /api/user/profile
**Authentication**: Required (Bearer token)
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "full_name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses**:
- `401 Unauthorized`: No token provided
- `403 Forbidden`: Invalid token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

## Frontend Integration

### Welcome Message Logic
The Dashboard component now displays welcome messages based on the following priority:

1. **Loading**: "Loading..."
2. **Error**: "Welcome!"
3. **Full Name Available**: "Welcome, [Full Name]!"
4. **Email Only**: "Welcome, User!"
5. **No Data**: "Welcome!"

### State Management
- **Loading State**: Shows "Loading..." while fetching profile
- **Error State**: Gracefully handles API errors without breaking UI
- **Success State**: Displays user's full name when available

## Testing

### Backend Testing
- **File**: `backend/test-user-profile.js`
- **Purpose**: Tests authentication and error handling
- **Usage**: Run with `node test-user-profile.js`

### Frontend Testing
- **File**: `frontend/src/test-user-profile.js`
- **Purpose**: Tests API integration in browser
- **Usage**: Import and call `testUserProfileAPI()` in browser console

## Security Considerations

1. **Token Validation**: All profile requests require valid JWT tokens
2. **User Isolation**: Users can only access their own profile data
3. **Error Handling**: Sensitive information is not exposed in error messages
4. **CORS**: Proper CORS configuration for cross-origin requests

## Dependencies

### Backend
- `jsonwebtoken`: JWT token validation
- `express`: Web framework
- `cors`: Cross-origin resource sharing

### Frontend
- `axios`: HTTP client for API calls
- `react`: UI framework
- `react-router-dom`: Navigation

## Deployment Notes

1. **Environment Variables**: Ensure `JWT_SECRET` is set in production
2. **CORS**: Verify CORS settings match your frontend domain
3. **Database**: Ensure user table has `full_name` column
4. **API URL**: Update frontend API URL for production environment

## Future Enhancements

1. **Profile Updates**: Add PUT endpoint for updating user profile
2. **Avatar Support**: Add profile picture functionality
3. **Caching**: Implement client-side caching for profile data
4. **Real-time Updates**: Add WebSocket support for profile changes 