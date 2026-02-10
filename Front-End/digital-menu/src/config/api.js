// API Configuration
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDevelopment ? 'http://127.0.0.1:8000' : 'https://smartdigitalmenu-production.up.railway.app');

export default API_BASE_URL;