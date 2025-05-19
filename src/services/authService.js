// authService.js - Handles authentication API calls
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

export const register = (data) => axios.post(`${API_URL}/register`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);
export const forgotPassword = (data) => axios.post(`${API_URL}/forgot-password`, data);
export const resetPassword = (data) => axios.post(`${API_URL}/reset-password`, data);
export const sendVerification = (data) => axios.post(`${API_URL}/send-verification`, data);
export const verifyEmail = (data) => axios.post(`${API_URL}/verify-email`, data);
export const getProfile = (token) => axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (data, token) => axios.put(`${API_URL}/profile`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteAccount = (token) => axios.delete(`${API_URL}/account`, { headers: { Authorization: `Bearer ${token}` } });
export const listUsers = (token) => axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
export const sendFirebaseReset = (data) => axios.post(`${API_URL}/firebase-reset`, data);
export const sendFCM = (data, token) => axios.post(`${API_URL}/fcm`, data, { headers: { Authorization: `Bearer ${token}` } });
