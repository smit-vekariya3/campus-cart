import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This is the magic part that fixes "Save Item"
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;