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
  quantity: number;
}