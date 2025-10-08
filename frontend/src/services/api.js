// API Service Layer - Centralized API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Enhanced response handler with better error handling
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    if (data.details) err.details = data.details;
    throw err;
  }
  return data;
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};

// Authentication API calls - using existing backend routes
export const signupUser = async (userData) => {
  return apiCall('/civix/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return apiCall('/civix/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const forgotPassword = async (email) => {
  return apiCall('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// Add token to requests (for protected routes)
export const apiCallWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  return apiCall(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

export default { signupUser, loginUser, forgotPassword, apiCallWithAuth };
