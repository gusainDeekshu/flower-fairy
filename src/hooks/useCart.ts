// src\hooks\useCart.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/services/cart.service";
import { AddToCartPayload } from "@/types/cart";

export const useCart = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Cart
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.getCart,
  });

  // 2. Add to Cart
  const addToCart = useMutation({
    mutationFn: (payload: AddToCartPayload) => CartService.addToCart(payload),
    onSuccess: () => {
      // 🔥 THIS IS THE MAGIC LINE: It tells React to instantly fetch the new cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 3. Update Quantity (with Optimistic UI)
  const updateQuantity = useMutation({
    mutationFn: (payload: {
      productId: string;
      quantity: number;
      variantId?: string;
    }) => CartService.updateQuantity(payload),
    onMutate: async ({ productId, quantity, variantId }) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item: any) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item,
          ),
        };
      });

      // Return context for rollback
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on failure
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      // Always sync with server eventually
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 4. Remove Item
  const removeItem = useMutation({
    mutationFn: (payload: { productId: string; variantId?: string }) =>
      CartService.removeItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 5. Clear Cart
  const clearCart = useMutation({
    mutationFn: CartService.clearCart,
    onSuccess: () => {
      queryClient.setQueryData(["cart"], null); // Instantly clear UI
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};
