// src\components\product\ProductActionButtons.tsx

'use client';

import { useState } from 'react';
import { useAddToCart, useBuyNow } from '@/hooks/useCartActions';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart, Zap } from 'lucide-react';

interface ProductActionButtonsProps {
  productId: string;
  hasVariants: boolean;
  selectedVariantId?: string; // Passed down from your variant selector
  quantity: number;           // Passed down from your quantity selector
  availableStock: number;
}

export function ProductActionButtons({
  productId,
  hasVariants,
  selectedVariantId,
  quantity,
  availableStock,
}: ProductActionButtonsProps) {
  const addToCartMutation = useAddToCart();
  const buyNowMutation = useBuyNow();

  // Validation: If product has variants, one must be selected.
  const isSelectionIncomplete = hasVariants && !selectedVariantId;
  const isOutOfStock = availableStock < 1 || quantity > availableStock;
  
  const isDisabled = isSelectionIncomplete || isOutOfStock;

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId,
      variantId: selectedVariantId,
      quantity,
    });
  };

  const handleBuyNow = () => {
    buyNowMutation.mutate({
      productId,
      variantId: selectedVariantId,
      quantity,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
      {/* Add To Cart */}
      <Button
        type="button"
        variant="outline"
        className="flex-1 h-12 text-base font-semibold border-primary text-primary hover:bg-primary/5"
        disabled={isDisabled || addToCartMutation.isPending || buyNowMutation.isPending}
        onClick={handleAddToCart}
      >
        {addToCartMutation.isPending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <ShoppingCart className="mr-2 h-5 w-5" />
        )}
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>

      {/* Buy Now (Bypass Cart) */}
      <Button
        type="button"
        className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white"
        disabled={isDisabled || buyNowMutation.isPending || addToCartMutation.isPending}
        onClick={handleBuyNow}
      >
        {buyNowMutation.isPending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Zap className="mr-2 h-5 w-5 fill-current" />
        )}
        Buy Now
      </Button>
    </div>
  );
}