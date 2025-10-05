// API Service Layer - Centralized API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Authentication API calls
// export const loginUser = async (credentials) => {
//   return apiCall('/api/auth/login', {
//     method: 'POST',
//     body: JSON.stringify(credentials),
//   });
// };

// export const signupUser = async (userData) => {
//   return apiCall('/api/auth/signup', {
//     method: 'POST',
//     body: JSON.stringify(userData),
//   });
// };

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