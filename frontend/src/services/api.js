const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.message || data.error || 'Something went wrong');
    // attach validation details if present
    if (data.details) err.details = data.details;
    throw err;
  }
  return data;
};

// The backend in this repo mounts the auth routes under /civix/auth
export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/civix/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/civix/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export default { signupUser, loginUser };
