# Complete API Testing Guide - Postman

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
- **Headers**: `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected Response**: 200 OK with logout message

## Basic Testing Flow
1. **Signup** → Get user created
2. **Login** → Get token
3. **Use token** in Authorization header for `/auth/me`
4. **Logout** → Token gets invalidated
5. **Try /me again** → Should get 401 error

---

## Validation Testing

### Test Signup Validation

**Valid Signup:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York"
}
```
- Expected: 201 Created

**Invalid Signup Tests:**

**Missing Name:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Expected: 400 with validation error

**Invalid Email:**
```json
{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "password123"
}
```
- Expected: 400 with email validation error

**Short Password:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123"
}
```
- Expected: 400 with password length error

**Invalid Location:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "FakeCity123"
}
```
- Expected: 400 with location validation error

**No Location (Should Work):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- Expected: 201 Created (location is optional)

### Test Login Validation

**Missing Password:**
```json
{
  "email": "john@example.com"
}
```
- Expected: 400 with validation error

**Invalid Email Format:**
```json
{
  "email": "not-an-email",
  "password": "password123"
}
```
- Expected: 400 with email validation error

### Validation Error Response Format
```json
{
  "error": "Validation failed",
  "details": [
    {
      "type": "field",
      "value": "",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    }
  ]
}
```

---

## Location Validation Testing

### Valid Locations (Should Work):
- "New York"
- "London, UK"
- "Paris, France"
- "Tokyo, Japan"
- "Mumbai, India"

### Invalid Locations (Should Fail):
- "FakeCity123"
- "NotARealPlace"
- "XYZ City"

### Location Validation Response:
```json
{
  "error": "Invalid location",
  "message": "Location 'FakeCity123' not found. Please provide a valid location."
}
```

### Testing Tips:
- Location validation adds ~200-500ms to signup requests
- API timeout is 5 seconds
- If OpenStreetMap API is down, validation is skipped
- Location field is optional - empty location works

---

## Rate Limiting Testing

### Current Settings:
- **Limit**: 5 requests per 10 minutes per IP
- **Applies to**: `/signup` and `/login` only
- **Not affected**: `/me` and `/logout`

### Testing Steps:

**1. Test Normal Usage (Should Work):**
- Make 1-4 requests to login/signup
- All should work normally
- Check response headers for rate limit info

**2. Test Rate Limit Trigger:**
- Make 5+ requests quickly to same endpoint
- 6th request should return 429 error

**3. Test Different Endpoints:**
- Make 5 login requests (hits limit)
- Try signup request (should also be blocked - same limiter)
- Try `/me` request (should work - not rate limited)

### Expected Responses:

**Normal Response (1-5 requests):**
- Status: 200/201
- Headers include: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

**Rate Limited Response (6+ requests):**
```json
{
  "error": "Too many requests from this IP",
  "message": "Please try again after 10 minutes", 
  "retryAfter": "10 minutes"
}
```
- Status: 429 Too Many Requests
- Headers include: `Retry-After`

### Quick Rate Limit Test:
1. Make 5 login requests rapidly → Should work
2. Make 6th login request → Should get 429 error
3. Try `/me` endpoint → Should still work (not rate limited)

---

## Common Errors
- **404 Not Found**: Check URL and ensure server is running
- **401 Unauthorized**: Missing or invalid token
- **400 Bad Request**: Invalid input data or validation failed
- **429 Too Many Requests**: Rate limit exceeded
- **500 Server Error**: Check server logs

## Security Features Implemented
- Input validation with express-validator
- Rate limiting on auth endpoints
- NoSQL injection protection
- JWT token authentication with blacklisting
- Password hashing with bcrypt
- Proper error handling

## Testing Tips
- **Rate Limit Reset**: Restart server or wait 10 minutes
- **Token Testing**: Copy token from login response
- **Headers**: Always check response headers for additional info
- **Multiple Tests**: Use Postman collections for batch testing