// src\hooks\useCartActions.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartService } from '@/services/cart.service';
import { CheckoutService } from '@/services/checkout.service';
import { AddToCartPayload, BuyNowPayload } from '@/types/cart';
import { toast } from 'sonner'; // Or your preferred toast library
import { useRouter } from 'next/navigation';

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => CartService.addToCart(payload),
    onSuccess: () => {
      // Refresh the cart icon/drawer globally
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    },
  });
};

export const useBuyNow = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: BuyNowPayload) => CheckoutService.buyNow(payload),
    onSuccess: (data) => {
      // Bypass cart and go straight to secure checkout session
      router.push(`/checkout/${data.checkoutSessionId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Item out of stock or unavailable');
    },
  });
};