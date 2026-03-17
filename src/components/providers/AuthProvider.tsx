"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/api-client";
import { User, RefreshResponse } from "@/types/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAuth, setAccessToken, setGuest } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔍 [Auth] Checking session...");

        // ✅ IMPORTANT: no AxiosResponse type here
        const user = (await apiClient.get("/auth/me")) as User;

        setAuth(user, "");

        // ✅ Refresh AFTER user
        const refreshRes = (await apiClient.post("/auth/refresh")) as RefreshResponse;

        if (refreshRes?.access_token) {
          setAccessToken(refreshRes.access_token);
          console.log("🔐 [Auth] Token restored");
        }

      } catch (error) {
        console.log("👤 Guest mode");
        setGuest();
      }
    };

    initAuth();
  }, [setAuth, setAccessToken, setGuest]);

  return <>{children}</>;
};