"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore"; // 🔥 Import Cart Store
import apiClient from "@/lib/api-client";
import { AuthResponse } from "@/types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, logout, _hasHydrated } = useAuthStore();
  const { fetchCart } = useCartStore(); // 🔥 Get fetchCart action
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await apiClient.get<any, AuthResponse>("/auth/me");
        
        if (res && res.access_token && res.user && res.user.name) {
          // 1. Restore Auth State
          setAuth(res.user as any, res.access_token);
          
          // 2. 🔥 FETCH CART NOW: Now that we have a token, grab the user's cart
          await fetchCart(); 
        } else {
          logout();
        }
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
  }, [_hasHydrated, setAuth, logout, fetchCart]);

  if (!_hasHydrated || loading) {
  return (
    <div className="p-6 space-y-6">
      
      {/* Header skeleton */}
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>

      {/* Cards */}
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