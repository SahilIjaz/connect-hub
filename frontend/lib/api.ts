import axios from 'axios';
import { logger } from './logger';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : '/api';

if (typeof window !== 'undefined') {
  console.log('=== API INITIALIZATION ===');
  console.log('NEXT_PUBLIC_API_URL env:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Final baseURL:', baseURL);
  console.log('========================');
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
    console.log('[SUCCESS]', response.config.method?.toUpperCase(), response.config.url);
    logger.apiResponse(
      response.config.method?.toUpperCase() || 'GET',
      response.config.url || '',
      response.status,
      response.data
    );
    return response;
  },
  (error) => {
    console.error('[NETWORK ERROR] Full error object:', error);
    console.error('[NETWORK ERROR] Message:', error.message);
    console.error('[NETWORK ERROR] Code:', error.code);
    console.error('[NETWORK ERROR] URL attempted:', error.config?.url);
    console.error('[NETWORK ERROR] Response status:', error.response?.status);
    console.error('[NETWORK ERROR] Response data:', error.response?.data);

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
