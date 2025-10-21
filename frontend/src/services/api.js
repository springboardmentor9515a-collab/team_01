// API Service Layer - Centralized API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Valid roles for client-side validation
const VALID_ROLES = ["citizen", "admin", "volunteer"];

// Role validation helper
export const isValidRole = (role) => {
  return VALID_ROLES.includes(role);
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleMap = {
    citizen: "Citizen",
    admin: "Administrator",
    volunteer: "Volunteer",
  };
  return roleMap[role] || "User";
};

// Enhanced response handler with better error handling
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error("Failed to parse response JSON:", parseError);
    data = {};
  }

  console.log("Response status:", response.status);
  console.log("Response data:", data);

  if (!response.ok) {
    const err = new Error(
      data.message || data.error || `HTTP error! status: ${response.status}`
    );

    // Attach validation details if present
    if (data.details) {
      err.details = data.details;
      console.error("Validation details:", data.details);
    }

    throw err;
  }
  return data;
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Ensure proper headers
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type if there's a body
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  console.log("API Call:", url);
  console.log("Request config:", config);

  const response = await fetch(url, config);
  return handleResponse(response);
};

// Authentication API calls - using existing backend routes
export const signupUser = async (userData) => {
  return apiCall("/civix/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return apiCall("/civix/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const forgotPassword = async (email) => {
  return apiCall("/civix/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// Add token to requests (for protected routes)
export const apiCallWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  return apiCall(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

// Complaint API calls
export const createComplaint = async (complaintData) => {
  return apiCallWithAuth("/civix/complaints/", {
    method: "POST",
    body: JSON.stringify(complaintData),
  });
};

export const getAssignedComplaints = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCallWithAuth(
    `/civix/volunteer/complaints${queryString ? "?" + queryString : ""}`
  );
};

// Citizen: fetch complaints created by the authenticated user
export const getMyComplaints = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCallWithAuth(
    `/civix/complaints/my-complaints${queryString ? "?" + queryString : ""}`
  );
};

export const getAllComplaints = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCallWithAuth(
    `/civix/admin/complaints${queryString ? "?" + queryString : ""}`
  );
};

export const assignComplaint = async (complaintId, officialId) => {
  return apiCallWithAuth("/civix/admin/complaints/assign", {
    method: "PUT",
    body: JSON.stringify({ complaintId, officialId }),
  });
};

export const updateComplaintStatus = async (complaintId, status) => {
  return apiCallWithAuth("/civix/volunteer/complaints/update-status", {
    method: "PUT",
    body: JSON.stringify({ complaintId, status }),
  });
};

export const getVolunteers = async () => {
  return apiCallWithAuth("/civix/admin/volunteers");
};

export const deleteComplaint = async (complaintId) => {
  return apiCallWithAuth(`/civix/complaints/${complaintId}`, {
    method: "DELETE",
  });
};

export default {
  signupUser,
  loginUser,
  forgotPassword,
  apiCallWithAuth,
  createComplaint,
  getAssignedComplaints,
  getMyComplaints,
  getAllComplaints,
  assignComplaint,
  updateComplaintStatus,
  getVolunteers,
  deleteComplaint,
  isValidRole,
  getRoleDisplayName,
};
