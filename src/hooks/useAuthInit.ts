// src/hooks/useAuthInit.ts
"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";
import { User, RefreshResponse } from "@/types/auth";

export const useAuthInit = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setGuest = useAuthStore((s) => s.setGuest);

  useEffect(() => {
    const init = async () => {
      try {
        // ✅ Step 1: Refresh first
        const refreshRes = (await apiClient.post("/auth/refresh")) as RefreshResponse;

        if (refreshRes?.access_token) {
          setAccessToken(refreshRes.access_token);
        }

        // ✅ Step 2: Get user
        const user = (await apiClient.get("/auth/me")) as User;

        setAuth(user, "");

      } catch (error) {
        console.log("👤 Guest Mode Activated");
        setGuest();
      }
    };

    init();
  }, [setAuth, setAccessToken, setGuest]);
};