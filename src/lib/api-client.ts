// src/lib/api-client.ts
import { useAuthStore } from '@/store/useAuthStore';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// --- Types ---
interface RefreshResponse {
  access_token: string;
}

// --- Queue Management ---
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// --- Helper: Normalize Errors (🔥 FIXES YOUR CRASH) ---
const getErrorMessage = (error: any): string => {
  if (!error) return "Unknown error";

  if (typeof error === "string") return error;

  if (error.response?.data?.message)
    return error.response.data.message;

  if (error.message)
    return error.message;

  return "Something went wrong";
};

// --- Axios Instance ---
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  withCredentials: true, // ✅ required for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔑 Token: ${token ? 'YES' : 'NO'}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(getErrorMessage(error))
);

// --- RESPONSE INTERCEPTOR ---
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response.data; // ✅ always return clean data
  },

  async (error) => {
    const originalRequest = error.config as any;
    const status = error.response?.status;

    console.error(`❌ API Error [${status}]:`, getErrorMessage(error));

    // --- TOKEN REFRESH LOGIC ---
    if (status === 401 && !originalRequest?._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(getErrorMessage(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 [Auth] Refreshing access token...");

        const res = await axios.post<RefreshResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.access_token;

        // ✅ Update Zustand store
        useAuthStore.getState().setAccessToken(newToken);

        // ✅ Resolve queued requests
        processQueue(null, newToken);

        // ✅ Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.warn("⚠️ [Auth] Refresh failed");

        processQueue(refreshError, null);

        // ❌ DO NOT force logout here (let UI decide)
        return Promise.reject(getErrorMessage(refreshError));

      } finally {
        isRefreshing = false;
      }
    }

    // --- NORMAL ERROR ---
    return Promise.reject(getErrorMessage(error)); // 🔥 ALWAYS STRING
  }
);