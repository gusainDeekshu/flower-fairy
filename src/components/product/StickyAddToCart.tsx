// src\components\product\StickyAddToCart.tsx

"use client";

import { Product } from '@/types/product';

export default function StickyAddToCart({ product }: { product: Product }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gray-900 leading-none">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        {product.oldPrice > product.price && (
          <span className="text-xs text-green-600 font-medium mt-1">
            Save ₹{(product.oldPrice - product.price).toLocaleString('en-IN')}
          </span>
        )}
      </div>
      <button className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium py-3 px-4 rounded-full shadow-sm active:scale-95 transition-transform text-center">
        Add to Cart
      </button>
    </div>
  );
}