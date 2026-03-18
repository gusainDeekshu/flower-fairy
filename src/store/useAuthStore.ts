// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  user: User | null; // Allow null here
  accessToken: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;

  setAuth: (user: User | null, token: string | null) => void;
  setAccessToken: (token: string) => void;
  setGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isGuest: true,

      setAuth: (user, token) => {
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isGuest: false,
        });
      },

      setAccessToken: (token) =>
        set({ accessToken: token }),

      setGuest: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isGuest: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isGuest: true,
        }),
    }),
    {
      name: 'flower-fairy-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
    }
  )
);