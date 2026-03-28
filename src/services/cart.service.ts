//src\services\cart.service.ts
import apiClient from "@/lib/api-client";

export const cartService = {
  getCart: () => apiClient.get('/cart'),
  
  addToCart: (productId: string, quantity: number) => 
    apiClient.post('/cart/add', { productId, quantity }),
    
  updateQuantity: (productId: string, quantity: number) => 
    apiClient.patch('/cart/update', { productId, quantity }),
    
  removeItem: (productId: string) => 
    apiClient.delete(`/cart/remove/${productId}`),
    
  clearCart: () => apiClient.delete('/cart/clear'),
};