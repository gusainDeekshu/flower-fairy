import { useAuthStore } from "@/store/useAuthStore";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getGuestSessionId } from './session';

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

// 1. Create the instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  withCredentials: true, // Critical for sending HTTP-Only cookies
});

/**
 * REQUEST INTERCEPTOR
 * 1. Attaches the Access Token (from Zustand RAM) to every outgoing request.
 * 2. Attaches the Tenant Domain so the backend knows which store to query dynamically.
 */
apiClient.interceptors.request.use((config) => {
  // Attach Guest Session ID
  const sessionId = getGuestSessionId();
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }
  
  const token = useAuthStore.getState().accessToken;

  // 1. Auth Headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Dynamic Tenant Domain (Multi-tenant Architecture)
  // Ensures the backend can resolve `storeSlug` via domain/hostname
  if (typeof window !== "undefined") {
    config.headers["x-tenant-domain"] = window.location.hostname;
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR
 * 1. Unwraps data so components get { user, token } directly.
 * 2. Handles 401 Unauthorized errors by attempting a "Silent Refresh".
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return the nested data so we don't have to call .data.data in our components
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // 🔥 FIX: Check if this is an authentication route
    // We do NOT want to trigger a silent refresh if an OTP simply failed verification.
    const isAuthRoute = originalRequest.url?.includes('/auth/verify-otp') || 
                        originalRequest.url?.includes('/auth/refresh') ||
                        originalRequest.url?.includes('/auth/me');

    // 401 means Access Token expired. We try to refresh using the HTTP-Only cookie.
    // We check !originalRequest._retry to prevent infinite loops if refresh also fails.
    // 🔥 Added `&& !isAuthRoute` to prevent the interceptor loop
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        // We use the raw axios instance here to avoid the interceptors for the refresh call
        const refreshResponse = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // The backend returns { access_token, user }
        const { access_token, user } = refreshResponse.data;

        // Update the Zustand store (RAM only, as we discussed for security)
        useAuthStore.getState().setAuth(user, access_token);

        // Update the failed request's header and retry it
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired or invalid - Force Logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// We export it as default to satisfy Next.js/Turbopack requirements
export default apiClient;