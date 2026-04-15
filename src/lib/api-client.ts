// src/lib/api-client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// This "Augmentation" tells TS that axios methods return the data directly
declare module "axios" {
  export interface AxiosInstance {
    request<T = any, R = T>(config: AxiosRequestConfig): Promise<R>;
    get<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    delete<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    head<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    options<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    put<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    patch<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Forces browser to send HttpOnly cookies
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use((config) => {
  // 1. Attach JWT Access Token if logged in
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Attach Guest Session ID (Crucial for the Cart API)
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('guest_session_id');
    
    if (!sessionId) {
      sessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('guest_session_id', sessionId);
    }
    
    // Add the header expected by the backend
    config.headers['x-session-id'] = sessionId;
  }

  return config;
});

// Variables to handle parallel requests during a refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 & Token Rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚨 FIX 1: Prevent infinite loops if the refresh endpoint itself fails
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        })
        .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🚨 FIX 2: Use raw 'axios' instead of 'apiClient' to bypass interceptors for the refresh call
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true } // Send the secure cookie
        );
        
        // Save new access token to Zustand store
        useAuthStore.getState().setAuth(data.user, data.access_token);
        
        // Process queue and retry failed requests
        processQueue(null, data.access_token);
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        
        // Wipe frontend state
        useAuthStore.getState().logout(); 

        // 🚨 FIX 3: Stop redirecting to 404 '/login'. 
        // Only kick the user to Home '/' if they are looking at protected data.
        if (typeof window !== 'undefined') {
          const protectedRoutes = ['/profile', '/checkout'];
          const currentPath = window.location.pathname;
          
          if (protectedRoutes.some(route => currentPath.startsWith(route))) {
             window.location.href = '/'; 
          }
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);