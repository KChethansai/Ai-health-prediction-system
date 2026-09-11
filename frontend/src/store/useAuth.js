import { create } from 'zustand';
import axios from '@/api/axios';
const useAuth = create((set) => ({
  user: null,
  loading: true,
  login: async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });
    set({ user: data.user, loading: false });
  },
  signup: async (email, password, fullName) => {
    const { data } = await axios.post('/auth/signup', { email, password, fullName });
    set({ user: data.user, loading: false });
  },
  logout: async () => {
    await axios.post('/auth/logout');
    set({ user: null });
  },
  me: async () => {
    try {
      const { data } = await axios.get('/auth/me');
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
var useAuth_default = useAuth;
export {
  useAuth_default as default,
  useAuth,
};
