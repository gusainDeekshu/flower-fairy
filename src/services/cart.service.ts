// src/services/cart.service.ts

import { apiClient } from "@/lib/api-client";
import { AddToCartPayload } from "@/types/cart";

export const CartService = {
  getCart: async () => {
    const { data } = await apiClient.get("/cart");
    return data;
  },

  // 🔥 FIXED: Matches Backend @Post('add')
  addToCart: async (payload: AddToCartPayload) => {
    const { data } = await apiClient.post("/cart/add", payload);
    return data;
  },

  // 🔥 FIXED: Matches Backend @Patch(':productId')
  updateQuantity: async (payload: { productId: string; quantity: number; variantId?: string }) => {
    const { data } = await apiClient.patch(`/cart/${payload.productId}`, {
      quantity: payload.quantity,
      variantId: payload.variantId
    });
    return data;
  },

  // 🔥 FIXED: Matches Backend @Delete(':productId')
  removeItem: async (payload: { productId: string; variantId?: string }) => {
    const { data } = await apiClient.delete(`/cart/${payload.productId}`, { 
      data: { variantId: payload.variantId } 
    });
    return data;
  },

  clearCart: async () => {
    const { data } = await apiClient.delete("/cart");
    return data;
  },

  // Matches Backend @Post('merge')
  mergeCart: async (payload: { items: AddToCartPayload[] }) => {
    const { data } = await apiClient.post("/cart/merge", payload);
    return data;
  },
};