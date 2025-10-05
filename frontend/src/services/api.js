const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// The backend in this repo mounts the auth routes under /civix/auth
export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/civix/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/civix/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export default { signupUser, loginUser };
