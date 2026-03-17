// src/lib/api-client.ts
import { useAuthStore } from '@/store/useAuthStore';
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// --- Types ---
interface RefreshResponse {
  access_token: string;
}

// --- Queue Management for Concurrent Refresh Calls ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// --- Instance Creation ---
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  withCredentials: true, // Crucial for HttpOnly Cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    // DEBUG LOG: Frontend Request Sending
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔑 [API Token Status] ${token ? 'Token Attached' : 'No Token Found'}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Success] ${response.status} from ${response.config.url}`);
    return response.data; // Flattens the response so you don't need .data in services
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // --- TOKEN ROTATION LOGIC ---
    if (status === 401 && !originalRequest._retry) {
      
      // If a refresh is already in progress, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 [Auth] Access token expired. Attempting silent refresh...");

        // Call standard axios directly to avoid interceptor recursion
        const refreshResponse = await axios.post<RefreshResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.access_token;

        // Update Zustand Store (In-memory)
        useAuthStore.getState().setAccessToken(newAccessToken);
        
        // Process the queue with the new token
        processQueue(null, newAccessToken);
        
        // Update current request and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.error("❌ [Auth] Refresh failed. Session invalid.");
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject("Session expired. Please login again.");
      } finally {
        isRefreshing = false;
      }
    }

    // --- GLOBAL ERROR HANDLING ---
    const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
    console.error(`❌ [API Error ${status}]:`, errorMessage);
    
    return Promise.reject(errorMessage);
  }
);