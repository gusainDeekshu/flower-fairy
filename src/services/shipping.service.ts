// src/services/shipping.service.ts:
import { apiClient } from '@/lib/api-client';

export const shippingService = {
  calculateShipping: async (payload: {
    storeId: string;
    address: { state: string };
    items: { productId: string; quantity: number }[];
    paymentMethod: 'COD' | 'PREPAID';
    cartTotal: number;
  }) => {
    // Calls the NestJS endpoint we just built
    const { data } = await apiClient.post('/api/v1/shipping/calculate', payload);
    return data;
  }
};