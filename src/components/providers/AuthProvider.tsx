// src/components/providers/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios"; 
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, logout, _hasHydrated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true } 
        );

        // 1. Restore Auth State
        setAuth(data.user, data.access_token);
        
        // 🔥 FIX: ON PAGE REFRESH, ONLY FETCH! NEVER SYNC!
        // Because Zustand persists the DB cart in local storage, calling syncCart 
        // here would blindly send those saved items back to the backend, causing 
        // the database quantities to double on every refresh.
        const { fetchCart } = useCartStore.getState();
        await fetchCart(); 

      } catch (err) {
        console.warn("No active session. Remaining as guest.");
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (_hasHydrated) {
      initAuth();
    }
  }, [_hasHydrated, setAuth, logout]);

  if (!_hasHydrated || loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}