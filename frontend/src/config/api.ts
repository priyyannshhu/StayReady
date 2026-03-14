const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

export { API_BASE_URL, ML_SERVICE_URL, ENVIRONMENT };
