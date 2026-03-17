import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null; // In-memory short-lived token
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void; // Method to update token after refresh
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
     setAuth: (user, token) => {
  console.log("🔐 [Store] Setting Access Token in Memory:", token.substring(0, 10) + "...");
  set({ 
    user, 
    accessToken: token, // This matches the 'accessToken' used in api-client
    isAuthenticated: true 
  });
},
      setAccessToken: (token) => 
        set({ accessToken: token }),
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        // Optional: Call backend /auth/logout to clear HttpOnly cookies
      },
    }),
    {
      name: 'flower-fairy-auth',
      storage: createJSONStorage(() => localStorage),
      // IMPORTANT: Only persist non-sensitive data. 
      // Do NOT persist accessToken to localStorage for production safety.
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);