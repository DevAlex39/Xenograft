import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('xg_user') || 'null'));
  const token = ref(localStorage.getItem('xg_token') || null);

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  function setAuth(data) {
    token.value = data.token;
    user.value  = data.user;
    localStorage.setItem('xg_token', data.token);
    localStorage.setItem('xg_user', JSON.stringify(data.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }

  function logout() {
    token.value = null;
    user.value  = null;
    localStorage.removeItem('xg_token');
    localStorage.removeItem('xg_user');
    delete axios.defaults.headers.common['Authorization'];
  }

  async function init() {
    if (!token.value) return;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    try {
      const { data } = await axios.get('/api/auth/me');
      user.value = data.user;
      localStorage.setItem('xg_user', JSON.stringify(data.user));
    } catch {
      logout();
    }
  }

  async function login(login, password) {
    const { data } = await axios.post('/api/auth/login', { login, password });
    setAuth(data);
  }

  async function register(payload) {
    const { data } = await axios.post('/api/auth/register', payload);
    setAuth(data);
  }

  return { user, token, isLoggedIn, init, login, register, logout, setAuth };
});
