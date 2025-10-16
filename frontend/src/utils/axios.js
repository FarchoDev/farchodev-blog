import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true, // Important: This sends cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      console.error('Unauthorized request:', error.config.url);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
