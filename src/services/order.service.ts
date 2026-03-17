// src/services/order.service.ts
import { apiClient } from '@/lib/api-client';

export const orderService = {
  async createOrder(storeId: string) {
    const { data } = await apiClient.post('/orders/create', { storeId });
    return data;
  },

  async getMyOrders() {
    const { data } = await apiClient.get('/orders/my-orders');
    return data;
  }
};