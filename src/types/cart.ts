// src\types\cart.ts
export interface CartItem {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string; // Optional, omit if product has no variants
  quantity: number;
}


export interface BuyNowPayload extends AddToCartPayload {}

export interface CheckoutSessionResponse {
  success: boolean;
  checkoutSessionId: string;
  expiresAt: string;
}