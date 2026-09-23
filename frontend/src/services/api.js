import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Request interceptor to add JWT Bearer token
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('placement_user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on authentication failure
      if (localStorage.getItem('placement_user')) {
        localStorage.removeItem('placement_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
