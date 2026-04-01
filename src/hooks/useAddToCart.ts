//src\hooks\useAddToCart.ts
import {apiClient} from "@/lib/api-client";
import {
  CartResponse,
  AddToCartPayload,
} from "@/types/cart";

export const CartApi = {
  getCart: async (): Promise<CartResponse> => {
    const { data } = await apiClient.get("/cart");
    return data;
  },

  addToCart: async (
    payload: AddToCartPayload
  ): Promise<CartResponse> => {
    const { data } = await apiClient.post("/cart/add", payload);
    return data;
  },

  updateQuantity: async (
    payload: AddToCartPayload
  ): Promise<CartResponse> => {
    const { data } = await apiClient.patch(
      "/cart/update",
      payload
    );
    return data;
  },

  removeItem: async (
    productId: string
  ): Promise<CartResponse> => {
    const { data } = await apiClient.delete(
      `/cart/remove/${productId}`
    );
    return data;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart/clear");
  },
};