// src/hooks/useAddToCart.ts
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { CartResponse, AddToCartPayload } from "@/types/cart";

// 1. Your existing API calls
export const CartApi = {
  getCart: async (): Promise<CartResponse> => {
    const { data } = await apiClient.get("/cart");
    return data;
  },

  addToCart: async (payload: AddToCartPayload): Promise<CartResponse> => {
    const { data } = await apiClient.post("/cart/add", payload);
    return data;
  },

  updateQuantity: async (payload: AddToCartPayload): Promise<CartResponse> => {
    const { data } = await apiClient.patch("/cart/update", payload);
    return data;
  },

  removeItem: async (productId: string): Promise<CartResponse> => {
    const { data } = await apiClient.delete(`/cart/remove/${productId}`);
    return data;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart/clear");
  },
};

// 2. 🔥 ADD THIS: The actual React Hook that ProductCard is looking for
export function useAddToCart() {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (product: any) => {
    if (!product || !product.id) return;
    
    setIsAdding(true);
    
    try {
      // Format the payload based on the product data
      const payload: AddToCartPayload = {
        productId: product.id,
        quantity: 1,
        // If your schema requires a variantId for adding to cart, 
        // you can extract it here, e.g.: variantId: product.variants?.[0]?.id
      };

      await CartApi.addToCart(payload);
      
      // Optional: Add toast notification success here
      console.log(`Successfully added ${product.name} to cart!`);
      
      // Optional: If you use Zustand or React Query, trigger a cart refresh here
      // useCartStore.getState().fetchCart(); 
      // OR queryClient.invalidateQueries(["cart"]);

    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optional: Add toast notification error here
    } finally {
      setIsAdding(false);
    }
  };

  return { handleAddToCart, isAdding };
}