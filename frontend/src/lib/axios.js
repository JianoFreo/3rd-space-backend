import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api' });
api.interceptors.request.use(config => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const getStoredUser = () => { try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null } };
export const setSession = (data) => { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); };
export const clearSession = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); };
