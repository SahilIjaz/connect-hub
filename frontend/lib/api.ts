import axios from 'axios';
import { logger } from './logger';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : '/api';

if (typeof window !== 'undefined') {
  logger.info(`API Base URL: ${baseURL}`);
  logger.info(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  logger.apiCall(config.method?.toUpperCase() || 'GET', config.url || '', config.data);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    logger.apiResponse(
      response.config.method?.toUpperCase() || 'GET',
      response.config.url || '',
      response.status,
      response.data
    );
    return response;
  },
  (error) => {
    logger.apiError(
      error.config?.method?.toUpperCase() || 'GET',
      error.config?.url || '',
      error
    );

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        logger.warn('401 Unauthorized - Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
