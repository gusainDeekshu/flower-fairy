// src/hooks/useCartSync.ts
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

export const useCartSync = () => {
  const { user } = useAuthStore();
  const syncCart = useCartStore((s) => s.syncCart);

  useEffect(() => {
    if (user) {
      syncCart();
    }
  }, [user]);
};