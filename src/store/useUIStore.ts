// src\store\useUIStore.ts

import { create } from "zustand";


interface UIState {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  
  // ADD THESE 3 LINES:
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  
  // ADD THESE 3 LINES:
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));