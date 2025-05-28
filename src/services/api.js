import toast from 'react-hot-toast';

const BASE_URL = '/api';

function getAuthHeader(endpoint) {
  const token = localStorage.getItem('token');
  // Do not send auth header for login or register endpoints
  if (!token || endpoint === '/auth/login' || endpoint === '/auth/register') {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

export async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(endpoint),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized globally
  if (res.status === 401) {
    toast.error('Session expired. Please log in again.');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setTimeout(() => window.location.href = '/login', 1000);
    throw new Error('Unauthorized');
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}