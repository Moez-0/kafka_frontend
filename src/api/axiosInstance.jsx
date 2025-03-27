import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend API URL
});

// Intercept requests to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Access the user from AuthContext (You should pass the user info into the config here)
    const user = JSON.parse(localStorage.getItem('user')); // Or access global user state here directly
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
