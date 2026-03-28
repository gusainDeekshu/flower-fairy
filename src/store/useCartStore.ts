// src\store\useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "./useAuthStore";

// 🔥 1. ADD THIS INTERFACE AND EXPORT IT
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  storeId?: string;
}

// 🔥 2. Update CartState to use CartItem[] instead of any[]
interface CartState {
  items: CartItem[]; 
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        // 🔥 Get the LATEST user state dynamically
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) return; 

        set({ isLoading: true });
        try {
          const res: any = await cartService.getCart();
          
          // Safety check: Ensure items exist in response
          if (res && res.items) {
            const normalized = res.items.map((item: any) => ({
              productId: item.productId,
              name: item.product.name,
              price: item.price,
              image: item.product.images?.[0] || "",
              quantity: item.quantity,
              storeId: item.product.storeId, 
            }));
            
            set({ items: normalized });
          } else {
             set({ items: [] });
          }
        } catch (error) {
          console.error("fetchCart failed", error);
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        const { items, fetchCart } = get();
        const currentUser = useAuthStore.getState().user;
        
        if (!currentUser) return;
        if (items.length === 0) {
          await fetchCart();
          return;
        }

        try {
          // Sync all local guest items to the backend in parallel
          await Promise.all(
            items.map((item: any) => cartService.addToCart(item.productId, item.quantity))
          );
          // Pull the final merged cart from the DB
          await fetchCart();
        } catch (err) {
          console.error("Cart Sync failed:", err);
        }
      },

      addItem: async (newItem: any) => {
        const currentUser = useAuthStore.getState().user;
        
        if (currentUser) {
          try {
            // Logged in: Add to DB, then fetch updated cart
            await cartService.addToCart(newItem.productId, newItem.quantity);
            await get().fetchCart();
          } catch (err) {
            console.error("Failed to add item to remote cart", err);
          }
        } else {
          // Guest: Manage state locally
          const currentItems = get().items;
          const existing = currentItems.find((i: any) => i.productId === newItem.productId);
          
          if (existing) {
            set({
              items: currentItems.map((i: any) =>
                i.productId === newItem.productId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            });
          } else {
            set({ items: [...currentItems, newItem] });
          }
        }
      },
      removeItem: async (productId: string) => {
        const { user } = useAuthStore.getState();
        if (user) {
          try {
            await cartService.removeItem(productId);
            await get().fetchCart();
          } catch (err) {
            console.error("Remove failed", err);
          }
        } else {
          set({
            items: get().items.filter((i: any) => i.productId !== productId),
          });
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        const { user } = useAuthStore.getState();
        if (user) {
          try {
            await cartService.updateQuantity(productId, quantity);
            await get().fetchCart();
          } catch (err) {
            console.error("Update failed", err);
          }
        } else {
          set({
            items: get().items.map((i: any) =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
          });
        }
      },

      clearCart: async () => {
        const { user } = useAuthStore.getState();
        if (user) await cartService.clearCart();
        set({ items: [] });
      },
    }),
    {
      name: "flower-fairy-cart",
      partialize: (state: any) => ({ items: state.items }),
    },
  ),
);
