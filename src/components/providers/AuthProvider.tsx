// src/components/providers/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios"; // 🔥 IMPORT RAW AXIOS
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, logout, _hasHydrated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 🔥 1. Use raw axios to bypass interceptors! 
        // This quietly sends the HttpOnly cookie to the backend.
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true } // Crucial: forces browser to send the cookie
        );

        // 🔥 2. Restore Auth State in Zustand
        setAuth(data.user, data.access_token);
        
        // 🔥 3. Fetch the cart now that we are securely authenticated
        await fetchCart(); 

      } catch (err) {
        // If the cookie is missing or expired, gracefully become a guest
        console.warn("No active session. Remaining as guest.");
        logout();
      } finally {
        // Stop the loading skeleton
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

        {/* Cards skeleton */}
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