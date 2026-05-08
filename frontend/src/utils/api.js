// Use relative URL so the Vite proxy routes /api to the backend.
// Falls back to VITE_API_URL for production builds.
const rawApiBaseUrl = import.meta.env.VITE_API_URL || '/api';
const trimmedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = trimmedApiBaseUrl.endsWith('/api')
  ? trimmedApiBaseUrl
  : `${trimmedApiBaseUrl}/api`;

const buildHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const message = data.message || 'Request failed';
    throw new Error(message);
  }
  return data;
};

const api = {
  get: async (path, token) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: buildHeaders(token),
    });
    return handleResponse(res);
  },
  post: async (path, body, token) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  put: async (path, body, token) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(token),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
};

export default api;


