// src/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "./useAuthStore"; // Assumes you have an auth store

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        set({ isLoading: true });
        try {
          const response = await cartService.getCart();

          // DEBUG: This will show exactly what your interceptor is passing through
          console.log("📦 [Frontend Debug] API Response:", response);

          // Some NestJS setups wrap data in a 'data' property automatically.
          // We check both possibilities to be safe.
          const cartData = response?.data || response;
          const items = cartData?.items || [];

          set({ items });
        } catch (error) {
          console.error("❌ [Frontend Debug] fetchCart failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (newItem) => {
        const { user } = useAuthStore.getState();

        if (user) {
          try {
            // 1. Sync with Backend
            await cartService.addToCart(newItem.productId, newItem.quantity);

            // 2. Immediately fetch the fresh state from the server
            await get().fetchCart();
          } catch (err) {
            console.error("Failed to add item to remote cart", err);
          }
        } else {
          // ... your local guest logic
          // Local Only Logic (Your original code)
          const items = get().items;
          const existingItem = items.find(
            (i) =>
              i.productId === newItem.productId &&
              i.variantId === newItem.variantId,
          );

          if (existingItem) {
            set({
              items: items.map((i) =>
                i.productId === newItem.productId &&
                i.variantId === newItem.variantId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i,
              ),
            });
          } else {
            set({ items: [...items, newItem] });
          }
        }
      },

      removeItem: async (id) => {
        const { user } = useAuthStore.getState();
        if (user) {
          await cartService.removeItem(id);
          await get().fetchCart();
        } else {
          set({ items: get().items.filter((i) => i.productId !== id) });
        }
      },

      updateQuantity: async (id, qty) => {
        const { user } = useAuthStore.getState();
        if (user) {
          // Backend patch for quantity
          await cartService.updateQuantity(id, qty);
          await get().fetchCart();
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === id ? { ...i, quantity: qty } : i,
            ),
          });
        }
      },

      clearCart: async () => {
        const { user } = useAuthStore.getState();
        if (user) await cartService.clearCart();
        set({ items: [] });
      },

      setCart: (items) => set({ items }),
    }),
    {
      name: "flower-fairy-cart",
      // Don't persist backend data in localStorage if logged in
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
