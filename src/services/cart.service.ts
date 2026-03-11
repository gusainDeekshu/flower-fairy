export interface AddToCartInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export const CartApi = {
  async addToCart(input: AddToCartInput) {
    const res = await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Cart update failed");
    }

    return res.json();
  },
};