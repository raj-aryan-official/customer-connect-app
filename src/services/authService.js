import { apiFetch } from './api';

export function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(user) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}