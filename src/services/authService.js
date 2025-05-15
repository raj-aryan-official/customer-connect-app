// authService.js - Handles authentication API calls
const API = '/api/auth';

export async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function register(data) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function logout() {
  await fetch(`${API}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}
