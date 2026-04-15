// src/components/product/AddToCartButton.tsx
"use client";

import React, { useState } from 'react';
import { ShoppingCart, Loader2, Plus, Minus } from "lucide-react";
import { useCartStore } from '@/store/useCartStore';

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
  stock = 100 
}) => {
  // Pull from our single source of truth (Zustand)
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // Local loading state to show spinners during Zustand's async actions
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔥 FIX: Loose normalization guarantees it finds the item whether undefined or null
  const cartItem = items.find(
    (item) => 
      item.productId === product.id && 
      (item.variantId || undefined) === (variantId || undefined)
  );

  const currentQuantity = cartItem?.quantity || 0;

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

  if (stock <= 0) {
    return (
      <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-bold text-sm tracking-wide cursor-not-allowed">
        OUT OF STOCK
      </button>
    );
  }

  // Display quantity controls if item is in cart
  if (currentQuantity > 0) {
    return (
      <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-xl p-1 w-full h-[48px]">
        <button 
          onClick={handleDecrease}
          disabled={isProcessing}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-[#006044] disabled:opacity-50 transition-colors"
        >
          <Minus size={18} />
        </button>
        <span className="font-black text-gray-900 w-8 text-center text-lg">
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-[#006044]" /> : currentQuantity}
        </span>
        <button 
          onClick={handleIncrease}
          disabled={isProcessing || currentQuantity >= stock}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-[#006044] disabled:opacity-50 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
    );
  }

  // Default "Add to Cart" state
  return (
    <button 
      onClick={handleAddInitial}
      disabled={isProcessing}
      className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#006044] text-white h-[48px] rounded-xl font-bold text-sm tracking-wide transition-colors disabled:opacity-70 disabled:cursor-not-allowed group-hover:shadow-md"
    >
      {isProcessing ? (
        <span className="flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" /> ADDING...
        </span>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          ADD TO CART
        </>
      )}
    </button>
  );
};