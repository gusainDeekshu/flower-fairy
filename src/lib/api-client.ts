// src/lib/api-client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log("🔄 [Auth] Refreshing access token...");
        await axios.post('http://localhost:4000/api/v1/auth/refresh', {}, { withCredentials: true });
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.warn("⚠️ [Auth] Refresh failed - Session Expired");
        
        // CRITICAL: Clear both stores so the UI updates
        useAuthStore.getState().setAuth(null, null); 
        useCartStore.getState().clearCart();
        
        return Promise.reject(new Error("Session expired. Please login again."));
      }
    }
    return Promise.reject(error);
  }
);