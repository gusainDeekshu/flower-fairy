// src/lib/api-client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken; // Use the token from your store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear local state if the session is truly dead
      useAuthStore.getState().logout(); 
    }
    return Promise.reject(error);
  }
);