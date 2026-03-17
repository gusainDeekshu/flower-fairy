// src/components/providers/AuthProvider.tsx
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/api-client";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, accessToken, setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    const syncSession = async () => {
      // If the store says we are logged in but the token is missing from RAM
      if (isAuthenticated && !accessToken) {
        try {
          console.log("🔄 [Auth] Token missing from memory. Fetching fresh token...");
          // This call sends the HttpOnly cookie automatically
          const response = await apiClient.post("/auth/refresh");
          
          // Use the flattened data from your interceptor
          if (response && (response as any).access_token) {
             setAccessToken((response as any).access_token);
             console.log("✅ [Auth] In-memory accessToken restored.");
          }
        } catch (error) {
          console.error("❌ [Auth] Session restoration failed:", error);
          logout();
        }
      }
    };

    syncSession();
  }, [isAuthenticated, accessToken, setAccessToken, logout]);

  return <>{children}</>;
};