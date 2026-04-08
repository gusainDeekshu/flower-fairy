// src/services/shipping.service.ts:
import { apiClient } from '@/lib/api-client';

export const shippingService = {
  calculate: async (cartItems: any[], state: string) => {
    const { data } = await apiClient.post('/shipping/calculate', {
      items: cartItems,
      state
    });
    return data;
  },
  calculateShipping: async (payload: {
    storeId: string;
    address: { state: string };
    items: { productId: string; quantity: number }[];
    paymentMethod: 'COD' | 'PREPAID';
    cartTotal: number;
  }) => {
    // Note: If your apiClient already has '/api' configured in its baseURL, 
    // change this to just '/v1/shipping/calculate'
    const { data } = await apiClient.post('/shipping/calculate', payload);
    return data;
  }
};