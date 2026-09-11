import axios from 'axios';
import { API_URL } from '../config/api.js';

// Cookie session: browser sends httpOnly JWT automatically.
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith('/auth')) {
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  },
);

export const api = instance;
export default instance;
