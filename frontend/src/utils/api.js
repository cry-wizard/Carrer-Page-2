import axios from 'axios';

const api = axios.create({
  baseURL: 'https://carrer-page-2.onrender.com/api',
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
