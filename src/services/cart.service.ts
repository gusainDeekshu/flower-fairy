// src/services/cart.service.ts
import { apiClient } from '@/lib/api-client';

export const cartService = {
  getCart: async () => {
    const { data } = await apiClient.get('/cart');
    return data;
  },
  addToCart: async (productId: string, quantity: number) => {
    const { data } = await apiClient.post('/cart/add', { productId, quantity });
    return data;
  },
  updateQuantity: async (productId: string, quantity: number) => {
    const { data } = await apiClient.patch('/cart/update', { productId, quantity });
    return data;
  },
  removeItem: async (productId: string) => {
    await apiClient.delete(`/cart/remove/${productId}`);
  },
  clearCart: async () => {
    await apiClient.delete('/cart/clear');
  }
};