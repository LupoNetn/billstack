import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6060/v1',
  withCredentials: true, // Critical for HTTP-only cookie authentication
});

// Response interceptor for handling 401 and token refresh
api.interceptors.response.use(
  (response) => response.data?.data || response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using the refresh endpoint
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6060/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request after successful refresh
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Pass back the error to be handled by React Query / Components
    return Promise.reject(error);
  }
);

export default api;
