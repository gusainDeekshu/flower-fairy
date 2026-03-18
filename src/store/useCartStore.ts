// src/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "./useAuthStore";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
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
          const items = (response?.items || []).map((item: any) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.price,
            image: item.product.images[0],
            quantity: item.quantity,
          }));
          set({ items });
        } catch (error) {
          console.error("fetchCart failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (newItem) => {
        const { user } = useAuthStore.getState();
        if (user) {
          try {
            await cartService.addToCart(newItem.productId, newItem.quantity);
            await get().fetchCart();
          } catch (err) {
            console.error("Failed to add item to remote cart", err);
          }
        } else {
          const items = get().items;
          const existing = items.find((i) => i.productId === newItem.productId);
          if (existing) {
            set({ items: items.map((i) => i.productId === newItem.productId 
              ? { ...i, quantity: i.quantity + newItem.quantity } : i) });
          } else {
            set({ items: [...items, newItem] });
          }
        }
      },

      syncCart: async () => {
        const { items } = get();
        const { user } = useAuthStore.getState();
        if (!user || items.length === 0) return;
        try {
          for (const item of items) {
            await cartService.addToCart(item.productId, item.quantity);
          }
          await get().fetchCart();
        } catch (err) {
          console.error("Cart sync failed:", err);
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { user } = useAuthStore.getState();
        if (user) {
          await cartService.updateQuantity(productId, quantity);
          await get().fetchCart();
        } else {
          set({ items: get().items.map((i) => i.productId === productId ? { ...i, quantity } : i) });
        }
      },

      removeItem: async (productId) => {
        const { user } = useAuthStore.getState();
        if (user) {
          await cartService.removeItem(productId);
          await get().fetchCart();
        } else {
          set({ items: get().items.filter((i) => i.productId !== productId) });
        }
      },

      clearCart: async () => {
        const { user } = useAuthStore.getState();
        if (user) await cartService.clearCart();
        set({ items: [] });
      },
    }),
    { name: "flower-fairy-cart", partialize: (state) => ({ items: state.items }) }
  )
);