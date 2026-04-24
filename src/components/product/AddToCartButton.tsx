// src/components/product/AddToCartButton.tsx



"use client";

import React, { useState } from "react";
import { ShoppingCart, Loader2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  variantId?: string;
  stock?: number;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variantId,
  stock = 100,
}) => {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const [isProcessing, setIsProcessing] = useState(false);

  const cartItem = items.find(
    (item) =>
      item.productId === product.id &&
      (item.variantId || undefined) === (variantId || undefined)
  );

  const currentQuantity = cartItem?.quantity || 0;

  /* ---------------- ACTIONS ---------------- */

  const handleAddInitial = async () => {
    if (stock <= 0) return;
    setIsProcessing(true);
    await addItem({
      productId: product.id,
      variantId,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1,
    });
    setIsProcessing(false);
  };

  const handleIncrease = async () => {
    if (currentQuantity >= stock) return;
    setIsProcessing(true);
    await updateQuantity(product.id, currentQuantity + 1, variantId);
    setIsProcessing(false);
  };

  const handleDecrease = async () => {
    setIsProcessing(true);
    if (currentQuantity === 1) {
      await removeItem(product.id, variantId);
    } else {
      await updateQuantity(product.id, currentQuantity - 1, variantId);
    }
    setIsProcessing(false);
  };

  /* ---------------- OUT OF STOCK ---------------- */

  if (stock <= 0) {
    return (
      <button
        disabled
        className="w-full h-12 rounded-xl bg-muted text-muted-foreground text-sm font-semibold tracking-wide cursor-not-allowed"
        aria-disabled="true"
      >
        Out of Stock
      </button>
    );
  }

  /* ---------------- QUANTITY STATE ---------------- */

  if (currentQuantity > 0) {
    return (
      <div
        className="flex items-center justify-between w-full h-12 rounded-xl border border-border bg-card px-1"
        role="group"
        aria-label="Update cart quantity"
      >
        <button
          onClick={handleDecrease}
          disabled={isProcessing}
          aria-label="Decrease quantity"
          className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted transition disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="text-base font-semibold text-foreground w-8 text-center">
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            currentQuantity
          )}
        </span>

        <button
          onClick={handleIncrease}
          disabled={isProcessing || currentQuantity >= stock}
          aria-label="Increase quantity"
          className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  /* ---------------- DEFAULT CTA ---------------- */

  return (
    <button
      onClick={handleAddInitial}
      disabled={isProcessing}
      className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
      aria-label="Add product to cart"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </>
      )}
    </button>
  );
};