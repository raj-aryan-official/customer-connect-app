// userService.js - Handles user profile and password API calls
import { apiFetch } from './api';

export function updateProfile(data) {
  return apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function changePassword(data) {
  return apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}