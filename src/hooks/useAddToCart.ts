import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartApi, AddToCartInput } from "@/services/cart.service";

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartInput) => CartApi.addToCart(data),

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old: any = []) => [
        ...old,
        newItem,
      ]);

      return { previousCart };
    },

    onError: (_err, _newItem, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}