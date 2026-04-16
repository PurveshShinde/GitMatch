/**
 * API Client Utility
 * Centralized fetch client for all API calls with error handling and token injection
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @param {string} token - JWT token for authorization (optional)
 * @returns {Promise<object>} - Response data
 */
export const apiRequest = async (
  endpoint,
  options = {},
  token = null
) => {
  const defaultOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  // Merge options
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
      // Add authorization header if token exists
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error statuses
      const error = new Error(data.message || "API request failed");
      error.statusCode = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Re-throw error with additional context
    throw {
      message: error.message || "Network error",
      statusCode: error.statusCode || null,
      data: error.data || null,
    };
  }
};

/**
 * GET request
 */
export const apiGet = (endpoint, token = null) => {
  return apiRequest(endpoint, { method: "GET" }, token);
};

/**
 * POST request
 */
export const apiPost = (endpoint, body = {}, token = null) => {
  return apiRequest(
    endpoint,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    token
  );
};

/**
 * PUT request
 */
export const apiPut = (endpoint, body = {}, token = null) => {
  return apiRequest(
    endpoint,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
    token
  );
};

/**
 * PATCH request
 */
export const apiPatch = (endpoint, body = {}, token = null) => {
  return apiRequest(
    endpoint,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
    token
  );
};

/**
 * DELETE request
 */
export const apiDelete = (endpoint, token = null) => {
  return apiRequest(endpoint, { method: "DELETE" }, token);
};

/**
 * Auth API endpoints
 */
export const authAPI = {
  signup: (data) => apiPost("/api/auth/signup", data),
  signin: (data) => apiPost("/api/auth/signin", data),
  google: (data) => apiPost("/api/auth/google", data),
  verifyEmail: (token) => apiGet(`/api/auth/verify-email?token=${token}`),
  resendVerification: (email) => apiPost("/api/auth/resend-verify", { email }),
  forgotPassword: (email) => apiPost("/api/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    apiPost("/api/auth/reset-password", { token, newPassword }),
  getMe: (token) => apiGet("/api/auth/me", token),
  saveOnboarding: (data, token) =>
    apiPost("/api/auth/onboarding", data, token),
  signout: (token) => apiPost("/api/auth/signout", {}, token),
};

export default {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  authAPI,
};
