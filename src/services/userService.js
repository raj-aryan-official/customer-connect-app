// userService.js - Handles user profile and password API calls
const API = '/api/user';

export async function updateProfile(data) {
  const res = await fetch(`${API}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function changePassword(data) {
  const res = await fetch(`${API}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  return res.json();
}
