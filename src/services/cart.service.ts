import { apiClient } from '@/lib/api-client';
import { AddToCartPayload } from '@/types/cart';

export const CartService = {
  getCart: async () => {
    // Assuming backend routes start with /cart as designed earlier
    const { data } = await apiClient.get('/cart');
    return data;
  },

  addToCart: async (payload: AddToCartPayload) => {
    const { data } = await apiClient.post('/cart/items', payload);
    return data;
  },

  updateQuantity: async (payload: { productId: string; variantId?: string; quantity: number }) => {
    const { data } = await apiClient.patch('/cart/items', payload);
    return data;
  },

  removeItem: async (payload: { productId: string; variantId?: string }) => {
    // Axios DELETE requests pass bodies using the `data` property
    const { data } = await apiClient.delete('/cart/items', { data: payload });
    return data;
  },

  clearCart: async () => {
    const { data } = await apiClient.delete('/cart');
    return data;
  },

  // Call this right after a successful user login!
  mergeCart: async () => {
    const { data } = await apiClient.post('/cart/merge');
    return data;
  }
};