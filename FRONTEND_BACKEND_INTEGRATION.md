# Frontend-Backend Integration Guide

## Overview
This guide explains how to integrate login, signup, and forgot password pages with the backend using environment variables.

## Step 1: Environment Variables Setup

### Create Environment File
Create `.env` file in `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Team01App
```

### Environment Files Structure
```
frontend/
├── .env                    # Default values
├── .env.local             # Local overrides (add to .gitignore)
├── .env.development       # Development environment
└── .env.production        # Production environment
```

### Important Notes
- Variables MUST start with `VITE_` prefix
- Restart dev server after changing env files
- Add `.env.local` to `.gitignore`
- Frontend env vars are PUBLIC (visible in browser)

## Step 2: API Service Layer

### Create API Service File
Create `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Login API call
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};

// Signup API call
export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Forgot Password API call
export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
};
```

## Step 3: Authentication Context

### Create Auth Context
Create `src/context/AuthContext.jsx`:
```javascript
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Step 4: Component Integration Examples

### Login Component Example
```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await loginUser(formData);
      if (response.token) {
        login(response.user, response.token);
        // Redirect to dashboard
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required 
      />
      <input 
        type="password" 
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Signup Component Example
```javascript
import { useState } from 'react';
import { signupUser } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await signupUser(formData);
      if (response.message) {
        // Show success message and redirect to login
      }
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Similar form structure as login
};
```

### Forgot Password Component Example
```javascript
import { useState } from 'react';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await forgotPassword(email);
      if (response.message) {
        // Show success message
      }
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Form with email input only
};
```

## Step 5: Backend Requirements

### Required API Endpoints
Your backend should have these endpoints:

```javascript
// Expected endpoints in backend
POST /api/auth/login
POST /api/auth/signup  
POST /api/auth/forgot-password
```

### Expected Request/Response Format

**Login:**
- Request: `{ email: "user@email.com", password: "password123" }`
- Response: `{ token: "jwt_token", user: { id, name, email } }`

**Signup:**
- Request: `{ name: "John", email: "user@email.com", password: "password123" }`
- Response: `{ message: "User created successfully", user: { id, name, email } }`

**Forgot Password:**
- Request: `{ email: "user@email.com" }`
- Response: `{ message: "Password reset email sent" }`

### CORS Configuration Required
Backend must allow frontend origin:
```javascript
// In your backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## Step 6: Implementation Steps

### For Each Developer:

1. **Setup Environment**
   ```bash
   cd frontend
   # Create .env file with VITE_API_BASE_URL
   ```

2. **Install Dependencies** (if needed)
   ```bash
   npm install
   ```

3. **Create API Service**
   - Create `src/services/api.js`
   - Add API functions using environment variables

4. **Create Auth Context**
   - Create `src/context/AuthContext.jsx`
   - Wrap App with AuthProvider

5. **Update Components**
   - Import API functions
   - Add form handling
   - Add loading states
   - Add error handling

6. **Test Integration**
   - Start backend: `cd backend && npm start`
   - Start frontend: `cd frontend && npm run dev`
   - Test all three pages

## Step 7: Different Environments

### Development
`.env.development`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Production
`.env.production`:
```env
VITE_API_BASE_URL=https://your-production-api.com
```

### Local Override
`.env.local` (add to .gitignore):
```env
VITE_API_BASE_URL=http://localhost:3001
```

## Troubleshooting

### Common Issues:
1. **CORS Error**: Check backend CORS configuration
2. **Environment Variable Not Found**: Ensure `VITE_` prefix and restart dev server
3. **Network Error**: Verify backend is running on correct port
4. **Token Issues**: Check localStorage and token format

### Debug Tips:
```javascript
// Check environment variables
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);

// Check API responses
console.log('Response:', response);
```

## Security Notes

- Frontend environment variables are PUBLIC
- Never put secrets in frontend env files
- Store JWT tokens securely (localStorage or httpOnly cookies)
- Implement token expiration handling
- Add request/response interceptors for error handling

## File Structure After Implementation

```
frontend/
├── .env
├── .env.local (gitignored)
├── src/
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ForgotPassword.jsx
│   └── App.jsx
└── package.json
```

This guide provides the foundation for secure, maintainable frontend-backend integration using environment variables.