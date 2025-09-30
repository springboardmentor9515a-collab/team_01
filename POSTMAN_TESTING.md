# API Testing Guide - Postman

## Prerequisites
1. Start the backend server: `cd backend && npm start`
2. Server should be running on `http://localhost:5000`

## Available Endpoints

### 1. User Signup
- **Method**: POST
- **URL**: `http://localhost:5000/civix/auth/signup`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York"
}
```
- **Expected Response**: 201 Created with user data

### 2. User Login
- **Method**: POST
- **URL**: `http://localhost:5000/civix/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Expected Response**: 200 OK with token and user data
- **Important**: Copy the `token` from response for next requests

### 3. Get Current User Profile (Protected)
- **Method**: GET
- **URL**: `http://localhost:5000/civix/auth/me`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected Response**: 200 OK with user profile

### 4. User Logout
- **Method**: POST
- **URL**: `http://localhost:5000/civix/auth/logout`
- **Headers**: `Content-Type: application/json`
- **Expected Response**: 200 OK with logout message

### 5. Get All Users
- **Method**: GET
- **URL**: `http://localhost:5000/civix/users`
- **Headers**: `Content-Type: application/json`
- **Expected Response**: 200 OK with users list

## Testing Flow
1. **Signup** → Get user created
2. **Login** → Get token
3. **Use token** in Authorization header for `/auth/me`
4. **Test without token** → Should get 401 error

## Common Errors
- **404 Not Found**: Check URL and ensure server is running
- **401 Unauthorized**: Missing or invalid token
- **400 Bad Request**: Invalid input data
- **500 Server Error**: Check server logs

## Security Features Implemented
- Input validation for all endpoints
- NoSQL injection protection
- JWT token authentication
- Password hashing with bcrypt
- Proper error handling