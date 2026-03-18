// src/components/providers/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/api-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data } = await apiClient.get("/auth/me");

        if (!isMounted) return;

        setAuth(data.user, data.access_token);
      } catch (err) {
        if (!isMounted) return;

        console.log("No session found");
        logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}