// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  // 🗑️ REMOVED: token: any; (We don't need this anymore, we use accessToken)
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string | null) => void; 
  setAccessToken: (token: string) => void;
  setGuest: () => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: !!token, 
        }),

      setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),

      setGuest: () => set({ user: null, accessToken: null, isAuthenticated: false }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "flower-fairy-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        accessToken: state.accessToken, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);