// src\services\checkout.service.ts
import { apiClient } from '@/lib/api-client';
import { BuyNowPayload, CheckoutSessionResponse } from '@/types/cart';

export const CheckoutService = {
  buyNow: async (payload: BuyNowPayload): Promise<CheckoutSessionResponse> => {
    const { data } = await apiClient.post('/v1/checkout/buy-now', payload);
    return data;
  }
};