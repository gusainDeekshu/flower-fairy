// src/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "./useAuthStore";

export const useCartStore = create<any>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;
        set({ isLoading: true });
        try {
          const res = await cartService.getCart();
          const normalized = (res?.items || []).map((item: any) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.price,
            image: item.product.images[0],
            quantity: item.quantity,
          }));
          set({ items: normalized });
        } catch (error) {
          console.error("fetchCart failed", error);
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        const { items } = get();
        const { user } = useAuthStore.getState();
        if (!user || items.length === 0) return;
        
        try {
          // Push local guest items to the database
          for (const item of items) {
            await cartService.addToCart(item.productId, item.quantity);
          }
          await get().fetchCart();
        } catch (err) {
          console.error("❌ [CartStore] Sync failed:", err);
        }
      }, // Ensure this comma exists

      addItem: async (newItem: any) => {
        const { user } = useAuthStore.getState();
        if (user) {
          try {
            await cartService.addToCart(newItem.productId, newItem.quantity);
            await get().fetchCart();
          } catch (err) {
            console.error("Failed to add item to remote cart", err);
          }
        } else {
          const currentItems = get().items;
          const existing = currentItems.find((i: any) => i.productId === newItem.productId);
          if (existing) {
            set({ items: currentItems.map((i: any) => 
              i.productId === newItem.productId ? { ...i, quantity: i.quantity + newItem.quantity } : i
            )});
          } else {
            set({ items: [...currentItems, newItem] });
          }
        }
      },

      clearCart: () => set({ items: [] }),
    }),
    { 
      name: "flower-fairy-cart",
      partialize: (state: any) => ({ items: state.items }) 
    }
  )
);