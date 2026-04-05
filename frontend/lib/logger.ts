// Logger utility for debugging
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log('[APP]', ...args);
    }
  },

  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },

  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },

  info: (...args: any[]) => {
    console.info('[INFO]', ...args);
  },

  debug: (label: string, data: any) => {
    if (isDev) {
      console.group(`[DEBUG] ${label}`);
      console.log(data);
      console.groupEnd();
    }
  },

  apiCall: (method: string, url: string, data?: any) => {
    console.log(`[API] ${method} ${url}`, data || '');
  },

  apiResponse: (method: string, url: string, status: number, data: any) => {
    console.log(`[API RESPONSE] ${method} ${url} - Status: ${status}`, data);
  },

  apiError: (method: string, url: string, error: any) => {
    console.error(`[API ERROR] ${method} ${url}`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      error,
    });
  },
};
